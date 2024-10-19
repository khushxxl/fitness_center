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
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../utils/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getBlobFroUri, screens } from "../../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditProfileSheet from "../CustomComponents/EditProfileSheet";
import CustomIcon from "../CustomIcon";
import { useAuth, useUser } from "@clerk/clerk-expo";
import {  deleteDoc } from "firebase/firestore";

const UserProfile = ({ navigation, showUserProfile, setShowUserProfile }) => {
  const { appUser, getUser, setappUser } = useContext(AppContext);
  const { signOut, isSignedIn } = useAuth();
  const signOutUser = async () => {
    signOut();
  };
  useEffect(() => {
    if (!isSignedIn) {
      navigation.navigate(screens.AuthScreen);
    }
  }, [isSignedIn]);
  const [image, setImage] = useState(appUser?.photo);

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
  const { user } = useUser();
  const [showEditProfileSheet, setshowEditProfileSheet] = useState(false);

  console.log("APpuser", appUser);

  const deleteAccount =async()=>{

    Alert.alert(
      "This action is non-reversible",
      "This action will delete your account",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async() =>{
             await deleteDoc(doc(db, "users", user?.emailAddresses[0].emailAddress)).then(async()=>{
              await signOut()
             })
          }
        }
      ],
      { cancelable: true }
    );


   


  }
  return (
    <SafeAreaView
      style={{
        // backgroundColor: "#EAECF0",
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
      {/* <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
          Profile
        </Text>
      </View> */}

      <View
        style={{ alignSelf: "center", marginTop: 30, alignItems: "center" }}
      >
        <TouchableOpacity>
          {user?.hasImage ? (
            <Image
              style={{
                height: 100,
                width: 100,
                borderRadius: 35,
              }}
              source={{ uri: user?.imageUrl }}
            />
          ) : (
            <View>
              <Ionicons name="person-outline" size={35} />
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
          {user?.username}
        </Text>
      </View>

      {/* <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <DataBox />
        <DataBox />
        <DataBox />
      </View> */}

      <View style={{ marginTop: 20, justifyContent: "center" }}>
        <OptionsBox
          title={"Edit Profile"}
          onClick={async () => {
            setshowEditProfileSheet(true);
          }}
          iconName={"person-outline"}
        />
        {/* <OptionsBox
          iconName={"card-outline"}
          title={"Subscribe"}
          onClick={() => {
            navigation.navigate(screens.Payment);
          }}
        /> */}
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
          iconName={'trash'}
          title={"Delete Account"}
          onClick={deleteAccount}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});
