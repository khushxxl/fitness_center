import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomIcon from "../../components/CustomIcon";
import { customAppStyles } from "../../utils/styles";
import CustomCard from "../../components/CustomComponents/CustomCard";
import { screens } from "../../utils/constants";

const WorkoutPlan = ({ route, navigation }) => {
  const planDetails = route?.params?.planDetails;

  // Helper function to sort weeks numerically
  const sortWeeks = (weeks: string[]) => {
    return weeks.sort((a, b) => {
      const weekA = parseInt(a.split(" ")[1]);
      const weekB = parseInt(b.split(" ")[1]);
      return weekA - weekB;
    });
  };

  // Helper function to sort days numerically
  const sortDays = (days: string[]) => {
    return days.sort((a, b) => {
      const dayA = parseInt(a.split(" ")[1]);
      const dayB = parseInt(b.split(" ")[1]);
      return dayA - dayB;
    });
  };

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

        {planDetails?.description && (
          <Text style={styles.description}>{planDetails.description}</Text>
        )}

        <View style={{ marginTop: 20 }}>
          {sortWeeks(Object.keys(planDetails?.workouts || {})).map(
            (weekKey) => (
              <View key={weekKey}>
                <Text style={styles.weekTitle}>{weekKey}</Text>
                {sortDays(
                  Object.keys(planDetails?.workouts[weekKey] || {})
                ).map((dayKey) => (
                  <CustomCard
                    key={dayKey}
                    title={dayKey[0].toUpperCase() + dayKey.slice(1)}
                    description={`${planDetails?.workouts[weekKey][dayKey]?.length || 0} exercises`}
                    onPress={() => {
                      navigation.navigate(screens.WorkoutPlanDetailScreen, {
                        workoutsData: {
                          workouts: planDetails?.workouts[weekKey][dayKey],
                          day: dayKey,
                          week: weekKey,
                        },
                      });
                    }}
                    navigationText="View Details"
                  />
                ))}
              </View>
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutPlan;

const styles = StyleSheet.create({
  weekTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    marginTop: 20,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 16,
    marginHorizontal: 20,
    marginTop: 10,
    color: "#666",
  },
});
