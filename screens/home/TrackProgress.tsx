import React, { useContext, useEffect, useState, useCallback } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AppContext } from "../../context/AppContext";
import CustomIcon from "../../components/CustomIcon";
import CustomButton from "../../components/CustomButton";
import WeightInputModal from "../../components/WeightInputModal";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";

const TrackProgress = ({ navigation }) => {
  const auth = getAuth();
  const screenWidth = Dimensions.get("window").width;
  const { userData } = useContext(AppContext);

  const [weightModal, setWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState(null);
  const [userWeights, setUserWeights] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [view, setView] = useState("week");
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = useCallback(async () => {
    try {
      if (auth.currentUser) {
        const userDocRef = doc(db, "users", auth.currentUser.email);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserWeights(userData.userHealthData?.weightRecords || []);
          setSelectedData({
            weight: userData?.userHealthData.weight,
          });
          console.log(userData?.userHealthData?.weight);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }, [auth.currentUser]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Filter weight records based on selected view (week, month, year)
  const filterData = (data, view) => {
    const now = new Date();
    let filteredData;

    switch (view) {
      case "week":
        filteredData = data.filter(
          (d) => new Date(d.date) >= new Date(now.setDate(now.getDate() - 7))
        );
        break;
      case "month":
        filteredData = data.filter(
          (d) => new Date(d.date) >= new Date(now.setMonth(now.getMonth() - 1))
        );
        break;
      case "year":
        filteredData = data.filter(
          (d) =>
            new Date(d.date) >= new Date(now.setFullYear(now.getFullYear() - 1))
        );
        break;
      default:
        filteredData = data;
    }

    return filteredData.map((d) => ({
      ...d,
      weight: parseFloat(d.weight) || 0, // Ensure weight is a number
    }));
  };

  const graphData = filterData(userWeights, view);
  const dataPoints = graphData.map((d) => d.weight);
  const labels = graphData.map((_, index) => index + 1); // X-axis labels as indexes

  // Handle selection of chart data point
  const handleDataPointClick = (data) => {
    const selectedPoint = graphData[data.index];
    setSelectedData({
      weight: selectedPoint.weight,
      progressImages: selectedPoint.progressImages || [],
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
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
            name="chevron-back-outline"
            onClick={() => navigation.goBack()}
            size={24}
            styles={styles.backIcon}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.weightText}>
            {selectedData
              ? `${selectedData.weight} kg`
              : userWeights.length > 0
                ? `${userWeights[userWeights.length - 1]?.weight} kg`
                : userData?.weight.toString()}
          </Text>
        </View>

        <View style={styles.updateButtonContainer}>
          <CustomButton
            onClick={() => setWeightModal(true)}
            title="Update"
            textColor="white"
          />
        </View>

        <View style={styles.chartContainer}>
          {dataPoints.length > 0 ? (
            <LineChart
              data={{
                labels,
                datasets: [{ data: dataPoints }],
              }}
              width={screenWidth - 16}
              height={220}
              yAxisSuffix="kg"
              chartConfig={{
                backgroundColor: "#e26a00",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: { borderRadius: 16 },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              onDataPointClick={handleDataPointClick}
              bezier
              style={styles.chartStyle}
            />
          ) : (
            <Text style={styles.noDataText}>No weight records available.</Text>
          )}
        </View>

        <View style={styles.viewSelector}>
          {["week", "month", "year"].map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v)}
              style={[styles.viewButton, view === v && styles.selectedView]}
            >
              <Text style={styles.viewButtonText}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedData?.progressImages?.length > 0 && (
          <Text style={styles.progressPhotosTitle}>Progress Photos</Text>
        )}

        <ScrollView horizontal style={styles.scrollView}>
          {selectedData?.progressImages?.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  backIcon: {
    marginLeft: 10,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  weightDisplay: {
    alignSelf: "center",
    marginVertical: 20,
  },
  weightText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  updateButtonContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  chartContainer: {
    alignSelf: "center",
    marginVertical: 20,
  },
  chartStyle: {
    borderRadius: 16,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
  },
  viewSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  viewButton: {
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 10,
  },
  selectedView: {
    backgroundColor: "lightgray",
  },
  viewButtonText: {
    fontWeight: "bold",
  },
  progressPhotosTitle: {
    marginLeft: 20,
    marginVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 120,
    height: 200,
    borderRadius: 10,
  },
});

export default TrackProgress;
