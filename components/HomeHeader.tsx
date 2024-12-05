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
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {userData && userData?.photo ? (
          <TouchableOpacity onPress={onImagePress}>
            <Image
              source={{ uri: userData.photo }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onImagePress}>
            <Ionicons name="person-circle-outline" size={30} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.centerContainer}>
        <Image source={images.fc_header_img} style={styles.headerImage} />
      </View>
      <View style={styles.rightContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(screens.Inbox);
          }}
          style={styles.iconButton}
        >
          <Ionicons color={"black"} size={27} name="chatbox-ellipses-outline" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons size={27} name="notifications-outline" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 2,
    alignItems: "center",
  },
  rightContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "lightgray",
  },
  headerImage: {
    height: 20,
    width: 170,
  },
  iconButton: {
    marginLeft: 10,
  },
});
