import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images, screens } from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../context/AppContext";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const HomeHeader = ({ navigation, onImagePress }) => {
  const { appUser } = useContext(AppContext);
  const [userData, setUserData] = useState(null);
  const auth = getAuth();

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

  return (
    <View
      style={{
        padding: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {userData && userData?.photo ? (
        <TouchableOpacity onPress={onImagePress}>
          <Image
            source={{ uri: userData.photo }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 25,
              borderWidth: 2,
              borderColor: "lightgray",
            }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={onImagePress}>
          <Ionicons name="person-circle-outline" size={30} />
        </TouchableOpacity>
      )}
      {/* <Text style={{ fontWeight: "bold", fontSize: 17 }}>{appUser?.email}</Text> */}
      <View style={{}}>
        <Image
          source={images.fcTextLogo}
          style={{ height: 10, width: 130, alignSelf: "center" }}
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(screens.Inbox);
          }}
          style={{ marginRight: 10 }}
        >
          <Ionicons color={"black"} size={27} name="chatbox-ellipses-outline" />
        </TouchableOpacity>

        <TouchableOpacity
          // onPress={() => navigation.navigate(screens.Question)}
          style={{}}
        >
          <Ionicons size={27} name="notifications-outline" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({});
