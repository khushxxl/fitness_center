import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { BallIndicator } from "react-native-indicators";
import { useNavigation } from "@react-navigation/native";
import { screens } from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useAuth, useUser } from "@clerk/clerk-expo";

const SplashScreen = ({ navigation }) => {
  const {
    appUser,
    setappUser,
    promoSections,
    setpromoSections,
    settingOptions,
    setsettingOptions,
    allPosts,
    setallPosts,
    userWorkoutLog,
    setuserWorkoutLog,
    trainerWorkoutLog,
    settrainerWorkoutLog,
  } = useContext(AppContext);
  // const navigation = useNavigation();
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const getHomePromo = async () => {
    const promos: any = [];
    const querySnapshot = await getDocs(collection(db, "home"));
    querySnapshot.forEach((doc) => {
      promos.push(doc.data());
      console.log(doc.id, " => ", doc.data());
    });
    setpromoSections(promos);
  };
  const getSettings = async () => {
    const settings: any = [];
    const querySnapshot = await getDocs(collection(db, "settings"));
    querySnapshot.forEach((doc) => {
      settings.push(doc.data());
      console.log(doc.id, " => ", doc.data());
    });
    setsettingOptions(settings);
  };

  const getAllPosts = async () => {
    const allPostsInline: any = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      allPostsInline.push({ id: doc.id, ...doc.data() });
      console.log(doc.id, " => ", doc.data());
    });
    setallPosts(allPostsInline);
  };

  const getAllWorkoutLogs = async () => {
    const workoutLogs = [];
    const query = collection(db, `workoutlogs/${appUser?.email}/logs`);
    const querySnapshot = await getDocs(query);
    querySnapshot.forEach(async (doc) => {
      await workoutLogs.push({ id: doc.id, ...doc.data() });
      console.log(doc.data());
    });
    setuserWorkoutLog(workoutLogs);
    // console.log(workoutLogs);
  };

  const getTrainerLogs = async () => {
    const workoutLogs = [];
    const query = collection(db, `workoutlogs/${appUser?.email}/trainerLog`);
    const querySnapshot = await getDocs(query);
    querySnapshot.forEach(async (doc) => {
      await workoutLogs.push({ id: doc.id, ...doc.data() });
      console.log(doc.data());
    });
    settrainerWorkoutLog(workoutLogs);
    // console.log(workoutLogs);
  };

  const checkUser = async () => {
    setTimeout(async () => {
      getUser();
    }, 3000);
  };

  const getUser = async () => {
    if (isSignedIn) {
      const docRef = doc(db, "users", user?.emailAddresses[0]?.emailAddress);
      const docSnap = await getDoc(docRef);
      console.log("Doc snap", docSnap.data());

      await getHomePromo();
      await getSettings();
      await getAllPosts();
      await getAllWorkoutLogs();
      await getTrainerLogs();

      if (docSnap.exists()) {
        const userData = docSnap.data();
        setappUser(userData);

        if (userData != null) {
          navigation.replace("HomeStack");
        }
      } else {
        if(isSignedIn){ navigation.replace("HomeStack");}
        else{navigation.replace(screens.AuthScreen)};
      }
    } else {
      if(isSignedIn){ navigation.replace("HomeStack");}
      else{navigation.replace(screens.AuthScreen)};
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0086C9",
        justifyContent: "center",
      }}
    >
      <Image
        style={{
          alignSelf: "center",
        }}
        source={require("../../assets/images/splashLogo.png")}
      />
      <BallIndicator
        color="white"
        style={{ position: "absolute", bottom: 50, alignSelf: "center" }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
