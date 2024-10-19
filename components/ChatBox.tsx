import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { screens } from "../utils/constants";

const ChatBox = ({ data, navigation, sender, reciever }) => {
  const { appUser, isTrainer } = useContext(AppContext);
  const [userTrainer, setuserTrainer] = useState<any>();

  const getUserTrainer = async () => {
    const docRef = doc(db, "trainers", appUser.trainer);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setuserTrainer(docSnap.data());
      console.log("Document Trainer data:", userTrainer);
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  useEffect(() => {}, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(screens.ChatScreen, { sender, reciever });
      }}
      style={{ marginTop: 20 }}
    >
      {/* <View style={styles.horizontalLine} /> */}
      <View
        style={{
          margin: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-evenly",
          marginVertical: 16,
        }}
      >
        <View>
          <Image
            src={data?.photo}
            style={{ height: 50, width: 50, borderRadius: 25 }}
          />
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{data?.name}</Text>
          <Text style={{ fontWeight: "300", color: "gray" }}>
            {"Lorem ipsum et sea ea nonumy takimat."}
          </Text>
        </View>
        <View>
          <Ionicons name="ellipsis-vertical-outline" size={20} />
        </View>
      </View>
      {/* <View style={styles.horizontalLine} /> */}
    </TouchableOpacity>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  horizontalLine: {
    backgroundColor: "gray",
    width: "93%",
    height: 1,
    alignSelf: "center",
    opacity: 0.5,
  },
});
