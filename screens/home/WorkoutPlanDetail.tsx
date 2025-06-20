import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomIcon from "../../components/CustomIcon";
import { customAppStyles } from "../../utils/styles";
import WebView from "react-native-webview";
import CustomCard from "../../components/CustomComponents/CustomCard";
import Modal from "react-native-modal";
import ExerciseInfoModal from "./ExerciseInfoModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

// Function to fetch workout details based on IDs
const fetchWorkoutDetails = async (workoutIds) => {
  const workouts = [];

  const fetchWorkoutById = async (workoutId) => {
    try {
      const workoutRef = doc(db, "all_workouts", workoutId);
      const workoutDoc = await getDoc(workoutRef);

      if (workoutDoc.exists()) {
        return {
          id: workoutDoc.id,
          ...workoutDoc.data(),
        };
      } else {
        console.log("No workout found with ID:", workoutId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching workout:", error);
      return null;
    }
  };

  // Loop through each workout ID and fetch details
  for (const workout of workoutIds) {
    const workoutDetail = await fetchWorkoutById(workout.workoutId);
    workouts.push(workoutDetail);
  }

  return workouts;
};

const WorkoutPlanDetail = ({ route, navigation }) => {
  const workoutsData = route?.params?.workoutsData;
  const [workoutsList, setWorkoutsList] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleWorkoutPress = (workout) => {
    setSelectedWorkout(workout);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const fetchWorkoutDetailsInner = async () => {
      setIsLoading(true);
      try {
        if (workoutsData?.workouts) {
          const workoutDetails = await fetchWorkoutDetails(
            workoutsData.workouts
          );
          const workoutsWithDetails = workoutsData.workouts.map(
            (workout, index) => ({
              ...workout,
              workout: workoutDetails[index],
            })
          );
          setWorkoutsList(workoutsWithDetails);
        }
      } catch (error) {
        console.error("Error fetching workout details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkoutDetailsInner();
  }, [workoutsData]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0086C9" />
          <Text style={styles.loadingText}>Loading workouts...</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }}>
          <ExerciseInfoModal
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            selectedWorkout={selectedWorkout}
          />
          <View style={styles.header}>
            <CustomIcon
              name={"chevron-back"}
              onClick={() => navigation?.goBack()}
              styles={false}
            />
            <View>
              <Text style={[customAppStyles.headerTitle]}>
                {workoutsData?.week[0].toUpperCase() +
                  workoutsData?.week.slice(1)}
              </Text>
              <Text style={styles.dayText}>
                {workoutsData?.day[0].toUpperCase() +
                  workoutsData?.day.slice(1)}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Exercises assigned</Text>

          {workoutsList.map((workout, index) => (
            <CustomCard
              key={index}
              title={workout?.workout?.name}
              subtitle={`Sets: ${workout?.sets || "0"}     Reps: ${workout?.reps || "0"}`}
              onPress={() => handleWorkoutPress(workout)}
              navigationText="Open Details"
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default WorkoutPlanDetail;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  tableContainer: {
    margin: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  cell: {
    flex: 1,
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    height: "80%",
  },
  modalHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
  modalContent: {
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalValue: {
    fontSize: 16,
  },
  descriptionContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 14,
    marginTop: 5,
    lineHeight: 20,
  },
  header: {
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    gap: 10,
  },
  dayText: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  sectionTitle: {
    ...customAppStyles.headerTitle,
    marginLeft: 20,
    marginVertical: 20,
  },
});
