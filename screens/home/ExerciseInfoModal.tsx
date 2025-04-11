import { StyleSheet, Text, View, ScrollView, Linking } from "react-native";
import React from "react";
import ReactNativeModal from "react-native-modal";
import { customAppStyles } from "../../utils/styles";
import WebView from "react-native-webview";
import CustomIcon from "../../components/CustomIcon";

const ExerciseInfoModal = ({
  isModalVisible,
  setIsModalVisible,
  selectedWorkout,
}: {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  selectedWorkout: any;
}) => {
  console.log("Selected Wotkout =>", selectedWorkout);
  return (
    <ReactNativeModal
      isVisible={isModalVisible}
      onBackdropPress={() => setIsModalVisible(false)}
      style={{ margin: 0, justifyContent: "flex-end" }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContainer}>
        {/* <View style={styles.modalHandle} /> */}
        <CustomIcon
          name={"close"}
          onClick={() => setIsModalVisible(false)}
          size={28}
          styles={{ marginLeft: 10, marginTop: 10 }}
        />
        <ScrollView style={{ flex: 1 }}>
          <Text style={styles.modalTitle}>
            {selectedWorkout?.workout?.name}
          </Text>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerCell}>Metric</Text>
              <Text style={styles.headerCell}>Value</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.cell}>Sets</Text>
              <Text style={styles.cell}>{selectedWorkout?.sets}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.cell}>Reps</Text>
              <Text style={styles.cell}>{selectedWorkout?.reps}</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.cell}>Rest</Text>
              <Text style={styles.cell}>{selectedWorkout?.reps}</Text>
            </View>
          </View>

          <View>
            <Text
              style={[
                customAppStyles.headerTitle,
                { marginLeft: 20, marginVertical: 20 },
              ]}
            >
              Video Guides
            </Text>
            {selectedWorkout?.workout?.videoLink ? (
              <View
                style={{
                  height: 200,
                  width: "90%",
                  alignSelf: "center",
                  marginTop: 20,
                }}
              >
                <WebView
                  allowsFullscreenVideo={true}
                  style={{}}
                  containerStyle={{}}
                  scrollEnabled={false}
                  source={{
                    uri: `${selectedWorkout?.workout?.videoLink}?&autoplay=0&showinfo=0&controls=1&fullscreen=1`,
                  }}
                />
              </View>
            ) : (
              <Text>No Video Guide</Text>
            )}
          </View>

          <Text>
            {selectedWorkout?.workout?.docLink && (
              <View>
                <Text
                  style={[
                    customAppStyles.headerTitle,
                    { marginLeft: 20, marginVertical: 20 },
                  ]}
                >
                  Instructions
                </Text>
                <Text
                  style={{
                    color: "#0066CC",
                    textDecorationLine: "underline",
                    fontSize: 16,
                    marginLeft: 20,
                  }}
                  onPress={() =>
                    Linking.openURL(selectedWorkout?.workout?.docLink)
                  }
                >
                  Click here to view detailed instructions for this exercise
                </Text>
              </View>
            )}
          </Text>
          <View style={{ marginBottom: 20 }}>
            <Text
              style={[
                customAppStyles.headerTitle,
                { marginLeft: 20, marginVertical: 20 },
              ]}
            >
              Workout Steps
            </Text>
            {selectedWorkout?.workout?.steps?.length > 0 ? (
              selectedWorkout?.workout?.steps?.map((step, index) => (
                <Text
                  key={index}
                  style={{
                    marginLeft: 20,
                    marginBottom: 10,
                    fontWeight: "bold",
                    fontSize: 14,
                    maxWidth: "80%",
                  }}
                >
                  {index + 1}. {step}
                </Text>
              ))
            ) : (
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 16,
                  fontStyle: "italic",
                }}
              >
                No workout steps available
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ReactNativeModal>
  );
};

export default ExerciseInfoModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 10,
    height: "90%",
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
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalInfoRow: {
    flexDirection: "row",
    marginBottom: 15,
    paddingHorizontal: 20,
    gap: 10,
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalValue: {
    fontSize: 20,
    fontWeight: "bold",
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
});
