import { StyleSheet, Text, View } from "react-native";
import React, { createContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [allPosts, setallPosts] = useState([]);

  const [appUser, setappUser] = useState(null);
  const [isTrainer, setisTrainer] = useState("");
  const [trainerData, settrainerData] = useState();
  const [userWorkoutLog, setuserWorkoutLog] = useState([]);
  const [trainerWorkoutLog, settrainerWorkoutLog] = useState([]);
  const [user, setUser] = useState();
  const [userData, setuserData] = useState();
  const saveCookie = async () => {
    try {
      const jsonValue = JSON.stringify(appUser);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      console.log(e);
    }
  };
  const getUser = async () => {
    if (appUser) {
      const docRef = doc(db, "users", appUser?.email);
      const docSnap = await getDoc(docRef);
      await saveCookie();

      if (docSnap.exists()) {
        await setappUser(docSnap.data());
      }
    }
  };

  const [promoSections, setpromoSections] = useState();
  const [settingOptions, setsettingOptions] = useState([]);

  const checkTrainer = async () => {
    console.log(appUser.trainer);
    if (appUser?.isTrainer != true) {
      setisTrainer(false);
      console.log(appUser?.trainer);
      const docRef = doc(db, "users", appUser?.trainer);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await settrainerData(docSnap.data());

        console.log(
          "Document Trainer data:",
          docSnap.data().name.toLowerCase()
        );
        console.log(docSnap.data());
        return docSnap.data();
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document! : from Context");
        return null;
      }
    } else {
      setisTrainer(true);
    }
  };
  const getUserData = async (email) => {
    if (email) {
      const userDocRef = doc(db, "users", email);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        console.log("User", userDocSnap.data());
        setuserData(userDocSnap.data());
      }
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user); // Set the user state if logged in
      await getUserData(user?.email);
      setLoading(false); // Stop loading once we know the auth state
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AppContext.Provider
      value={{
        appUser,
        setappUser,
        isTrainer,
        trainerData,
        checkTrainer,
        getUser,
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
        userData,
        user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

const styles = StyleSheet.create({});
