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
import React, { useContext, useState } from "react";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSignUp } from "@clerk/clerk-expo";
import { Trainer_Email, screens } from "../../utils/constants";

const Signup = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isLoaded, signUp, setActive } = useSignUp();
  const { appUser, setAppUser } = useContext(AppContext);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");

  const getUser = async (email) => {
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setAppUser(docSnap.data());
    }
  };

  const saveCookie = async () => {
    try {
      const jsonValue = JSON.stringify(appUser);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (e) {
      console.log(e);
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

  const handleSignup = async () => {
    if (confirmPassword !== password) {
      Alert.alert("Passwords do not match", "");
      return;
    }
    if (name && email && password && confirmPassword) {
      console.log(name, email, password);
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          console.log("Account created");
          const user = userCredential.user;
          console.log(user);
          if (user) {
            await addUserToDatabase();
          }
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      Alert.alert("Invalid Credentials", "Complete all fields to continue");
    }
  };

  const onSignUpPress = async () => {
    if (confirmPassword !== password) {
      Alert.alert("Passwords do not match", "");
      return;
    }

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Fields incomplete", "Complete all fields to continue");
      return;
    }

    try {
      await signUp.create({
        emailAddress: email,
        password,
        username: name,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors[0].message) {
        Alert.alert(err.errors[0].message);
      }
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }

    if (!code) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        await addUserToDatabase();
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      Alert.alert("Error Occurred");
      console.error(JSON.stringify(err, null, 2));
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
          {pendingVerification ?
            <View style={{ marginTop: 40, width: "90%", alignSelf: "center" }}>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 16,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Verify Code sent to {email}
              </Text>
              <CustomInput
                value={code}
                onChangeText={setCode}
                isPassword
                label={undefined}
                placeholder={undefined}
              />
              <CustomButton
                onClick={onPressVerify}
                title={"Confirm Code"}
                textColor={"white"}
              />
            </View>
            :
            <View style={styles.form}>
              <CustomInput
                label={"Email"}
                placeholder={"Enter Email"}
                value={email}
                onChangeText={setEmail}
              />
              <CustomInput
                label={"Full Name"}
                placeholder={"Enter Full Name"}
                value={name}
                onChangeText={setName}
              />
              <CustomInput
                label={"Password"}
                placeholder={"Create Password"}
                value={password}
                onChangeText={setPassword}
                isPassword
              />
              <CustomInput
                label={"Re-enter Password"}
                placeholder={"Re-enter Password"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                isPassword
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  onClick={onSignUpPress}
                  title={"Create an Account"}
                  textColor={"white"}
                />
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate(screens.Signin);
                  }}
                >
                  <Text style={styles.signInText}>
                    Already a Member?
                    <Text style={styles.signInLink}> Sign In</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  logo: {
    height: 50,
    width: 50,
    marginLeft: 20,
  },
  title: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
  signInText: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 10,
  },
  signInLink: {
    textDecorationLine: "underline",
  },
});
