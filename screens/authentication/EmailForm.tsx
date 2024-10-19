import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { screens } from "../../utils/constants";

const EmailForm = ({
  email,
  setEmail,
  name,
  setName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSignup,
}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.form}>
      <CustomInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder={undefined}
      />
      <CustomInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        placeholder={undefined}
      />
      <CustomInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        isPassword
        placeholder={undefined}
      />
      <CustomInput
        label="Re-enter Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        isPassword
        placeholder={undefined}
      />
      <View style={styles.buttonContainer}>
        <CustomButton
          onClick={handleSignup}
          title="Create Account"
          textColor="white"
        />
        <TouchableOpacity onPress={() => navigation.navigate(screens.Signin)}>
          <Text style={styles.signInText}>
            Already a Member? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default EmailForm;

const styles = StyleSheet.create({
  form: { marginTop: 20 },
  signInLink: { textDecorationLine: "underline" },
  signInText: { fontSize: 15, textAlign: "center", marginTop: 10 },
  buttonContainer: { marginTop: 20 },
});
