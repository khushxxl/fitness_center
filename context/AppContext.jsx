import { StyleSheet } from "react-native";
import React, { createContext, useState, useEffect } from "react";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
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
  const [userData, setuserData] = useState();
  const [loading, setLoading] = useState(true);
  const [promoSections, setpromoSections] = useState([]);
  const [settingOptions, setsettingOptions] = useState([]);

  // Save user data to AsyncStorage
  const saveCookie = async (user) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      console.log("Error saving user data:", e);
    }
  };

  // Fetch user data from Firestore
  const fetchUserData = async (email) => {
    if (!email) return null;

    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      setappUser(userData);
      await saveCookie(userData);
      return userData;
    }
    return null;
  };

  // Fetch all posts
  const fetchAllPosts = async () => {
    try {
      const postsRef = collection(db, "posts");
      const querySnapshot = await getDocs(postsRef);
      const posts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setallPosts(posts);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  };

  // Check if user is trainer and fetch trainer data
  const checkTrainer = async (userData) => {
    if (!userData) return;

    if (userData.isTrainer !== true) {
      setisTrainer(false);
      if (userData.trainer) {
        const docRef = doc(db, "users", userData.trainer);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const trainerData = docSnap.data();
          settrainerData(trainerData);
          return trainerData;
        }
      }
    } else {
      setisTrainer(true);
    }
  };

  // Initialize app data
  const initializeAppData = async (email) => {
    try {
      setLoading(true);
      const userData = await fetchUserData(email);
      if (userData) {
        await Promise.all([
          checkTrainer(userData),
          fetchAllPosts(),
          // Add other data fetching functions here
        ]);
      }
    } catch (error) {
      console.log("Error initializing app data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Force refresh all data
  const refreshData = async () => {
    if (appUser?.email) {
      await initializeAppData(appUser.email);
    }
  };

  // Load saved user data on app start
  const loadSavedUser = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user");
      if (jsonValue != null) {
        const userData = JSON.parse(jsonValue);
        setappUser(userData);
        return userData;
      }
    } catch (e) {
      console.log("Error loading saved user:", e);
    }
    return null;
  };

  // Initialize auth listener and data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.email) {
        const savedUser = await loadSavedUser();
        if (!savedUser) {
          await initializeAppData(user.email);
        }
      } else {
        setappUser(null);
      }
      setLoading(false);
    });

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
        setuserData,
        loading,
        refreshData, // New function to manually refresh data
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

const styles = StyleSheet.create({});
