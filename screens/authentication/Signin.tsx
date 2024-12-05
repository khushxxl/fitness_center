import React, { useState, useContext, useCallback, useEffect } from "react";
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
import { auth, db } from "../../utils/firebase";
import {
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const Signin = ({ navigation }) => {
  const { setuserData } = useContext(AppContext); // Ensure setuserData is correctly set up in the context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getUserData = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setuserData(userData); // Set the user data into context
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
        navigation.navigate("HomeStack");
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await getUserData(user.uid); // Use the user's UID instead of email for querying Firestore
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = useCallback(async () => {
    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await getUserData(user?.email); // Fetch data using user UID after sign-in
    } catch (error) {
      console.error("Sign-in error:", error);
      Alert.alert("Login Failed", "Invalid Credentials");
    }
  }, [email, password]);

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
