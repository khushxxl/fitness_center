import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../../utils/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getBlobFroUri, screens } from "../../utils/constants";
import { useStripe } from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfileSheet from "../CustomComponents/EditProfileSheet";
import CustomIcon from "../CustomIcon";
import { getAuth, signOut } from "firebase/auth";
import { ActivityIndicator } from "react-native";

const UserProfile = ({ navigation, showUserProfile, setShowUserProfile }) => {
  const { appUser, getUser, setappUser } = useContext(AppContext);
  const auth = getAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  const signOutUser = async () => {
    await signOut(auth);
  };

  const OptionsBox = ({ onClick, title, iconName }) => {
    return (
      <TouchableOpacity
        onPress={onClick}
        style={{
          backgroundColor: "white",
          padding: 10,
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 10,
          marginTop: 8,
          borderWidth: 0.5,
          borderColor: "gray",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name={iconName} size={25} />
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 15 }}>
            {title}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={25} />
      </TouchableOpacity>
    );
  };

  const DataBox = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          width: "auto",
          alignSelf: "flex-start",
          padding: 8,
          borderRadius: 8,
          borderWidth: 0.5,
          borderColor: "gray",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Ionicons color={"#0086C9"} name="flame-outline" size={25} />
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 5,
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          20,000
        </Text>
        <Text
          style={{ textAlign: "center", fontWeight: "400", color: "#344054" }}
        >
          Calories Burned
        </Text>
      </TouchableOpacity>
    );
  };
  const [showEditProfileSheet, setshowEditProfileSheet] = useState(false);

  console.log("APpuser", appUser);

  const deleteAccount = async () => {
    Alert.alert(
      "This action is non-reversible",
      "This action will delete your account",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await deleteDoc(doc(db, "users", auth.currentUser?.email)).then(
              async () => {
                await auth.currentUser?.delete();
                await signOutUser();
              }
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  const uploadImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const filename = auth.currentUser?.uid + Date.now() + ".jpg";
        const storageRef = ref(storage, `profilePictures/${filename}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        await updateDoc(doc(db, "users", auth.currentUser?.email), {
          photoURL: downloadURL,
        });

        Alert.alert("Success", "Profile picture updated successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image. Please try again.");
    }
  };
  const [imageLoading, setimageLoading] = useState(false);
  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <EditProfileSheet
        setModal={setshowEditProfileSheet}
        modal={showEditProfileSheet}
      />
      <View style={{ marginLeft: 10 }}>
        <CustomIcon
          name={"close-outline"}
          onClick={() => setShowUserProfile(false)}
          styles={false}
        />
      </View>

      <View
        style={{ alignSelf: "center", marginTop: 30, alignItems: "center" }}
      >
        <TouchableOpacity>
          {userData?.photo ? (
            <Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 35,
              }}
              source={{ uri: userData.photo }}
              onLoadStart={() => setimageLoading(true)}
              onLoadEnd={() => setimageLoading(false)}
            />
          ) : (
            <View>
              <Ionicons name="person-outline" size={35} />
            </View>
          )}
          {imageLoading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            marginTop: 10,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {userData?.displayName}
        </Text>
      </View>

      <View style={{ marginTop: 20, justifyContent: "center" }}>
        <OptionsBox
          title={"Edit Profile"}
          onClick={async () => {
            setshowEditProfileSheet(true);
          }}
          iconName={"person-outline"}
        />
        <OptionsBox
          iconName={"lock-closed-outline"}
          title={"Sign out"}
          onClick={signOutUser}
        />
        <OptionsBox
          iconName={"stats-chart-outline"}
          title={"Track Progress"}
          onClick={() => navigation.navigate(screens.TrackProgress)}
        />
        <OptionsBox
          iconName={"trash"}
          title={"Delete Account"}
          onClick={deleteAccount}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
