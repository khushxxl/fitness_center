import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";

const MealModal = ({ modal, setModal, selectedData, setselectedData }) => {
  return (
    <Modal style={{ margin: 0 }} isVisible={modal}>
      <SafeAreaView
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
      >
        <ScrollView>
          <TouchableOpacity
            onPress={() => {
              setselectedData(null);
              setModal(false);
            }}
            style={{ marginLeft: 10 }}
          >
            <Ionicons name="close-outline" size={30} />
          </TouchableOpacity>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: 30,
              borderRadius: 20,
            }}
          >
            <Image
              style={{
                height: 180,
                width: 320,
                alignSelf: "center",
                borderRadius: 20,
              }}
              source={{
                uri: selectedData?.imageUrl,
              }}
            />
          </View>
          <Text
            style={{
              alignSelf: "center",

              fontWeight: "bold",
              fontSize: 18,
              marginTop: 15,
            }}
          >
            {selectedData?.title}
          </Text>
          <View
            style={{
              backgroundColor: "lightgray",
              width: "40%",
              alignSelf: "center",
              marginTop: 20,
              padding: 7,
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center", fontWeight: "bold" }}>
              Calories: {selectedData?.calories} kcal
            </Text>
          </View>
          <View
            style={{ alignSelf: "center", marginTop: 10, flexDirection: "row" }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: "gray",
              }}
            >
              Carbs: {selectedData?.carbs}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: "gray",
                marginLeft: 10,
              }}
            >
              Protein: {selectedData?.protein}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 15,
                color: "gray",
                marginLeft: 10,
              }}
            >
              Fats: {selectedData?.fats}
            </Text>
          </View>

          <View style={{ marginLeft: 20, marginTop: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24, color: "gray" }}>
              Ingredients
            </Text>

            <View style={{ marginTop: 10 }}>
              {selectedData?.ingredients.map((data, i) => {
                return (
                  <View style={{ marginTop: 4 }} key={i}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginHorizontal: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          fontSize: 15,
                        }}
                      >
                        {data?.item}
                      </Text>
                      <View
                        style={{
                          backgroundColor: "lightgray",
                          padding: 7,
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: 15,
                          }}
                        >
                          {data.grams} grams
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>

          <View style={{ marginTop: 10, marginLeft: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 24, color: "gray" }}>
              Cooking Methods
            </Text>
            {selectedData?.steps?.map((data, i) => {
              return (
                <Text
                  key={i}
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    marginTop: 8,
                  }}
                >
                  {data}
                </Text>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

export default MealModal;

const styles = StyleSheet.create({});
