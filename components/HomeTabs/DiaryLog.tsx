import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import CalendarStrip from "react-native-calendar-strip";
import CustomFloatingButton from "../CustomFloatingButton";
import DiaryEntryModal from "./DiaryEntryModal";
import moment, { Moment } from "moment";

import Ionicons from "@expo/vector-icons/Ionicons";
import * as Progress from "react-native-progress";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AppContext } from "../../context/AppContext";

const DiaryLog = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [dateTapped, setdateTapped] = useState<Date>(new Date());

  const [userWorkoutLog, setuserWorkoutLog] = useState([]);

  const { appUser } = useContext(AppContext);
  const [clickedData, setclickedData] = useState(undefined);

  useEffect(() => {
    getAllWorkoutLogs();
    if (clickedData) {
      // console.log("From useefect", clickedData);
      setModalVisible(true);
    }
  }, [clickedData]);
  // console.log(dateTapped.toDateString());

  const getAllWorkoutLogs = async () => {
    const workoutLogs = [];
    const query = collection(db, `workoutlogs/${appUser?.email}/logs`);
    const querySnapshot = await getDocs(query);
    querySnapshot.forEach(async (doc) => {
      await workoutLogs.push({ id: doc.id, ...doc.data() });
      console.log(doc.id);
    });
    setuserWorkoutLog(workoutLogs);
    // console.log(workoutLogs);
  };

  const LogComponent = ({ data }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 140,
          justifyContent: "space-evenly",
          marginTop: 15,
        }}
      >
        <View
          style={{
            justifyContent: "space-between",
            height: "95%",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {data?.startTime}
          </Text>
          <View style={styles.verticalLine} />
          <Text style={{ fontWeight: "bold", fontSize: 15 }}>
            {data?.endTime}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setclickedData(data);

            // setModalVisible(true);
            // console.log(clickedData);
          }}
          style={{
            width: "80%",
            borderColor: "#D0D5DD",
            borderWidth: 2,
            borderRadius: 8,
            alignSelf: "center",
            marginTop: 10,
            height: "100%",
            backgroundColor: "#FFFCF5",
            padding: 10,
            justifyContent: "space-evenly",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/icons/heartIcon.png")}
                style={{ height: 30, width: 35 }}
              />
              <View style={{ marginLeft: 10 }}>
                <Text>Cardio</Text>
                <Text>{data?.selectedWorkout}</Text>
              </View>
            </View>
            <View>
              <Ionicons name="ellipsis-vertical-outline" size={25} />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <Text> Sets : {data?.setsPerformed}</Text>
            <Text> Reps : {data?.repsPerformed}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text>1200 kcal</Text>
              <Text>Calories burned</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>90bpm</Text>
              <Text>Heart Rate</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>90bpm</Text>
              <Text>Heart Rate</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const markedDatesArray = [
    {
      date: new Date(),
      dots: [
        {
          color: "#000",
          selectedColor: "#000",
        },
      ],
    },
  ];
  return (
    <SafeAreaView style={{ height: "100%" }}>
      <DiaryEntryModal
        getAllWorkoutLogs={getAllWorkoutLogs}
        setIsModal={setModalVisible}
        modal={isModalVisible}
        clickedData={clickedData}
        setClickedData={setclickedData}
      />
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
          Diary Log
        </Text>
      </View>

      <View style={{ marginTop: 10 }}>
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
          onDateSelected={async (date) => {
            setdateTapped(date.toDate());
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
      </View>
      <Text style={{ textAlign: "center", marginTop: 5, fontWeight: "bold" }}>
        {dateTapped.toDateString()}
      </Text>
      <View style={styles.horizontalLine} />

      <View>
        <View style={{ flexDirection: "row", marginLeft: 10 }}>
          <Text style={{ color: "#667085", fontWeight: "500", fontSize: 14 }}>
            Time
          </Text>
          <Text
            style={{
              color: "#667085",
              fontWeight: "500",
              fontSize: 14,
              marginLeft: 20,
            }}
          >
            Exercise
          </Text>
        </View>
        <ScrollView style={{ height: "100%" }}>
          {/* {userWorkoutLog &&
            userWorkoutLog.map((data, i) => {
              if (dateTapped.toDateString() == data.dateSelect) {
                return <LogComponent data={data} key={i} />;
              } else {
                return (
                  <View
                    style={{ height: "100%", justifyContent: "center" }}
                    key={i}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      No Logs
                    </Text>
                  </View>
                );
              }
            })} */}
          {userWorkoutLog.map((data, i) => {
            if (data.dateSelect == dateTapped.toDateString()) {
              return <LogComponent data={data} key={i} />;
            }
          })}
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>

      <CustomFloatingButton
        onClick={() => {
          setModalVisible(true);
        }}
      />
    </SafeAreaView>
  );
};

export default DiaryLog;

const styles = StyleSheet.create({
  horizontalLine: { backgroundColor: "#D0D5DD", height: 2, marginVertical: 20 },
  verticalLine: {
    backgroundColor: "#D0D5DD",
    height: "40%",
    marginVertical: 20,
    width: 2,
  },
});
