import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import HomeHeader from "../HomeHeader";
import { images, screens } from "../../utils/constants";
import UserCard from "../UserCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "../../utils/firebase";

const TrainerHome = ({ navigation }) => {
  const ClientInfo = ({ textTitle, textSubtitle }) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>{textTitle}</Text>
        <Text style={{ fontWeight: "600", color: "#475467", fontSize: 15 }}>
          {textSubtitle}
        </Text>
      </View>
    );
  };

  const ActionCard = ({ onClick, title }) => {
    return (
      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 15,
        }}
      >
        <Text style={{ fontSize: 17 }}>{title}</Text>
        <TouchableOpacity
          onPress={onClick}
          style={{
            borderWidth: 1.5,
            alignSelf: "flex-start",
            padding: 4,
            borderColor: "#3b3b3b",
            borderRadius: 3,
          }}
        >
          <Ionicons name="add-outline" size={18} color={"#3b3b3b"} />
        </TouchableOpacity>
      </View>
    );
  };

  const [trainerUsers, settrainerUsers] = useState<any>([]);

  const getTrainerUsers = async () => {
    const q = query(
      collection(db, "users"),
      where("trainer", "==", "trainer@gmail.com")
    );
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      users.push(doc.data());
    });
    await settrainerUsers(users);
    await console.log(trainerUsers);
  };

  useEffect(() => {
    getTrainerUsers();
  }, []);

  return (
    <SafeAreaView>
      <HomeHeader navigation={navigation} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: 20,
          width: "100%",
        }}
      >
        <ClientInfo textTitle={trainerUsers.length} textSubtitle={"Client"} />
        <ClientInfo textTitle={24} textSubtitle={"Plans"} />

        <ClientInfo textTitle={12} textSubtitle={"Exercises"} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 30,
          marginHorizontal: 20,
        }}
      >
        <Text style={{ fontWeight: "500", color: "black", fontSize: 15 }}>
          Users
        </Text>
        <TouchableOpacity>
          <Text style={{ fontWeight: "500", color: "blue", fontSize: 15 }}>
            View All
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 20 }}>
        {trainerUsers &&
          trainerUsers.map((data, i) => {
            return <UserCard key={i} name={data?.email} dateJoined="Joined" />;
          })}
      </View>

      <View style={{ marginTop: 10, marginLeft: 20 }}>
        <Text style={{ fontSize: 15 }}>Quick Actions</Text>
        <ActionCard onClick={undefined} title={"Add a new meal plan"} />
        <ActionCard
          onClick={() => {
            navigation.navigate(screens.AddWorkouts, {
              allUsers: trainerUsers,
            });
          }}
          title={"Add a new exercise plan"}
        />
        <ActionCard onClick={undefined} title={"Podcast / Video"} />
      </View>
    </SafeAreaView>
  );
};

export default TrainerHome;

const styles = StyleSheet.create({});
