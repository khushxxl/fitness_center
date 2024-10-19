import React, { useState, useContext, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { AppContext } from "../../context/AppContext";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../../utils/firebase";
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Signin = ({ navigation }) => {
  const { setuserData } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = useCallback(async () => {
    try {
      const auth = getAuth();
      // await setPersistence(auth, browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      if (user) {
        await storeUserLocally(user);
        // setuserData(user);
        navigation.navigate("HomeStack");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      Alert.alert("Login Failed", error.message);
    }
  }, [email, password]);

  const storeUserLocally = async (user) => {
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      console.error("Storage error:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/dumbell.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Sign In</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Email"
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
          type="email-address"
        />
        <CustomInput
          label="Password"
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          isPassword
        />
        <CustomButton
          title="Sign In"
          onClick={handleSignIn}
          textColor="white"
        />

        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupText}>
            Not a Member? <Text style={styles.signupLink}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Signin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  logo: {
    height: 50,
    width: 50,
    marginLeft: 20,
  },
  title: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
  },
  linkText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 15,
    color: "#344054",
    fontWeight: "700",
  },
  signupText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 16,
  },
  signupLink: {
    textDecorationLine: "underline",
    color: "#344054",
    fontWeight: "700",
  },
});
