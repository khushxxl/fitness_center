import {
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AppContext } from "../../context/AppContext";
import { getAuth } from "firebase/auth";
import HomeHeader from "../HomeHeader";
import EditProfileSheet from "../CustomComponents/EditProfileSheet";
import { screens, Trainer_Email } from "../../utils/constants";
import UserProfile from "./UserProfile";
import { Link } from "@react-navigation/native";

const UserScreen = ({ navigation }) => {
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  const { promoSections, setpromoSections } = useContext(AppContext);
  const auth = getAuth();


  const HomeCard = ({ cardTitle, imageURL, link }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => (link ? Linking.openURL(link) : null)}
    >
      {imageURL && (
        <Image
          style={styles.cardImage}
          source={{ uri: imageURL }}
          resizeMode="cover"
        />
      )}
      <View style={styles.cardTitleContainer}>
        <Text style={styles.cardTitle}>{cardTitle}</Text>
      </View>
    </TouchableOpacity>
  );

  const StatComponent = ({ text, data }) => (
    <TouchableOpacity style={styles.statCard}>
      <Text style={styles.statTitle}>{text}</Text>
      <Text style={styles.statData}>{data}</Text>
    </TouchableOpacity>
  );

  const handleScheduleCall = () => {
    const calendarUrl = "https://cal.com/marc-risi/15min";
    Linking.openURL(calendarUrl).catch((err) =>
      console.error("Error opening calendar URL:", err)
    );
  };

  const getHomePromo = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "home"));
      const promos = querySnapshot.docs.map((doc) => doc.data());
      setpromoSections(promos);
    } catch (error) {
      console.error("Error fetching home promos:", error);
    }
  };

  useEffect(() => {
    getHomePromo();
  }, []);

  const HomeSectionButton = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.sectionButton}>
      <Text style={styles.sectionButtonText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} />
    </TouchableOpacity>
  );

  if (showProfileModal) {
    return (
      <UserProfile
        navigation={navigation}
        showUserProfile={showProfileModal}
        setShowUserProfile={setShowProfileModal}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader
          navigation={navigation}
          onImagePress={() => setShowProfileModal(true)}
        />

        <Text style={styles.sectionHeader}>New Arrivals</Text>
        <View style={styles.cardGridContainer}>
          {promoSections?.map((data, i) => (
            <HomeCard
              key={i}
              imageURL={data?.img}
              cardTitle={data?.title}
              link={data?.link}
            />
          ))}
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionHeader}>Quick Actions</Text>
          <HomeSectionButton
            title="Track Workout Progress"
            onPress={() => navigation.navigate(screens.TrackProgress)}
          />
          <HomeSectionButton
            title="Schedule Expert Call"
            onPress={handleScheduleCall}
          />
        </View>

        <Text style={styles.sectionHeader}>Track</Text>
        <View style={styles.statsContainer}>
          <StatComponent text="Steps" data="Not Available" />
          <StatComponent text="Sleep Tracker" data="Coming Soon" />
        </View>

        <View style={styles.statsContainer}>
          <StatComponent text="Heart Rate" data="Coming Soon" />
          <StatComponent text="Avg Calories" data="Coming Soon" />
        </View>

        <View style={{ marginTop: 24 }}>
          <HomeSectionButton
            title="Food and Nutrition"
            onPress={() => {
              Linking.openURL("https://violet-candide-27.tiiny.site");
            }}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    width: "48%",
    marginBottom: 16,
  },
  cardImage: {
    height: 200,
    width: "100%",
    borderRadius: 12,
  },
  cardTitleContainer: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  statCard: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    width: "45%",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statData: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "#0086C9",
  },
  sectionButton: {
    backgroundColor: "#f5f5f5",
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  cardGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  quickActionsContainer: {
    marginTop: 24,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 12,
    justifyContent: "space-between",
  },
});
