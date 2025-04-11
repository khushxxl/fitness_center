import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import ChatBox from "../../components/ChatBox";
import { AppContext } from "../../context/AppContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";

const Inbox = ({ navigation }) => {
  const { userData, checkTrainer } = useContext(AppContext);
  console.log("inbox", userData);
  const [chats, setchats] = useState<any>([]);
  const [inboxMessages, setinboxMessages] = useState<any>([]);
  const [trainerData, settrainerData] = useState<any>();

  console.log("trainer->", trainerData);

  //   /test01@gmail.comtrainer@gmail.com/acht;

  useEffect(() => {
    getTrainer();
    getAllInChatMessages();
    getTrainerUserList();
  }, []);

  const getTrainer = async () => {
    const docRef = doc(db, "users", userData?.trainer);
    const docSnap = await getDoc(docRef);
    settrainerData(docSnap.data());
    console.log("Trainer from get Trainer", docSnap.data());
  };

  const getAllInChatMessages = async () => {
    const query = collection(
      db,
      `chats/${userData?.email + userData?.trainer}/chat`
    );
    const querySnapshot = await getDocs(query);
    const messages = [];
    querySnapshot.forEach(async (doc) => {
      // console.log(doc.data());
      await messages.push(doc.data());
    });
    setchats(messages);
  };

  // const getAllMessages = async () => {
  //   const query = collection(db, "chats");
  //   const querySnapshot = await getDocs(query);
  //   const messages = [];
  //   querySnapshot.forEach(async (doc) => {
  //     console.log(doc.data());
  //     await messages.push(doc.data());
  //   });
  //   setinboxMessages(messages);
  //   console.log("Messages", messages);
  // };

  const [trainerUsers, settrainerUsers] = useState<any>();

  const getTrainerUserList = async () => {
    const ref = collection(db, "users");
    const queryData = query(ref, where("trainer", "==", userData?.email));
    const querySnapshot = await getDocs(queryData);
    const users = [];
    querySnapshot.forEach(async (doc) => {
      console.log("User query:", doc.data());
      await users.push(doc.data());
    });
    settrainerUsers(users);
    console.log("usersss", trainerUsers);
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getAllInChatMessages();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 18 }}>
          Inbox
        </Text>
      </View>
      <TouchableOpacity
        style={{ marginLeft: 10 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text>Back</Text>
      </TouchableOpacity>

      <ScrollView
        refreshControl={
          <RefreshControl
            colors={["black"]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{ height: "100%" }}
      >
        {!userData?.isTrainer && (
          <ChatBox
            sender={userData}
            navigation={navigation}
            reciever={trainerData}
            data={trainerData}
          />
        )}
        {userData?.isTrainer &&
          trainerUsers &&
          trainerUsers.map((data, i) => {
            return (
              <ChatBox
                key={i}
                data={data}
                navigation={navigation}
                sender={userData}
                reciever={data}
              />
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Inbox;

const styles = StyleSheet.create({});
