import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { images } from "../../utils/constants";

const ExerciseSearch = ({ navigation }) => {
  const ExerciseCard = () => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          margin: 10,
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={images.dumbell} />
          <Text style={{ fontSize: 18, marginLeft: 10, fontWeight: "600" }}>
            Chest
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={30} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 10,
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} />
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 20, textAlign: "center" }}>
          Search & Filter
        </Text>
        <TouchableOpacity>
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
          marginTop: 20,
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
          <TextInput
            style={{ marginLeft: 10, flex: 1 }}
            placeholder="Search"
            placeholderTextColor={"gray"}
          />
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
      </View>

      <ScrollView style={{ marginTop: 20 }}>
        <ExerciseCard />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ExerciseSearch;

const styles = StyleSheet.create({});
