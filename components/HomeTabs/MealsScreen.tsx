import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { images, sample_recipes, screens } from "../../utils/constants";
import MealModal from "../MealModal";
import CustomInput from "../CustomInput";
import Recipies from "../Recipies";
import MyMeals from "../MyMeals";

const MealsScreen = ({ navigation }) => {
  const [screenSelected, setscreenSelected] = useState(screens.MyMeals);
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white", flex: 1 }}>
      <View style={{ marginTop: 10 }}>
        <Image
          source={images.fc_header_img}
          style={{ height: 20, width: 170, alignSelf: "center" }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          justifyContent: "space-evenly",
          width: "100%",
          marginTop: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setscreenSelected(screens.MyMeals);
          }}
          style={styles.optionBox}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: screenSelected == screens.MyMeals ? "black" : "gray",
            }}
          >
            My Meals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setscreenSelected(screens.Recipie);
          }}
          style={styles.optionBox}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: screenSelected == screens.Recipie ? "black" : "gray",
            }}
          >
            Recipes
          </Text>
        </TouchableOpacity>
      </View>
      {screenSelected == screens.Recipie && <Recipies />}
      {screenSelected == screens.MyMeals && <MyMeals />}
    </SafeAreaView>
  );
};

export default MealsScreen;

const styles = StyleSheet.create({
  optionBox: {
    backgroundColor: "lightgray",
    padding: 14,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
});
