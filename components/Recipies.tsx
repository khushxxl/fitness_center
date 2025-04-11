import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { images, sample_recipes } from "../utils/constants";
import MealModal from "./MealModal";
import CustomInput from "./CustomInput";

const Recipies = () => {
  const OptionComponent = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedData(item);
        }}
        style={{
          borderRadius: 10,
          alignSelf: "flex-start",
          marginHorizontal: 3,
          marginTop: 20,
        }}
      >
        <View
          style={{
            height: 200,
            width: 180,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            style={{
              height: 200,
              width: 180,
              alignSelf: "center",
              borderRadius: 10,
            }}
            source={{
              uri: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
          />
        </View>
        <View
          style={{
            alignSelf: "center",
            width: 180,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            alignItems: "center",
            padding: 8,
            opacity: 0.7,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [mealModal, setMealModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [recipeSearch, setRecipeSearch] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState(sample_recipes);

  useEffect(() => {
    if (selectedData) {
      setMealModal(true);
    }
  }, [selectedData]);

  useEffect(() => {
    if (recipeSearch === "") {
      setFilteredRecipes(sample_recipes);
    } else {
      const filtered = sample_recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(recipeSearch.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  }, [recipeSearch]);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white", flex: 1 }}>
      <MealModal
        modal={mealModal}
        setModal={setMealModal}
        selectedData={selectedData}
        setselectedData={setSelectedData}
      />

      <CustomInput
        label={"Recipe"}
        placeholder={"Enter Recipe"}
        value={recipeSearch}
        onChangeText={setRecipeSearch}
      />

      <View
        style={{
          marginTop: 20,
          alignSelf: "center",
          flex: 1,
        }}
      >
        <FlatList
          data={filteredRecipes}
          renderItem={({ item }) => <OptionComponent item={item} />}
          keyExtractor={(item) => item.name}
          numColumns={2}
        />
      </View>
      <View style={{ height: 50 }} />
    </SafeAreaView>
  );
};

export default Recipies;

const styles = StyleSheet.create({});
