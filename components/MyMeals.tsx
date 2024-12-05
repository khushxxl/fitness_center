import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import { AppContext } from "../context/AppContext";
import {
  breakfast_recipes,
  dinner_recipes,
  lunch_recipes,
  screens,
} from "../utils/constants";
import { useNavigation } from "@react-navigation/native";

const MyMeals = () => {
  const { userData } = useContext(AppContext);

  const [proteinContent, setproteinContent] = useState<any>(
    userData?.macros?.protein
  );
  const [carbsContent, setcarbsContent] = useState<any>(
    userData?.macros?.carbs
  );
  const [fatsContent, setfatsContent] = useState<any>(userData?.macros?.fats);
  const navigation = useNavigation();
  const MacrosBox = ({ text, data }) => {
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={{ fontSize: 14 }}>{text}</Text>
        <Text style={{ fontWeight: "bold" }}>{data}gm</Text>
      </View>
    );
  };

  const FoodBox = ({ mealType, data }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screens.DetailRecipe, { data: data })
        }
        style={{
          marginTop: 30,
          marginHorizontal: 20,
        }}
      >
        <Image
          style={{ borderRadius: 10, opacity: 0.9, position: "relative" }}
          height={100}
          source={{
            uri: "https://plus.unsplash.com/premium_photo-1670601440146-3b33dfcd7e17?q=80&w=3038&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
        />
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "bold",
              marginLeft: 10,
              color: "#5A5A5A",
            }}
          >
            {mealType}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      {(proteinContent || carbsContent || fatsContent) && (
        <View>
          <Text
            style={{
              fontSize: 18,
              marginTop: 30,
              marginLeft: 20,
              fontWeight: "bold",
            }}
          >
            Your Macros Target
          </Text>

          <View
            style={{
              alignSelf: "center",
              width: "80%",
              marginTop: 9,
              borderWidth: 0.5,
              borderColor: "gray",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              {proteinContent && (
                <MacrosBox text={"Protein"} data={proteinContent} />
              )}
              {carbsContent && (
                <>
                  <View style={styles.verticalLine} />
                  <MacrosBox text={"Carbs"} data={carbsContent} />
                </>
              )}
              {fatsContent && (
                <>
                  <View style={styles.verticalLine} />
                  <MacrosBox text={"Fats"} data={fatsContent} />
                </>
              )}
            </View>
          </View>
        </View>
      )}
      <FoodBox mealType={"Breakfast"} data={breakfast_recipes} />
      <FoodBox mealType={"Lunch"} data={lunch_recipes} />
      <FoodBox mealType={"Dinner"} data={dinner_recipes} />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default MyMeals;

const styles = StyleSheet.create({
  verticalLine: {
    height: "100%",
    width: 0.9,
    backgroundColor: "gray",
  },
});
