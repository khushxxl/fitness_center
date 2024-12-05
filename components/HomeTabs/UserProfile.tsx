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
  const { getUser, setappUser, userData, setuserData } = useContext(AppContext);
  const auth = getAuth();

  const fetchUserData = async () => {
    try {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.email));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setuserData(data);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const signOutUser = async () => {
    await signOut(auth);
    navigation.navigate(screens.AuthScreen);
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

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <EditProfileSheet
        isVisible={showEditProfileSheet}
        onClose={() => setshowEditProfileSheet(false)}
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
                borderRadius: 50,
              }}
              source={{ uri: userData.photo }}
            />
          ) : (
            <View
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: "#f0f0f0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="person-outline" size={50} color="#666" />
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

        {(userData?.gender ||
          !userData?.age ||
          !userData?.userHealthData?.height ||
          !userData?.userHealthData?.weight ||
          !userData?.trainingGoal ||
          !userData?.sleepHours ||
          !userData?.trainingHours ||
          !userData?.allergies) && (
          <TouchableOpacity
            style={{
              padding: 15,
              width: "90%",
              borderRadius: 8,
              borderWidth: 0.5,
              borderColor: "gray",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 5,
              marginTop: 40,
              alignSelf: "center",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate(screens.Question)}
          >
            <Text style={{ fontWeight: "500" }}>Complete your Profile</Text>
            <Ionicons name="chevron-forward-outline" size={25} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
