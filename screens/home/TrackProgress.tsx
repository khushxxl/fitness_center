import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AppContext } from "../../context/AppContext";
import CustomIcon from "../../components/CustomIcon";
import CustomButton from "../../components/CustomButton";
import WeightInputModal from "../../components/WeightInputModal";
import { images } from "../../utils/constants";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

const TrackProgress = ({ navigation }) => {
  const { appUser, getUser } = useContext(AppContext);
  const auth = getAuth();

  const [weightInput, setWeightInput] = useState(null);
  const [userWeights, setUserWeights] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [weightModal, setWeightModal] = useState(false);
  const screenWidth = Dimensions.get("window").width;
  const [view, setView] = useState("week");
  const [user, setuser] = useState<any>();

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData: any = userDocSnap.data();
          setuser(userData);
          setUserWeights(userData.userHealthData?.weightRecords || []);
          // setSelectedData(userData?.weightRecords[0]);
        }
      }
    };
    fetchUserData();
  }, [auth.currentUser]);

  // Filter data based on the selected view
  const filterData = (data, view) => {
    const now = new Date();
    let filteredData;
    switch (view) {
      case "week":
        filteredData = data.filter(
          (d) => new Date(d.date) > new Date(now.setDate(now.getDate() - 7))
        );
        break;
      case "month":
        filteredData = data.filter(
          (d) => new Date(d.date) > new Date(now.setMonth(now.getMonth() - 1))
        );
        break;
      case "year":
        filteredData = data.filter(
          (d) =>
            new Date(d.date) > new Date(now.setFullYear(now.getFullYear() - 1))
        );
        break;
      default:
        filteredData = data;
    }
    // Ensure weights are numbers
    return filteredData.map((d) => ({
      ...d,
      weight: Number(d.weight),
    }));
  };

  const graphData = filterData(userWeights, view);
  const dataPoints = graphData.map((d) => d.weight);
  const labels = graphData.map((d, index) => index + 1); // Example labels for x-axis

  return (
    <SafeAreaView style={styles.container}>
      <WeightInputModal
        modal={weightModal}
        setModal={setWeightModal}
        weightInput={weightInput}
        setWeightInput={setWeightInput}
        userWeights={userWeights}
        setuserWeights={setUserWeights}
      />
      <View style={styles.header}>
        <CustomIcon
          styles={styles.backIcon}
          name="chevron-back-outline"
          onClick={() => navigation.goBack()}
          size={24}
        />
        <Text style={styles.title}>Your Progress</Text>
      </View>
      <TouchableOpacity style={styles.weightDisplay}>
        <Text style={styles.weightText}>
          {selectedData
            ? `${selectedData.weight} kg`
            : userWeights.length > 0
              ? `${userWeights[userWeights.length - 1]?.weight} kg`
              : user?.weight}
        </Text>
      </TouchableOpacity>

      <View style={{ width: "70%", alignSelf: "center" }}>
        <CustomButton
          onClick={() => setWeightModal(!weightModal)}
          title="Update"
          textColor="white"
        />
      </View>
      <View style={styles.chartContainer}>
        {dataPoints.length > 0 && (
          <LineChart
            data={{
              labels,
              datasets: [{ data: dataPoints }],
            }}
            width={screenWidth - 16}
            height={220}
            yAxisLabel=""
            yAxisSuffix="kg"
            chartConfig={{
              backgroundColor: "#e26a00",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726",
              },
            }}
            onDataPointClick={(data) => {
              const selectedPoint = graphData[data.index];
              setSelectedData({
                weight: selectedPoint.weight,
                progressImages: selectedPoint.progressImages,
              });
              console.log("Selected Point:", selectedPoint);
            }}
            bezier
            style={styles.chartStyle}
          />
        )}
      </View>
      <View style={styles.viewSelector}>
        <TouchableOpacity
          onPress={() => setView("year")}
          style={[styles.viewButton, view === "year" && styles.selectedView]}
        >
          <Text style={styles.viewButtonText}>Year</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setView("month")}
          style={[styles.viewButton, view === "month" && styles.selectedView]}
        >
          <Text style={styles.viewButtonText}>Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setView("week")}
          style={[styles.viewButton, view === "week" && styles.selectedView]}
        >
          <Text style={styles.viewButtonText}>Week</Text>
        </TouchableOpacity>
      </View>
      {selectedData && selectedData?.progressImages?.length > 0 && (
        <Text style={styles.progressPhotosTitle}>Progress Photos</Text>
      )}
      <ScrollView horizontal style={styles.scrollView}>
        {selectedData?.progressImages?.map((image, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: image }} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 10,
    alignItems: "center",
    flexDirection: "row",
  },
  logo: {
    height: 13,
    width: 140,
  },
  backIcon: {
    marginLeft: 10,
    marginTop: 10,
  },
  title: {
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: "gray",
  },
  weightDisplay: {
    alignSelf: "center",
    marginTop: 20,
  },
  weightText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
  },
  chartContainer: {
    alignSelf: "center",
    marginTop: 40,
    justifyContent: "center",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  viewSelector: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "80%",
    marginTop: 20,
    backgroundColor: "lightgray",
    padding: 5,
    borderRadius: 20,
    alignItems: "center",
  },
  viewButton: {
    padding: 5,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  selectedView: {
    backgroundColor: "white",
  },
  viewButtonText: {
    fontWeight: "bold",
  },
  progressPhotosTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 15,
    marginLeft: 20,
  },
  scrollView: {
    alignSelf: "flex-start",
    width: "100%",
  },
  imageContainer: {
    marginTop: 30,
    marginLeft: 20,
  },
  image: {
    height: 200,
    width: 120,
    borderRadius: 20,
  },
});

export default TrackProgress;
