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
import { screens } from "../utils/constants";
import { useNavigation } from "@react-navigation/native";
import { db } from "../utils/firebase";

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

  const breakfastImage =
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const lunchImage =
    "https://images.unsplash.com/photo-1627662236973-4fd8358fa206?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const dinnerImage =
    "https://images.unsplash.com/photo-1536236502598-7dd171f8e852?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  const snackImage =
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const MacrosBox = ({ text, data }) => {
    return (
      <View style={styles.macrosBox}>
        <Text style={styles.macrosLabel}>{text}</Text>
        <Text style={styles.macrosValue}>{data}gm</Text>
      </View>
    );
  };

  const [recipes, setRecipes] = useState<any[]>([]);

  useEffect(() => {
    getRecipes();
  }, []);

  const getRecipes = async () => {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipesData: any[] = [];
    querySnapshot.forEach((doc) => {
      recipesData.push({ ...doc.data(), id: doc.id });
    });
    setRecipes(recipesData);
  };

  // console.log(recipes);
  const FoodBox = ({ mealType = "", recipes }) => {
    const filteredRecipes = recipes.filter((recipe) =>
      recipe?.tags?.includes(mealType?.toLowerCase())
    );

    console.log(filteredRecipes);

    return (
      <TouchableOpacity
        onPress={() => {
          // console.log(filteredRecipes);
          navigation.navigate(screens.DetailRecipe, { data: filteredRecipes });
        }}
        style={[styles.foodBox, { marginTop: 20 }]}
      >
        <Image
          style={styles.foodImage}
          height={180}
          source={{
            uri:
              mealType == "Breakfast"
                ? breakfastImage
                : mealType == "Lunch"
                  ? lunchImage
                  : mealType == "Dinner"
                    ? dinnerImage
                    : snackImage,
          }}
        />
        <View style={styles.foodLabelContainer}>
          <Text style={styles.foodLabel}>{mealType}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {(proteinContent || carbsContent || fatsContent) && (
        <View style={styles.macrosContainer}>
          <Text style={styles.macrosTitle}>Your Macros Target</Text>

          <View style={styles.macrosCard}>
            <View style={styles.macrosRow}>
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
      <FoodBox mealType={"Breakfast"} recipes={recipes} />
      <FoodBox mealType={"Lunch"} recipes={recipes} />
      <FoodBox mealType={"Dinner"} recipes={recipes} />
      <FoodBox mealType={"Snack"} recipes={recipes} />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default MyMeals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  macrosContainer: {
    marginBottom: 20,
  },
  macrosTitle: {
    fontSize: 24,
    marginTop: 30,
    marginLeft: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  macrosCard: {
    alignSelf: "center",
    width: "90%",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 20,
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  macrosBox: {
    alignItems: "center",
    padding: 10,
  },
  macrosLabel: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 5,
  },
  macrosValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  verticalLine: {
    height: "100%",
    width: 1,
    backgroundColor: "#e0e0e0",
  },
  foodBox: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 10,
  },
  foodImage: {
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    opacity: 0.9,
    height: 130,
  },
  foodLabelContainer: {
    padding: 15,
    backgroundColor: "white",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  foodLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
  },
});
