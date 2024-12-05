import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import CalendarStrip from "react-native-calendar-strip";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  where,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AppContext } from "../../context/AppContext";
import CustomFloatingButton from "../CustomFloatingButton";
import DiaryEntryModal from "./DiaryEntryModal";
import CustomCard from "../CustomComponents/CustomCard";
import { screens } from "../../utils/constants";
const DiaryLog = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [dateTapped, setDateTapped] = useState(new Date());
  const [clickedData, setClickedData] = useState(null);
  const [sectionSelected, setSectionSelected] = useState("diary");
  const [refreshing, setRefreshing] = useState(false);

  const { appUser } = useContext(AppContext);
  const [userWorkoutLog, setuserWorkoutLog] = useState([]);
  const [trainerWorkoutLog, settrainerWorkoutLog] = useState([]);

  useEffect(() => {
    getAllWorkoutLogs();
    getTrainerLogs();
  }, []);

  useEffect(() => {
    if (clickedData) {
      setModalVisible(true);
    }
  }, [clickedData]);

  const getAllWorkoutLogs = async () => {
    const workoutLogs = [];
    const q = query(
      collection(db, `workoutlogs/${appUser?.email}/logs`),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      workoutLogs.push({ id: doc.id, ...doc.data() });
    });
    setuserWorkoutLog(workoutLogs);
  };

  const getTrainerLogs = async () => {
    const collectionRef = collection(db, "workoutPlans");
    const q = query(collectionRef, where("userEmail", "==", appUser?.email));
    const querySnapshot = await getDocs(q);
    const workoutLogs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    settrainerWorkoutLog(workoutLogs);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([getAllWorkoutLogs(), getTrainerLogs()]).then(() => {
      setRefreshing(false);
    });
  }, []);

  const deleteLog = async (logId) => {
    Alert.alert("Delete Log", "Are you sure you want to delete this log?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteDoc(
              doc(db, `workoutlogs/${appUser?.email}/logs`, logId)
            );
            await getAllWorkoutLogs();
          } catch (error) {
            console.error("Error deleting log:", error);
            Alert.alert("Error", "Failed to delete log. Please try again.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const LogComponent = ({ data }) => (
    <View style={styles.logContainer}>
      <TouchableOpacity
        onPress={() => setClickedData(data)}
        style={styles.logTouchable}
      >
        <View style={styles.logHeader}>
          <View style={styles.logHeaderLeft}>
            <View style={styles.iconContainer}>
              <Image
                source={require("../../assets/icons/heartIcon.png")}
                style={styles.logIcon}
              />
            </View>
            <View style={styles.logHeaderText}>
              <Text style={styles.workoutTitle}>{data?.selectedWorkout}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => deleteLog(data.id)}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={22} color="#FF4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.logDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Sets</Text>
            <Text style={styles.detailValue}>{data?.setsPerformed}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Reps</Text>
            <Text style={styles.detailValue}>{data?.repsPerformed}</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Weight</Text>
            <Text style={styles.detailValue}>{data?.weightUsed} kg</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const markedDatesArray = [
    {
      date: new Date(),
      dots: [{ color: "#000", selectedColor: "#000" }],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <DiaryEntryModal
        getAllWorkoutLogs={getAllWorkoutLogs}
        setIsModal={setModalVisible}
        modal={isModalVisible}
        clickedData={clickedData}
        setClickedData={setClickedData}
      />
      <Text style={styles.title}>Diary Log</Text>
      <CalendarStrip
        dateNameStyle={{}}
        dateNumberStyle={{}}
        dayContainerStyle={{
          height: 70,
          backgroundColor: "lightblue",
        }}
        maxDate={new Date()}
        selectedDate={dateTapped}
        calendarHeaderPosition="below"
        calendarHeaderStyle={{ textAlign: "left" }}
        style={{ width: "100%", height: 100 }}
        markedDates={markedDatesArray}
        calendarAnimation={{ type: "sequence", duration: 1000 / 4 }}
        onDateSelected={async (date: any) => {
          setDateTapped(date.toDate());
          markedDatesArray.push({
            date: date.toDate(),
            dots: [
              {
                color: "#000",
                selectedColor: "#000",
              },
            ],
          });

          markedDatesArray.forEach((item) => {
            console.log(item.date.toDateString());
          });
        }}
      />

      <Text style={styles.selectedDate}>{dateTapped.toDateString()}</Text>
      <View style={styles.horizontalLine} />

      <View style={styles.sectionContainer}>
        <TouchableOpacity
          onPress={() => setSectionSelected("diary")}
          style={[
            styles.sectionButton,
            sectionSelected === "diary" && styles.sectionButtonActive,
          ]}
        >
          <Text style={styles.sectionButtonText}>Diary</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSectionSelected("workout")}
          style={[
            styles.sectionButton,
            sectionSelected === "workout" && styles.sectionButtonActive,
          ]}
        >
          <Text style={styles.sectionButtonText}>Workouts</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.scrollView}
      >
        {sectionSelected === "diary" &&
          userWorkoutLog
            ?.filter(
              (data) => data?.dateSelect === new Date(dateTapped).toDateString()
            )
            .sort((a, b) => {
              if (!a.timestamp?.seconds) return 1;
              if (!b.timestamp?.seconds) return -1;
              // Compare Firebase timestamps (newest first)
              return b.timestamp.seconds - a.timestamp.seconds;
            })
            .map((data, i) => <LogComponent data={data} key={i} />)}
        {sectionSelected === "workout" &&
          trainerWorkoutLog.map((data, i) => (
            <CustomCard
              key={i}
              title={data?.planName}
              description={
                "Your trainer has added a 12 Week Workout plan for you"
              }
              onPress={function (): void {
                navigation.navigate(screens.WorkoutPlanScreen, {
                  planDetails: data,
                });
              }}
              navigationText="View Workout Plan"
            />
          ))}
        <View style={styles.scrollViewBottom} />
      </ScrollView>

      {sectionSelected == "diary" && (
        <CustomFloatingButton onClick={() => setModalVisible(true)} />
      )}
    </SafeAreaView>
  );
};

export default DiaryLog;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  calendarStrip: {
    height: 100,
    paddingTop: 20,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: "black",
  },
  calendarDateNumber: {
    color: "black",
  },
  calendarDateName: {
    color: "black",
  },
  calendarHighlightDate: {
    color: "white",
  },
  calendarDisabledDate: {
    color: "gray",
  },
  calendarIconContainer: {
    flex: 0.1,
  },
  selectedDate: {
    textAlign: "center",
    marginTop: 5,
    fontWeight: "bold",
  },
  horizontalLine: {
    backgroundColor: "#D0D5DD",
    height: 2,
    marginVertical: 20,
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "lightgray",
    borderRadius: 20,
    padding: 5,
    marginHorizontal: 20,
  },
  sectionButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  sectionButtonActive: {
    backgroundColor: "white",
  },
  sectionButtonText: {
    fontWeight: "bold",
  },
  scrollView: {
    width: "100%",
  },
  scrollViewBottom: {
    height: 100,
  },
  logContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 20,
  },
  logTouchable: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  logHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#F5F7FF",
    padding: 8,
    borderRadius: 8,
  },
  logIcon: {
    height: 24,
    width: 24,
    resizeMode: "contain",
  },
  logHeaderText: {
    marginLeft: 12,
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    color: "#666666",
  },
  deleteButton: {
    padding: 8,
  },
  logDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
  },
  detailItem: {
    alignItems: "center",
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  detailDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#E5E5E5",
  },
});
