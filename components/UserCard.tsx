import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { images } from "../utils/constants";

const UserCard = ({
  name,
  dateJoined,
}: {
  name: string;
  dateJoined?: string;
}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        margin: 20,
        marginTop: 10,
      }}
    >
      <Image source={images.profileImage} style={{}} />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ fontWeight: "bold", fontSize: 18 }}>{name}</Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 13,
            color: "#475467",
            marginTop: 5,
          }}
        >
          {dateJoined}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;

const styles = StyleSheet.create({});
