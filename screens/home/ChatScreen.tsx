import {
  Image,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

import ChatBox from "../../components/ChatBox";
import CustomInput from "../../components/CustomInput";
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  or,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db, storage, auth } from "../../utils/firebase";
import { getBlobFroUri, getChatTimeFormat } from "../../utils/constants";
import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ChatScreen = ({ route, navigation }) => {
  const [userTrainer, setuserTrainer] = useState<any>();
  const [currentUser, setCurrentUser] = useState(null);
  const { sender, reciever } = route?.params;

  console.log("receiver ->", reciever);
  const [message, setmessage] = useState("");
  const [allMessages, setallMessages] = useState<any>([]);
  const [mediaSelected, setmediaSelected] = useState(null);
  const [mediaBlob, setmediaBlob] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
        setCurrentUser(user);
        if (!user.isTrainer) {
          console.log("User Account");
          getUserTrainer();
        }
      }
    });

    getAllInChatMessages();
    const interval = setInterval(() => {
      getAllInChatMessages();
    }, 5000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [allMessages]);

  const getAllInChatMessages = async () => {
    const messages = [];

    console.log(sender?.trainer);

    const ref = collection(db, `chats/${sender?.email + sender?.trainer}/chat`);
    const queryData = query(ref, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(queryData);
    querySnapshot.forEach(async (doc) => {
      console.log("doc");
      console.log("Doc", doc.data());
      await messages.push(doc.data());
    });

    setallMessages(messages);
    // console.log("Messages", messages);r
  };

  const getUserTrainer = async () => {
    const docRef = doc(db, "users", currentUser.trainer);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setuserTrainer(docSnap.data());

      console.log("Document Trainer data:", docSnap.data().name.toLowerCase());
      console.log(docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const sendMessage = async () => {
    const textTime = getChatTimeFormat();

    let downloadMediaURL;

    let imageRef;

    if (mediaSelected) {
      imageRef = ref(
        storage,
        `users/${currentUser?.displayName}/media/${mediaSelected?.name}`
      );
    }

    if (mediaSelected && mediaBlob) {
      await uploadBytes(imageRef, mediaBlob)
        .then(async (snapshot) => {
          downloadMediaURL = await getDownloadURL(imageRef);
          // await console.log(downloadURL);
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (message) {
      try {
        const docRef = await addDoc(
          collection(
            db,
            `chats/${
              currentUser?.isTrainer
                ? sender?.trainer + sender?.email
                : sender?.email + sender?.trainer
            }/chat`
          ),
          {
            sender: sender,
            receiver: reciever,
            timestamp: serverTimestamp(),
            text: message,
            media: downloadMediaURL ? downloadMediaURL : null,
            timeSent: textTime,
            mediaName: mediaSelected ? mediaSelected?.name : null,
          }
        );
        await getAllInChatMessages();
        setmessage("");
        setmediaBlob(null);
        setmediaSelected(null);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          margin: 10,
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back" size={25} color={"black"} />
          </TouchableOpacity>
          <Image
            src={reciever?.photo}
            style={{ height: 50, width: 50, borderRadius: 25, marginLeft: 10 }}
          />
        </View>
        <View
          style={{ marginLeft: 10, flexDirection: "row", alignItems: "center" }}
        >
          <Text style={{ fontWeight: "bold" }}>{reciever?.name}</Text>
          <Text style={{ fontWeight: "bold" }}>
            {!currentUser?.isTrainer ? " - Senior Trainer" : " - User"}
          </Text>
        </View>
      </View>

      <View>
        <ScrollView
          ref={scrollViewRef}
          keyboardDismissMode="on-drag"
          style={{ height: "75%" }}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {allMessages &&
            allMessages.map((data, i) => {
              console.log(data);
              return (
                <View key={i}>
                  <View
                    key={i}
                    style={{
                      backgroundColor: "#0086C9",
                      padding: 7,
                      marginTop: 10,
                      borderRadius: 10,
                      margin: 10,
                      alignSelf:
                        data?.sender?.email == sender?.email
                          ? "flex-end"
                          : "flex-start",
                      paddingHorizontal: 14,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "600",
                        fontSize: 17,
                      }}
                    >
                      {data?.text}
                    </Text>
                    {data?.timeSent && (
                      <Text
                        style={{
                          color: "lightgray",
                          fontWeight: "600",
                          fontSize: 12,
                          marginTop: 5,
                        }}
                      >
                        {data?.timeSent}
                      </Text>
                    )}
                  </View>
                  {data?.media && (
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(data?.media);
                      }}
                      style={{
                        backgroundColor: "white",
                        marginHorizontal: 10,
                        borderColor: "lightgray",
                        borderWidth: 1,
                        padding: 8,
                        borderRadius: 10,
                        marginVertical: 5,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        alignSelf:
                          data?.sender?.email == sender?.email
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Ionicons name="document" size={35} color={"black"} />
                        <Text style={{ marginLeft: 10, fontWeight: "500" }}>
                          {data?.mediaName}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() => setmediaSelected(null)}
                      >
                        <Ionicons
                          name="open-outline"
                          size={23}
                          color={"black"}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
        </ScrollView>
      </View>
      <KeyboardAvoidingView
        style={{ position: "absolute", bottom: 30, width: "100%" }}
        contentContainerStyle={{
          height: "100%",
          width: "100%",
          alignSelf: "center",
        }}
        behavior="position"
      >
        {mediaSelected && (
          <View
            style={{
              backgroundColor: "white",
              marginHorizontal: 10,
              borderColor: "lightgray",
              borderWidth: 0.5,
              padding: 8,
              borderRadius: 10,
              marginVertical: 5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="document" size={35} color={"black"} />
              <Text style={{ marginLeft: 10, fontWeight: "500" }}>
                {mediaSelected?.name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setmediaSelected(null)}>
              <Ionicons name="close-outline" size={26} color={"black"} />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            borderColor: "#D0D5DD",
            borderWidth: 2.7,
            padding: 10,
            borderRadius: 10,
            height: 50,
            justifyContent: "center",
            marginHorizontal: 10,
            flexDirection: "row",
            marginBottom: 3,
            backgroundColor: "white",
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              let result = await DocumentPicker.getDocumentAsync({});
              setmediaSelected(result.assets[0]);
              const blob = await getBlobFroUri(result.assets[0].uri);
              console.log(blob);
              setmediaBlob(blob);
            }}
            style={{ marginLeft: 5, marginRight: 20 }}
          >
            <Ionicons name="document-outline" size={20} color={"gray"} />
          </TouchableOpacity>

          <TextInput
            onChangeText={setmessage}
            style={{ flex: 1 }}
            placeholder="Enter Message"
            value={message}
          />

          <TouchableOpacity onPress={sendMessage} style={{ marginRight: 10 }}>
            <Ionicons name="paper-plane-outline" size={20} color={"gray"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
