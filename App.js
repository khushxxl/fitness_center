import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "./screens/authentication/SplashScreen";
import AuthStack from "./screens/authentication/AuthStack";
import AppProvider from "./context/AppContext";
import HomeStack from "./screens/home/HomeStack";
import { StripeProvider } from "@stripe/stripe-react-native";
import * as SecureStore from "expo-secure-store";

import { onAuthStateChanged } from "firebase/auth"; // Import auth state listener
import React, { useEffect, useState } from "react";
import { auth } from "./utils/firebase";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [user, setUser] = useState(null); // State to hold the authenticated user

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user state if authenticated
      } else {
        setUser(null); // Clear user state if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
          {user ? (
            <Stack.Screen
              name="HomeStack"
              component={HomeStack}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              {/* <Stack.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{ headerShown: false }}
              /> */}
              <Stack.Screen
                name="AuthStack"
                component={AuthStack}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
