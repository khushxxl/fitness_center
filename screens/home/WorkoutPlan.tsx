import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomIcon from "../../components/CustomIcon";
import { customAppStyles } from "../../utils/styles";
import CustomCard from "../../components/CustomComponents/CustomCard";
import { screens } from "../../utils/constants";

const WorkoutPlan = ({ route, navigation }) => {
  const planDetails = route?.params?.planDetails;

  const getDayIndex = (day: string) => {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days?.indexOf(day?.split(",")[0]); // In case dayStr includes comma
  };

  console.log(planDetails);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", marginTop: 20, marginLeft: 10 }}>
          <CustomIcon
            name={"chevron-back"}
            onClick={() => navigation?.goBack()}
            styles={false}
          />
          <Text style={[customAppStyles.headerTitle, {}]}>
            {planDetails?.planName}
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          {planDetails?.workouts
            ?.sort((a, b) => getDayIndex(a.dayStr) - getDayIndex(b.dayStr))
            ?.map((data, i) => {
              // console.log(data);

              return (
                <CustomCard
                  key={i}
                  title={"Day " + data?.dayNumber}
                  description={""}
                  onPress={function (): void {
                    navigation.navigate(screens.WorkoutPlanDetailScreen, {
                      workoutsData: { ...data, day: "Day " + data?.dayNumber },
                    });
                  }}
                  navigationText="View Details"
                />
              );
            })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutPlan;

const styles = StyleSheet.create({});
