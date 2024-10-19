import React, { useContext, useEffect, useState } from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { BallIndicator } from "react-native-indicators";
import { AppContext } from "../../context/AppContext";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { screens } from "../../utils/constants";
import { auth, db } from "../../utils/firebase"; // Ensure your Firebase init is correct

const SplashScreen = ({ navigation }) => {
  const {
    setappUser,
    setpromoSections,
    setsettingOptions,
    setallPosts,
    setuserWorkoutLog,
    settrainerWorkoutLog,
  } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(true);

  const getData = async (email) => {
    try {
      const docRef = doc(db, "users", email);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setappUser(userData);

        await Promise.all([
          getHomePromo(),
          getSettings(),
          getAllPosts(),
          getUserWorkoutLogs(email),
          getTrainerLogs(email),
        ]);

        navigation.navigate("HomeStack");
      } else {
        Alert.alert("Error", "User data not found");
        navigation.navigate(screens.AuthScreen);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const getHomePromo = async () => {
    const promos = [];
    const querySnapshot = await getDocs(collection(db, "home"));
    querySnapshot.forEach((doc) => promos.push(doc.data()));
    setpromoSections(promos);
  };

  const getSettings = async () => {
    const settings = [];
    const querySnapshot = await getDocs(collection(db, "settings"));
    querySnapshot.forEach((doc) => settings.push(doc.data()));
    setsettingOptions(settings);
  };

  const getAllPosts = async () => {
    const posts = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => posts.push({ id: doc.id, ...doc.data() }));
    setallPosts(posts);
  };

  const getUserWorkoutLogs = async (email) => {
    const logs = [];
    const querySnapshot = await getDocs(
      collection(db, `workoutlogs/${email}/logs`)
    );
    querySnapshot.forEach((doc) => logs.push({ id: doc.id, ...doc.data() }));
    setuserWorkoutLog(logs);
  };

  const getTrainerLogs = async (email) => {
    const logs = [];
    const querySnapshot = await getDocs(
      collection(db, `workoutlogs/${email}/trainerLog`)
    );
    querySnapshot.forEach((doc) => logs.push({ id: doc.id, ...doc.data() }));
    settrainerWorkoutLog(logs);
  };

  useEffect(() => {
    const authInstance = getAuth();
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        console.log("User is signed in:", user.email);
        getData(user.email);
      } else {
        console.log("No user is signed in");
        navigation.navigate(screens.AuthScreen);
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/splashLogo.png")}
        />
        <BallIndicator color="white" style={styles.indicator} />
      </View>
    );
  }

  return null;
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0086C9",
    justifyContent: "center",
  },
  logo: {
    alignSelf: "center",
  },
  indicator: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
  },
});
