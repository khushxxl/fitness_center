import React, { useState, useContext } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { AppContext } from "../../context/AppContext";
import { screens, Trainer_Email } from "../../utils/constants";
import * as firebase from "firebase/compat/app";
import EmailForm from "./EmailForm";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const Signup = ({ navigation }) => {
  const { setAppUser } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          if (userCredential) {
            await saveUserToStorage(userCredential);
            await addUserToDatabase();
            navigation.navigate(screens.Question, { userEmail: email });
          }
        })
        .catch((e) => {
          Alert.alert("Signup Error", e.message);
          console.error(e);
        });
    } catch (error) {
      Alert.alert("Signup Error", error.message);
      console.error(error);
    }
  };

  const addUserToDatabase = async () => {
    const userDocRef = doc(db, "users", email);
    try {
      await setDoc(userDocRef, {
        name: name,
        email: email,
        photo: "",
        isTrainer: false,
        trainer: Trainer_Email,
      })
        .then(async () => {
          const docRef = doc(db, "users", email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setAppUser(docSnap.data());
            navigation.navigate(screens.Question, { userEmail: email });
          }
        })
        .catch((e) => {
          alert(e.message);
        });

      console.log("Document written with ID: ", userDocRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const saveUserToStorage = async (user) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("user", jsonValue);
      setAppUser(user);
    } catch (e) {
      console.log("Error saving user: ", e);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <Image
              style={styles.logo}
              source={require("../../assets/images/dumbell.png")}
            />
            <Text style={styles.title}>Create your Account</Text>
          </View>
          <EmailForm
            email={email}
            setEmail={setEmail}
            name={name}
            setName={setName}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleSignup={handleSignup}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safeAreaView: { flex: 1 },
  keyboardAvoidingView: { flex: 1 },
  scrollViewContent: { flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  logo: { height: 50, width: 50, marginLeft: 20 },
  title: { marginLeft: 10, fontSize: 20, fontWeight: "bold" },
  form: { marginTop: 20 },
  buttonContainer: { marginTop: 20 },
  signInText: { fontSize: 15, textAlign: "center", marginTop: 10 },
  signInLink: { textDecorationLine: "underline" },
});
