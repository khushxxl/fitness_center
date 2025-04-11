import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { images, screens } from "../utils/constants";
import { AppContext } from "../context/AppContext";

const CustomBottomNav = ({
  navigation,
  activeScreen,
  setActiveScreen,
}: {
  navigation;
  activeScreen;
  setActiveScreen;
}) => {
  const Icon = ({
    title,
    onClick,
    image,
    name,
  }: {
    title: string;
    onClick?: any;
    image?: any;
    name: string;
  }) => {
    return (
      <TouchableOpacity onPress={onClick} style={{ alignItems: "center" }}>
        <Ionicons size={30} name={name} />
        <Text style={{ marginTop: 4, textAlign: "center" }}>{title}</Text>
      </TouchableOpacity>
    );
  };

  const { appUser } = useContext(AppContext);

  return (
    <View
      style={{
        position: "absolute",
        alignSelf: "center",
        width: "100%",
        bottom: 0,
        backgroundColor: "white",
        paddingTop: 10,
        height: 80,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <Icon
          onClick={() => {
            setActiveScreen(screens.HomeScreen);

            if (appUser?.isTrainer) {
              setActiveScreen(screens.TrainerHome);
            } else {
              setActiveScreen(screens.HomeScreen);
            }
          }}
          name={activeScreen == screens.HomeScreen ? "home" : "home-outline"}
          title="Home"
        />
        <Icon
          name={activeScreen == screens.DiaryLog ? "book" : "book-outline"}
          title={"Diary"}
          onClick={() => {
            if (appUser?.isTrainer) {
              setActiveScreen(screens.TrainerHome);
            } else {
              setActiveScreen(screens.DiaryLog);
            }
          }}
        />
        {/* <Icon
          title={"Home"}
          image={
            activeScreen == screens.HomeScreen
              ? images.homeIcon
              : images.home_unfilled
          }
        /> */}
        <Icon
          title={"Library"}
          onClick={() => {
            if (appUser?.isTrainer) {
              setActiveScreen(screens.TrainerHome);
            } else {
              setActiveScreen(screens.WorkoutLibrary);
            }
          }}
          name={
            activeScreen == screens.WorkoutLibrary
              ? "videocam"
              : "videocam-outline"
          }
        />
        <Icon
          title={"Meals"}
          onClick={() => {
            if (appUser?.isTrainer) {
              setActiveScreen(screens.TrainerHome);
            } else {
              setActiveScreen(screens.MealsScreen);
            }
          }}
          name={
            activeScreen == screens.MealsScreen
              ? "restaurant"
              : "restaurant-outline"
          }
        />
        <Icon
          name={
            activeScreen == screens.PostScreen ? "create" : "create-outline"
          }
          title={"Post"}
          onClick={() => {
            if (appUser?.isTrainer) {
              setActiveScreen(screens.TrainerHome);
            } else {
              setActiveScreen(screens.PostScreen);
            }
          }}
        />

        {/* <Icon title={"Posts"} image={images.postIcon} /> */}
        {/* <Icon
          onClick={() => {
            if (appUser?.isTrainer) {
            } else {
              setActiveScreen(screens.PlanScreen);
            }
          }}
          title={"Plans"}
          image={images.planIcon}
        /> */}
        {/* <Icon
          onClick={() => {
            setActiveScreen(screens.UserProfile);
          }}
          title={"Profile"}
          image={
            activeScreen == screens.UserProfile
              ? images.profile_filled
              : images.profileIcon
          }
        /> */}
      </View>
    </View>
  );
};

export default CustomBottomNav;

const styles = StyleSheet.create({});
