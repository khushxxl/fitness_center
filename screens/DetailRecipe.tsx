import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { sample_recipes } from "../utils/constants";
import MealModal from "../components/MealModal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import CustomInput from "../components/CustomInput";

const DetailRecipe = ({ route }) => {
  const data = route?.params?.data;
  const [mealModal, setMealModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [filterText, setFilterText] = useState("");
  const navigation = useNavigation();

  console.log(data);

  useEffect(() => {
    if (selectedData) {
      setMealModal(true);
    }
  }, [selectedData]);

  const RecipeItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedData(item)}
      style={styles.recipeItem}
    >
      <Image
        style={styles.recipeImage}
        source={{
          uri: item?.imageUrl,
        }}
      />
      <Text style={styles.recipeName}>{item.title}</Text>
    </TouchableOpacity>
  );

  const filteredRecipes = data?.filter((recipe) =>
    recipe.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <View style={{ width: "100%" }}>
        <CustomInput
          placeholder={"Enter Recipe"}
          value={filterText}
          onChangeText={setFilterText}
        />
      </View>
      <MealModal
        modal={mealModal}
        setModal={setMealModal}
        selectedData={selectedData}
        setselectedData={setSelectedData}
      />
      <FlatList
        data={filteredRecipes}
        renderItem={({ item }) => <RecipeItem item={item} />}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.recipeList}
      />
    </SafeAreaView>
  );
};

export default DetailRecipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    marginLeft: 10,
  },
  filterInput: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  recipeList: {
    padding: 10,
  },
  recipeItem: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  recipeImage: {
    height: 150,
    width: "100%",
  },
  recipeName: {
    textAlign: "center",
    fontWeight: "bold",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
});
