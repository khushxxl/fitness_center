import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
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
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
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
  const [workoutDuration, setworkoutDuration] = useState(10);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dateSelected, setdateSelected] = useState<Date>(new Date());
  const [showDateModal, setshowDateModal] = useState(false);
  const [setsPerformed, setsetsPerformed] = useState(0);
  const [repsPerformed, setrepsPerformed] = useState(0);
  const [showstartTimeModal, setShowStartTimeModal] = useState(false);
  const [showEndTimeModal, setshowEndTimeModal] = useState(false);
  const [startTime, setstartTime] = useState<any>(null);
  const [endTime, setendTime] = useState<any>(null);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [restTaken, setRestTaken] = useState("");

  const [weightUsed, setweightUsed] = useState(10);

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
      setAdditionalNotes(clickedData.additionalNotes || "");
      setRestTaken(clickedData.restTaken || "");
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
    setAdditionalNotes("");
    setRestTaken("");
  };

  const saveWorkoutLog = async () => {
    const workoutData = {
      selectedWorkout: workoutSelected,
      weightUsed: weightUsed,
      setsPerformed: setsPerformed,
      repsPerformed: repsPerformed,
      dateSelect: dateSelected.toDateString(),
      calorieBurnt: 90,
      additionalNotes: additionalNotes,
      restTaken: restTaken,
      timestamp: serverTimestamp(),
    };

    if (clickedData) {
      await updateDoc(
        doc(db, `workoutlogs/${appUser?.email}/logs`, clickedData?.id),
        workoutData
      ).then(async () => {
        await getAllWorkoutLogs();
        setClickedData(null);
        setIsModal(false);
      });
    } else {
      await addDoc(
        collection(db, `workoutlogs/${appUser?.email}/logs`),
        workoutData
      )
        .then(async () => {
          await getAllWorkoutLogs();
          setIsModal(false);
        })
        .catch((e) => console.log(e));
    }
  };

  return (
    <Modal
      style={{ margin: 0 }}
      onBackdropPress={() => setIsModal(false)}
      isVisible={modal}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.modalContainer}>
          <ScrollView
            keyboardShouldPersistTaps={"handled"}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={() => {
                  setClickedData(null);
                  setIsModal(false);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close-outline" size={30} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerText}>
                {clickedData ? "Edit Workout" : "Add a new workout log"}
              </Text>
            </View>

            <CustomInput
              label={"Enter Workout"}
              placeholder={"Enter here"}
              value={workoutSelected}
              onChangeText={setworkoutSelected}
            />

            <CustomInput
              label={"Weight Used (in kg)"}
              placeholder={"Enter here"}
              value={weightUsed}
              onChangeText={setweightUsed}
              type="numeric"
            />

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

            <CustomInput
              label={"Rest Taken (Optional)"}
              placeholder={"Enter rest time here (in mins)"}
              value={restTaken}
              onChangeText={setRestTaken}
              type="number-pad"
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

            <CustomInput
              label={"Additional Notes (Optional)"}
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              multiLine={true}
              maxlines={3}
            />

            <View style={styles.buttonContainer}>
              <CustomButton
                onClick={async () => {
                  if (
                    !weightUsed ||
                    !workoutSelected ||
                    !repsPerformed ||
                    !setsPerformed ||
                    !dateSelected
                  ) {
                    Alert.alert("Please fill in all required fields");
                    return;
                  }
                  await saveWorkoutLog();
                }}
                title={clickedData ? "Update Workout" : "Save Workout"}
                textColor={"white"}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default DiaryEntryModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 16,
  },
  scrollViewContent: {
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 20,
    marginTop: 14,
  },
  closeButton: {
    padding: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: "#333",
  },
  sliderContainer: {
    marginVertical: 20,
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  weightText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0086C9",
    textAlign: "center",
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
});
