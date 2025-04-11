import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "../../components/CustomButton";
import PlanDetailModal from "../../components/PlanDetailModal";

const PlanDetails = ({ navigation, route }) => {
  const exercisePlan = route?.params?.exercisePlan;
  const planOptions = ["Overview"];

  const InfoBox = ({ text1, text2 }) => {
    return (
      <View
        style={{
          padding: 10,
          borderColor: "#7CD4FD",
          borderWidth: 2,
          alignSelf: "flex-start",
          borderRadius: 8,
        }}
      >
        <Text style={{ fontWeight: "500" }}>{text1}</Text>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{text2}</Text>
      </View>
    );
  };

  const [planModalDetailModal, setplanModalDetailModal] = useState(false);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <PlanDetailModal
        modal={planModalDetailModal}
        setIsModal={setplanModalDetailModal}
        planDetails={exercisePlan}
      />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ marginLeft: 10 }}
      >
        <Ionicons name="chevron-back" size={25} />
      </TouchableOpacity>

      <ImageBackground
        style={{ height: 130, justifyContent: "center", marginTop: 20 }}
        source={{ uri: "https://i.ibb.co/XxZX1Qw/1-1.png" }}
      >
        <View
          style={{
            backgroundColor: "white",
            alignSelf: "center",
            justifyContent: "center",
            padding: 10,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>{exercisePlan?.focusPart}</Text>
        </View>
      </ImageBackground>

      <View style={styles.optionStrip}>
        {planOptions.map((data, i) => {
          return (
            <TouchableOpacity onPress={() => {}} style={styles.button} key={i}>
              <Text style={{ fontWeight: "bold" }}>{data}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <InfoBox text1={"Duration"} text2={"28 days"} />
        <InfoBox text1={"Difficulty"} text2={"Intermediate"} />
        <InfoBox text1={"Commitment"} text2={"2-4 days / week"} />
      </View>

      <View style={{ marginLeft: 10, marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          What if i choose this plan?
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 15,
            width: "80%",
            marginTop: 5,
          }}
        >
          ✅ This plan is for anyone that wants stronger hips, thighs, and
          glutes.
        </Text>
      </View>
      <View style={{ marginLeft: 10, marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          What will you do?
        </Text>
        <Text
          style={{
            fontWeight: "500",
            fontSize: 15,
            width: "80%",
            marginTop: 5,
          }}
        >
          ✅ Hip Movements{"\n"}✅ Hip Movements
        </Text>
      </View>

      <View style={{ position: "absolute", bottom: 30, width: "100%" }}>
        <CustomButton
          onClick={() => setplanModalDetailModal(true)}
          title={"Start Plan"}
          textColor={"white"}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlanDetails;

const styles = StyleSheet.create({
  optionStrip: {
    backgroundColor: "#F9FAFB",
    height: 50,
    alignSelf: "center",
    width: "50%",
    borderWidth: 1,
    borderColor: "#F2F4F7",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
});
