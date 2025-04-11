import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

import Ionicons from "@expo/vector-icons/Ionicons";

const CustomFloatingButton = ({ onClick }) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        alignSelf: "center",
        position: "absolute",
        bottom: 80,
        right: 20,
      }}
    >
      <LinearGradient
        style={{ padding: 10, borderRadius: 50 }}
        colors={["#4c669f", "#3b5998", "#192f6a"]}
      >
        <Ionicons name="add" color={"white"} size={30} />
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default CustomFloatingButton;

const styles = StyleSheet.create({});
