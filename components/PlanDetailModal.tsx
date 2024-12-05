import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell,
} from "react-native-table-component";

const PlanDetailModal = ({
  modal,
  setIsModal,
  planDetails,
}: {
  modal: boolean;
  setIsModal: (value: boolean) => void;
  planDetails: any;
}) => {
  console.log("Plan", planDetails);

  const WorkoutComponent = ({ data }) => {
    return (
      <View style={{ marginTop: 10, width: "90%", alignSelf: "center" }}>
        <View style={{ backgroundColor: "#E0F2FE", padding: 10 }}>
          <Text style={styles.outText}>{data.name}</Text>
          <Text style={styles.outText}>{data?.desc}</Text>
        </View>
        <View
          style={{
            backgroundColor: "#F5FBFF",
            padding: 10,
          }}
        >
          {data?.workouts?.map((workout, i) => {
            return (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.inText}>{workout?.workoutName}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[styles.inText, { marginRight: 20 }]}>
                    {workout?.reps}
                  </Text>
                  <Text style={styles.inText}>{workout?.duration}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <Modal style={{ margin: 0, height: "100%" }} isVisible={modal}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{ backgroundColor: "white", height: "100%", paddingTop: 20 }}
        >
          <TouchableOpacity
            onPress={() => setIsModal(false)}
            style={{ margin: 10, marginTop: 20 }}
          >
            <Ionicons name="close-outline" size={30} />
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
              <Text style={{ fontWeight: "bold" }}>
                {planDetails?.focusPart}
              </Text>
            </View>
          </ImageBackground>

          <ScrollView>
            {planDetails &&
              planDetails?.phases &&
              planDetails?.phases?.map((data, i) => {
                return <WorkoutComponent data={data} key={i} />;
              })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default PlanDetailModal;

const styles = StyleSheet.create({
  head: { height: 40, backgroundColor: "white" },
  text: { margin: 6 },
  inText: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: "500",
  },
  outText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});
