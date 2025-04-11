import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthScreen from "./AuthScreen";
import SplashScreen from "./SplashScreen";
import { screens } from "../../utils/constants";
import QuestionScreen from "./QuestionScreen";
import Signup from "./Signup";
import Signin from "./Signin";
import HomeStack from "../home/HomeStack";
import PaymentScreen from "./PaymentScreen";
import PaymentConfirmation from "./PaymentConfirmation";
import HomeScreen from "../home/HomeScreen";

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen
        name={screens.SplashScreen}
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.AuthScreen}
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.Question}
        component={QuestionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.Signup}
        component={Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.Signin}
        component={Signin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.Payment}
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.HomeScreen}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.PaymentConfirm}
        component={PaymentConfirmation}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
