import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const Header = ({ title, navigation }) => {
  return (
    <View
      style={{
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        marginTop: 10,
      }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={25} />
      </TouchableOpacity>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>{title}</Text>
      <Ionicons name="chevron-back" color={"white"} size={28} />
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({});
