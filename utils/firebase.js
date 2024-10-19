// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhZRknt7kYOdF_MCqsz-LzeKQCGxiobVw",
  authDomain: "fitnessapp-9a63c.firebaseapp.com",
  projectId: "fitnessapp-9a63c",
  storageBucket: "fitnessapp-9a63c.appspot.com",
  messagingSenderId: "1007431303081",
  appId: "1:1007431303081:web:d51078cddc23743ab1ceb8",
  measurementId: "G-W5PWDP6Z3M",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, db, storage };
