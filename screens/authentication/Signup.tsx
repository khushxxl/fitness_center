import React, { useState, useContext } from "react";
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Alert,
  View,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { AppContext } from "../../context/AppContext";
import { screens, Trainer_Email } from "../../utils/constants";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const Signup = ({ navigation }) => {
  const { setuserData } = useContext(AppContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential) {
        await addUserToDatabase(email);
        await saveUserToStorage(userCredential.user);
        navigation.navigate(screens.Question, { userEmail: email });
      }
    } catch (error) {
      Alert.alert("Signup Error", error.message);
    }
  };

  const addUserToDatabase = async (email) => {
    try {
      const userDocRef = doc(db, "users", email);
      await setDoc(userDocRef, {
        name,
        email,
        photo: "",
        isTrainer: false,
        trainer: Trainer_Email,
      });

      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setuserData(docSnap.data());
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const saveUserToStorage = async (user) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("user", jsonValue);
      setuserData(user);
    } catch (error) {
      console.log("Error saving user: ", error);
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

          <CustomInput
            label="Name"
            placeholder="Enter your Name"
            value={name}
            onChangeText={setName}
          />
          <CustomInput
            label="Email"
            placeholder="Enter your Email"
            value={email}
            onChangeText={setEmail}
          />
          <CustomInput
            label="Password"
            placeholder="Enter your Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          <CustomInput
            label="Confirm Password"
            placeholder="Confirm your Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />
          <CustomButton
            title="Sign Up"
            onClick={handleSignup}
            textColor="white"
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
});
