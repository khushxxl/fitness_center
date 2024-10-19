import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { screens } from "../../utils/constants";
import HomeScreen from "./HomeScreen";
import Inbox from "./Inbox";
import ChatScreen from "./ChatScreen";

import ExerciseSearch from "../workoutscreens/ExerciseSearch";
import PaymentScreen from "../authentication/PaymentScreen";
import PaymentConfirmation from "../authentication/PaymentConfirmation";
import PlanDetails from "./PlanDetails";
import AddWorkouts from "./AddWorkouts";
import VideoViewer from "./VideoViewer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import TrackProgress from "./TrackProgress";
import WorkoutLibrary from "./WorkoutLibrary";
import DetailRecipe from "../DetailRecipe";

const HomeStack = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();

  return (
    <Stack.Navigator screenOptions={{ gestureEnabled: false }}>
      <Stack.Screen
        name={screens.HomeScreen}
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.Inbox}
        component={Inbox}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.ChatScreen}
        component={ChatScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={screens.ExerciseSearch}
        component={ExerciseSearch}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.Payment}
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.PaymentConfirm}
        component={PaymentConfirmation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.PlanDetails}
        component={PlanDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.AddWorkouts}
        component={AddWorkouts}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.TrackProgress}
        component={TrackProgress}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={screens.WorkoutLibrary}
        component={WorkoutLibrary}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.DetailRecipe}
        component={DetailRecipe}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={screens.VideoView}
        component={VideoViewer}
        options={{
          title: "Learn",
          headerShown: true,
          headerStyle: {
            backgroundColor: "#111",
          },
          headerLeft: () => (
            <View style={{}}>
              <Ionicons
                onPress={() => {}}
                size={25}
                color={"white"}
                name="chevron-back"
              />
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({});
