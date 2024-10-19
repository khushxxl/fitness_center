import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Progress from "react-native-progress";

import { images, screens } from "../../utils/constants";
import SearchExercise from "../SearchExercise";
import usePedometer from "../../hooks/usePedometer";
import UserProfile from "./UserProfile";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AppContext } from "../../context/AppContext";
import * as MailComposer from "expo-mail-composer";
import { getAuth } from "firebase/auth";
import HomeHeader from "../HomeHeader";

const UserScreen = ({ navigation }) => {
  const [status, setStatus] = useState(null);

  // const { user } = useUser();
  const auth = getAuth();

  const user = auth?.currentUser;
  console.log("HomeScreen", user);
  const HomeCard = ({
    cardTitle,
    imageURL,
  }: {
    cardTitle: string;
    imageURL: string;
  }) => {
    return (
      <TouchableOpacity style={{}}>
        {imageURL && (
          <Image
            height={200}
            width={180}
            style={{ borderRadius: 10 }}
            source={{
              uri: imageURL,
            }}
          />
        )}

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{cardTitle}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const StatComponent = ({ text, data }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#E5E4E2",
          alignSelf: "flex-start",
          height: 120,
          padding: 10,
          width: 150,
          borderRadius: 14,
        }}
      >
        <Text style={{ fontWeight: "bold", marginTop: 10 }}>{text}</Text>
        <Text style={{ marginTop: 4, fontSize: 18, fontWeight: "bold" }}>
          {data}
        </Text>
      </TouchableOpacity>
    );
  };
  const { promoSections, setpromoSections } = useContext(AppContext);

  const handleEmailPress = () => {
    const calendarUrl = "https://cal.com/marc-risi/15min";

    // Open the calendar URL
    Linking.openURL(calendarUrl).catch((err) =>
      console.error("Error opening calendar URL:", err)
    );
  };
  // const { steps, distance, flights } = useHealthData();
  const { isPedometerAvailable, stepCount } = usePedometer();

  // const [promoSections, setpromoSections] = useState([]);
  const getHomePromo = async () => {
    const promos: any = [];
    const querySnapshot = await getDocs(collection(db, "home"));
    querySnapshot.forEach((doc) => {
      promos.push(doc.data());
      console.log(doc.id, " => ", doc.data());
    });
    setpromoSections(promos);
  };

  useEffect(() => {
    getHomePromo();
  }, []);

  const HomeSectionButton = ({ title, onPress }) => {
    return (
      <TouchableOpacity
        onPress={async () => {
          await onPress();
        }}
        style={{
          backgroundColor: "#E5E4E2",
          width: "90%",
          alignSelf: "center",
          marginTop: 20,
          padding: 20,
          borderRadius: 20,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} />
      </TouchableOpacity>
    );
  };

  const [showProfileModal, setshowProfileModal] = useState(false);
  return (
    <SafeAreaView style={{ height: "100%" }}>
      {showProfileModal && (
        <UserProfile
          setShowUserProfile={setshowProfileModal}
          showUserProfile={showProfileModal}
          navigation={navigation}
        />
      )}
      <ScrollView style={{ width: "100%", height: "100%" }}>
        <HomeHeader
          navigation={navigation}
          onImagePress={() => setshowProfileModal(true)}
        />
        <View style={{ marginLeft: 20, marginTop: 10 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>
            Hey {user?.displayName}, Good Morning!
          </Text>
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginLeft: 20,
            marginTop: 18,
          }}
        >
          New Arrivals
        </Text>
        <View
          style={{
            justifyContent: "space-evenly",
            width: "100%",
            alignItems: "center",
            marginTop: 10,
            flexDirection: "row",
          }}
        >
          {promoSections &&
            promoSections?.map((data, i) => {
              return (
                <HomeCard
                  key={i}
                  imageURL={data?.img}
                  cardTitle={data?.title}
                />
              );
            })}
        </View>
        {/* <CallCard /> */}

        <View style={{ marginTop: 40 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
              marginLeft: 20,
              marginTop: 18,
            }}
          >
            Quick Actions
          </Text>
          <HomeSectionButton
            title={"Track all your workout progress"}
            onPress={() => navigation.navigate(screens.TrackProgress)}
          />
          <HomeSectionButton
            title={"Schedule a call with an Expert"}
            onPress={handleEmailPress}
          />
        </View>

        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginLeft: 20,
            marginTop: 30,
          }}
        >
          Track
        </Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            justifyContent: "space-evenly",
          }}
        >
          <StatComponent
            text={"Steps"}
            data={
              isPedometerAvailable === "checking"
                ? "Checking..."
                : isPedometerAvailable === "true"
                  ? stepCount
                  : "Not available"
            }
          />
          <StatComponent text={"Sleep Tracker"} data={"Coming Soon"} />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginTop: 20,
          }}
        >
          <StatComponent text={"Heart Rate"} data={"Coming Soon"} />
          <StatComponent text={"Avg Calories"} data={"Coming Soon"} />
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  button: {
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
  },
});
