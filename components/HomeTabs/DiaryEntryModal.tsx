import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Dropdown } from "react-native-element-dropdown";
import { logWorkouts } from "../../utils/constants";
import Slider from "@react-native-community/slider";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { customAppStyles } from "../../utils/styles";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { AppContext } from "../../context/AppContext";
import { db } from "../../utils/firebase";

const DiaryEntryModal = ({
  modal,
  setIsModal,
  getAllWorkoutLogs,
  clickedData,
  setClickedData,
}) => {
  const [workoutSelected, setworkoutSelected] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [workoutDuration, setworkoutDuration] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateSelected, setdateSelected] = useState<Date>(new Date());
  const [showDateModal, setshowDateModal] = useState(false);
  const [setsPerformed, setsetsPerformed] = useState(0);
  const [repsPerformed, setrepsPerformed] = useState(0);
  const [showstartTimeModal, setShowStartTimeModal] = useState(false);
  const [showEndTimeModal, setshowEndTimeModal] = useState(false);
  const [startTime, setstartTime] = useState<any>(null);
  const [endTime, setendTime] = useState<any>(null);

  const { appUser } = useContext(AppContext);

  useEffect(() => {
    if (clickedData) {
      setworkoutSelected(clickedData.selectedWorkout);
      setworkoutDuration(clickedData.durationOfWorkout);
      setdateSelected(new Date(clickedData.dateSelect));
      setsetsPerformed(clickedData.setsPerformed);
      setrepsPerformed(clickedData.repsPerformed);
      setstartTime(clickedData.startTime);
      setendTime(clickedData.endTime);
    } else {
      resetFields();
    }
  }, [clickedData]);

  const resetFields = () => {
    setworkoutSelected(null);
    setworkoutDuration(0);
    setdateSelected(new Date());
    setsetsPerformed(0);
    setrepsPerformed(0);
    setstartTime(null);
    setendTime(null);
  };

  const saveWorkoutLog = async () => {
    if (clickedData) {
      await updateDoc(
        doc(db, `workoutlogs/${appUser?.email}/logs`, clickedData?.id),
        {
          selectedWorkout: workoutSelected,
          durationOfWorkout: workoutDuration,
          setsPerformed: setsPerformed,
          repsPerformed: repsPerformed,
          dateSelect: dateSelected.toDateString(),
          calorieBurnt: 90,
        }
      ).then(async () => {
        await getAllWorkoutLogs();
        setClickedData(null);
        setIsModal(false);
      });
    } else {
      await addDoc(collection(db, `workoutlogs/${appUser?.email}/logs`), {
        selectedWorkout: workoutSelected,
        durationOfWorkout: workoutDuration,
        setsPerformed: setsPerformed,
        repsPerformed: repsPerformed,
        dateSelect: dateSelected.toDateString(),
        calorieBurnt: 90,
      })
        .then(async () => {
          await getAllWorkoutLogs();
          setIsModal(false);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <Modal
      style={{ height: "50%", margin: 0 }}
      onBackdropPress={() => {
        setIsModal(false);
      }}
      isVisible={modal}
    >
      <View style={{ height: "100%" }}>
        <ScrollView
          keyboardShouldPersistTaps={"handled"}
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 10,
          }}
          contentContainerStyle={{ flex: 1, height: "100%" }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              marginTop: 40,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setClickedData(null);
                setIsModal(false);
              }}
            >
              <Ionicons name="close-outline" size={30} />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                alignSelf: "center",
                fontWeight: "bold",
                fontSize: 17,
                marginLeft: 10,
              }}
            >
              {clickedData ? "Edit Workout" : "Add a new workout log"}
            </Text>
          </View>
          <CustomInput
            label={"Enter Workout"}
            placeholder={"Enter here"}
            value={workoutSelected}
            onChangeText={setworkoutSelected}
          />
          <Text
            style={{
              fontWeight: "500",
              fontSize: 16,
              marginTop: 30,
            }}
          >
            Duration of the workout
          </Text>
          <Slider
            style={{ width: "90%", alignSelf: "center", height: 20 }}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#0086C9"
            maximumTrackTintColor="#ffff"
            tapToSeek={true}
            thumbTintColor="#0086C9"
            step={10}
            onValueChange={setworkoutDuration}
            value={workoutDuration}
          />
          <Text style={{ marginTop: 20, fontWeight: "500" }}>
            Time Selected: {workoutDuration} mins
          </Text>
          <CustomInput
            label={"Number of sets performed"}
            placeholder={"0"}
            value={setsPerformed}
            onChangeText={setsetsPerformed}
            type="number-pad"
          />
          <CustomInput
            label={"Number of reps performed"}
            placeholder={"0"}
            value={repsPerformed}
            onChangeText={setrepsPerformed}
            type="number-pad"
          />
          <Text
            style={{
              marginLeft: 12,
              fontSize: 15,
              marginTop: 10,
              marginBottom: 2,
            }}
          >
            Date
          </Text>
          <TouchableOpacity
            onPress={() => setshowDateModal(true)}
            style={[customAppStyles.custInputViewStyle, {}]}
          >
            <Text style={{ color: "gray" }}>
              {dateSelected ? dateSelected.toDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={showDateModal}
            mode="date"
            onConfirm={(date) => {
              setdateSelected(date), setshowDateModal(false);
            }}
            onCancel={() => {
              setshowDateModal(false);
            }}
          />
          <DateTimePickerModal
            isVisible={showstartTimeModal}
            mode="time"
            onConfirm={(date) => {
              let hours = date.getHours();
              let minutes: any = date.getMinutes();
              minutes = minutes < 10 ? "0" + minutes : minutes;
              const currentTime = hours + ":" + minutes;

              setstartTime(currentTime);
              setShowStartTimeModal(false);
            }}
            onCancel={() => {
              setShowStartTimeModal(false);
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              width: "100%",
              justifyContent: "space-evenly",
            }}
          >
            <DateTimePickerModal
              isVisible={showEndTimeModal}
              mode="time"
              onConfirm={(date) => {
                let hours = date.getHours();
                let minutes: any = date.getMinutes();
                minutes = minutes < 10 ? "0" + minutes : minutes;
                const currentTime = hours + ":" + minutes;

                setendTime(currentTime);
                setshowEndTimeModal(false);
              }}
              onCancel={() => {
                setshowEndTimeModal(false);
              }}
            />
          </View>

          <View style={{}}>
            <CustomButton
              onClick={async () => {
                if (
                  !workoutDuration ||
                  !workoutSelected ||
                  !repsPerformed ||
                  !setsPerformed ||
                  !dateSelected
                ) {
                  Alert.alert("Complete the fields to save");
                  return;
                } else {
                  await saveWorkoutLog();
                }
              }}
              title={clickedData ? "Update Workout" : "Save Workout"}
              textColor={"white"}
            />
            <View style={{ height: 300 }} />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default DiaryEntryModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
