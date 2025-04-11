import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { screens } from "../utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";

const SearchExercise = ({ navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate(screens.ExerciseSearch);
      }}
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly",
      }}
    >
      <View
        style={{
          borderRadius: 10,
          borderColor: "#D0D5DD",
          borderWidth: 1,
          width: "75%",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="search-outline"
          size={30}
          style={{ marginLeft: 10 }}
          color={"#667085"}
        />
        <Text style={{ color: "gray", marginLeft: 10 }}>Search</Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: "#F0F9FF",
          alignSelf: "center",
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Ionicons name="filter-outline" size={30} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default SearchExercise;

const styles = StyleSheet.create({});
