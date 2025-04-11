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
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage, auth } from "../../utils/firebase";
import {
  getBlobFroUri,
  getChatTimeFormat,
  Trainer_Email,
} from "../../utils/constants";
import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const ChatScreen = ({ route, navigation }) => {
  const { sender, reciever } = route?.params;
  const userTrainer = JSON.parse(reciever);

  const [currentUser, setCurrentUser] = useState(null);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [mediaSelected, setMediaSelected] = useState(null);
  const [mediaBlob, setMediaBlob] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      }
    });

    getAllInChatMessages();
    setInterval(getAllInChatMessages, 6000);

    return () => {
      unsubscribe();
      // clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [allMessages]);

  const getAllInChatMessages = async () => {
    try {
      // The issue was here - we need to use sender instead of sender.email since sender is already the email string
      const chatPath = `chats/${sender + Trainer_Email}/chat`;
      // console.log("Fetching messages from path:", chatPath);

      const chatRef = collection(db, chatPath);
      const queryData = query(chatRef, orderBy("timestamp", "asc"));
      const querySnapshot = await getDocs(queryData);

      const messages = querySnapshot.docs.map((doc) => doc.data());
      // console.log("Fetched messages:", messages);
      setAllMessages(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      setMediaSelected(result.assets[0]);
      const blob = await getBlobFroUri(result.assets[0].uri);
      setMediaBlob(blob);
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() && !mediaSelected) return;
    if (!userTrainer) return;

    try {
      let downloadMediaURL;
      if (mediaSelected && mediaBlob) {
        const imageRef = ref(
          storage,
          `users/${currentUser?.displayName}/media/${mediaSelected?.name}`
        );
        await uploadBytes(imageRef, mediaBlob);
        downloadMediaURL = await getDownloadURL(imageRef);
      }

      const chatPath = `chats/${sender + Trainer_Email}/chat`;

      await addDoc(collection(db, chatPath), {
        sender,
        receiver: Trainer_Email,
        timestamp: serverTimestamp(),
        text: message,
        media: downloadMediaURL || null,
        timeSent: getChatTimeFormat(),
        mediaName: mediaSelected?.name || null,
      });

      await getAllInChatMessages();
      setMessage("");
      setMediaBlob(null);
      setMediaSelected(null);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderMessage = (data, index) => (
    <View key={index}>
      <View
        style={[
          styles.messageContainer,
          {
            alignSelf: data?.sender === sender ? "flex-end" : "flex-start",
          },
        ]}
      >
        <Text style={styles.messageText}>{data?.text}</Text>
        {data?.timeSent && (
          <Text style={styles.timeText}>{data?.timeSent}</Text>
        )}
      </View>

      {data?.media && (
        <TouchableOpacity
          onPress={() => Linking.openURL(data?.media)}
          style={[
            styles.mediaContainer,
            {
              alignSelf: data?.sender === sender ? "flex-end" : "flex-start",
            },
          ]}
        >
          <View style={styles.mediaContent}>
            <Ionicons name="document" size={35} color="black" />
            <Text style={styles.mediaName}>{data?.mediaName}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="open-outline" size={23} color="black" />
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={25} color="black" />
          </TouchableOpacity>
          <Image
            source={{ uri: userTrainer?.photo }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.userName}>{userTrainer?.name}</Text>
          <Text style={styles.userRole}>
            {!currentUser?.isTrainer ? " - Senior Trainer" : " - User"}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        keyboardDismissMode="on-drag"
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {allMessages.map((data, index) => renderMessage(data, index))}
      </ScrollView>

      <KeyboardAvoidingView style={styles.inputContainer} behavior="position">
        {mediaSelected && (
          <View style={styles.selectedMedia}>
            <View style={styles.mediaContent}>
              <Ionicons name="document" size={35} color="black" />
              <Text style={styles.mediaName}>{mediaSelected?.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setMediaSelected(null)}>
              <Ionicons name="close-outline" size={26} color="black" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <TouchableOpacity
            onPress={handleFileSelect}
            style={styles.attachButton}
          >
            <Ionicons name="document-outline" size={20} color="gray" />
          </TouchableOpacity>

          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            placeholder="Enter Message"
          />

          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="paper-plane-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerInfo: {
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  userName: {
    fontWeight: "bold",
  },
  userRole: {
    fontWeight: "bold",
  },
  messagesContainer: {
    height: "75%",
  },
  messageContainer: {
    backgroundColor: "#0086C9",
    padding: 7,
    marginTop: 10,
    borderRadius: 10,
    margin: 10,
    paddingHorizontal: 14,
  },
  messageText: {
    color: "white",
    fontWeight: "600",
    fontSize: 17,
  },
  timeText: {
    color: "lightgray",
    fontWeight: "600",
    fontSize: 12,
    marginTop: 5,
  },
  mediaContainer: {
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
  },
  mediaContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  mediaName: {
    marginLeft: 10,
    fontWeight: "500",
  },
  inputContainer: {
    position: "absolute",
    bottom: 30,
    width: "100%",
  },
  selectedMedia: {
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
  },
  inputWrapper: {
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
  },
  attachButton: {
    marginLeft: 5,
    marginRight: 20,
  },
  input: {
    flex: 1,
  },
  sendButton: {
    marginRight: 10,
  },
});
