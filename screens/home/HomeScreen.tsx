import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { useContext, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { screens } from "../../utils/constants";
import { AppContext } from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel from "react-native-snap-carousel";
import HomeHeader from "../../components/HomeHeader";
import UserScreen from "../../components/HomeTabs/UserScreen";
import CustomBottomNav from "../../components/CustomBottomNav";

import DiaryLog from "../../components/HomeTabs/DiaryLog";
import PlanScreen from "../../components/HomeTabs/PlanScreen";
import UserProfile from "../../components/HomeTabs/UserProfile";
import TrainerHome from "../../components/HomeTabs/TrainerHome";
import WorkoutLibrary from "./WorkoutLibrary";
import MealsScreen from "../../components/HomeTabs/MealsScreen";
import Post from "../../components/Post";
import Library from "../Library";

const HomeScreen = ({ navigation }) => {
  const { appUser } = useContext(AppContext);
  console.log(appUser);

  const [activeScreenName, setactiveScreenName] = useState(
    appUser?.isTrainer ? screens.TrainerHome : screens.HomeScreen
  );

  const activeScreen = () => {
    if (activeScreenName == screens.HomeScreen) {
      return <UserScreen navigation={navigation} />;
    }
    if (activeScreenName == screens.DiaryLog) {
      return <DiaryLog navigation={navigation} />;
    }
    if (activeScreenName == screens.PlanScreen) {
      return <PlanScreen navigation={navigation} />;
    }
    // if (activeScreenName == screens.UserProfile) {
    //   return <UserProfile navigation={navigation} />;
    // }
    if (activeScreenName == screens.TrainerHome) {
      return <TrainerHome navigation={navigation} />;
    }
    if (activeScreenName == screens.WorkoutLibrary) {
      return <Library navigation={navigation} />;
    }
    if (activeScreenName == screens.MealsScreen) {
      return <MealsScreen navigation={navigation} />;
    }
    if (activeScreenName == screens.PostScreen) {
      return <Post navigation={navigation} />;
    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: "white", flex: 1 }}>
      {activeScreen()}
      <CustomBottomNav
        activeScreen={activeScreenName}
        setActiveScreen={setactiveScreenName}
        navigation={navigation}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
