import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import SwitchTrainerSheet from "../SwitchTrainerSheet";
import { AppContext } from "../../context/AppContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { customAppStyles } from "../../utils/styles";
import PlanDetailModal from "../PlanDetailModal";
import { screens } from "../../utils/constants";

const PlanScreen = ({ navigation }) => {
  const [planModalDetailModal, setplanModalDetailModal] = useState(false);
  const planOptions = ["Workout", "Meals"];
  const [planOptionSelected, setplanOptionSelected] = useState(planOptions[0]);
  const [switchTrainerModal, setswitchTrainerModal] = useState(false);
  const [trainerData, settrainerData] = useState<any>();
  const [allTrainers, setallTrainers] = useState([]);
  const [userPlans, setuserPlans] = useState([]);
  const { appUser, getUser } = useContext(AppContext);

  const getUserPlans = async () => {
    const q = query(
      collection(db, `users/${appUser?.trainer}/exercisePlans`),
      where("users", "array-contains", "test01@gmail.com")
    );

    const querySnapshot = await getDocs(q);
    const plans = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      plans.push(doc.data());
    });
    setuserPlans(plans);
    console.log("User Plans", userPlans);
  };
  const loadAllTrainers = async () => {
    const ref = collection(db, "users");
    const queryData = query(ref, where("isTrainer", "==", true));
    const querySnapshot = await getDocs(queryData);
    const trainers = [];
    querySnapshot.forEach(async (doc) => {
      console.log("Trainer query:", doc.data());
      await trainers.push(doc.data());
    });
    setallTrainers(trainers.reverse());
  };

  const getTrainer = async () => {
    const docRef = doc(db, "users", appUser?.trainer);
    const docSnap = await getDoc(docRef);
    settrainerData(docSnap.data());
    console.log("Trainer from get Trainer", docSnap.data());
  };
  useEffect(() => {
    getUserPlans();
    if (appUser.trainer) {
      getTrainer();
      loadAllTrainers();
    }
    getUser();
  }, []);

  const PlanCard = ({ data }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screens.PlanDetails, { exercisePlan: data })
        }
        style={{ marginTop: 20 }}
      >
        <Image
          style={{
            height: 140,
            width: "90%",
            alignSelf: "center",
            borderWidth: 4,
            borderColor: "#0086C9",
            borderRadius: 10,
          }}
          src={"https://i.ibb.co/XxZX1Qw/1-1.png"}
        />
        <View
          style={[
            {
              width: "90%",
              alignSelf: "center",
              position: "absolute",
              bottom: 0,
              height: 50,
              borderWidth: 2,
              borderColor: "#0086C9",
              borderTopWidth: 0,
              // opacity: 0.8,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              backgroundColor: "white",
            },
          ]}
        />
        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 30,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            {data?.focusPart}
          </Text>
          <Text style={{ color: "#475467" }}>30 days | 2-4 days/week</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ height: "100%" }}>
      <PlanDetailModal
        modal={planModalDetailModal}
        setIsModal={setplanModalDetailModal}
        planDetails={undefined}
      />
      <SwitchTrainerSheet
        modal={switchTrainerModal}
        setModal={setswitchTrainerModal}
        allTrainers={allTrainers}
        navigation={navigation}
        getTrainer={getTrainer}
      />

      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
        Plans
      </Text>

      <View style={styles.trainerSwitchBox}>
        <View>
          <View style={{ flexDirection: "row" }}>
            {appUser?.trainer ? (
              <>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    marginRight: 10,
                    borderRadius: 20,
                  }}
                  source={{ uri: trainerData?.photo }}
                />
                <View style={{ marginLeft: 3 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {trainerData?.name}
                  </Text>
                  <Text
                    style={{
                      fontWeight: "500",
                      fontSize: 15,
                      color: "#475467",
                    }}
                  >
                    {trainerData?.specialisation}
                  </Text>
                </View>
              </>
            ) : (
              <View style={{ width: "100%", justifyContent: "center" }}>
                <TouchableOpacity onPress={() => setswitchTrainerModal(true)}>
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 15,
                      color: "#026AA2",
                      textAlign: "center",
                    }}
                  >
                    Choose your trainer
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {appUser?.trainer && (
            <TouchableOpacity onPress={() => setswitchTrainerModal(true)}>
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 15,
                  color: "#026AA2",
                  marginTop: 2,
                  textAlign: "right",
                  marginRight: 20,
                }}
              >
                Switch Trainer
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ marginTop: 20, marginLeft: 10 }}>
        <Text>Categories of plans to help you reach your goals.</Text>
      </View>

      <View style={styles.optionStrip}>
        {planOptions.map((data, i) => {
          return (
            <TouchableOpacity
              onPress={() => setplanOptionSelected(data)}
              style={
                data == planOptionSelected
                  ? styles.button
                  : { backgroundColor: "transparent" }
              }
              key={i}
            >
              <Text
                style={
                  data == planOptionSelected
                    ? { fontWeight: "bold" }
                    : { fontWeight: "bold", color: "#667085" }
                }
              >
                {data}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <Text style={{ color: "#026AA2", fontWeight: "bold" }}>
          Custom Plans
        </Text>
      </View>

      {userPlans.map((data, i) => {
        return <PlanCard key={i} data={data} />;
      })}
    </SafeAreaView>
  );
};

export default PlanScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  optionStrip: {
    backgroundColor: "#F9FAFB",
    height: 50,
    alignSelf: "center",
    width: "90%",
    borderWidth: 1,
    borderColor: "#F2F4F7",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  trainerSwitchBox: {
    height: 100,
    width: "80%",
    borderWidth: 1,
    borderColor: "#98A2B3",
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
    justifyContent: "center",
    padding: 5,
  },
});
