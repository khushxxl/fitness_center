import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import * as Progress from "react-native-progress";
import CustomButton from "../../components/CustomButton";
import { screens } from "../../utils/constants";
import QuestionSection from "../../components/QuestionSection";
import { AppContext } from "../../context/AppContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useSessionList } from "@clerk/clerk-expo";
import { getAuth } from "firebase/auth";

const QuestionScreen = ({ navigation, route }) => {
  const [questionNumber, setquestionNumber] = useState(0);
  const [progressBarController, setprogressBarController] = useState(0.0);

  const auth = getAuth();
  const [loading, setloading] = useState(false);

  const [gender, setgender] = useState("");
  const [age, setage] = useState();
  const [height, setheight] = useState<any>();
  const [weight, setweight] = useState<any>();
  const [trainingGoal, settrainingGoal] = useState("");
  const [otherGoal, setotherGoal] = useState("");
  const [currentBuild, setcurrentBuild] = useState("");
  const [trainingStatus, settrainingStatus] = useState("");
  const [trainingExperience, settrainingExperience] = useState("");
  const [trainingYears, settrainingYears] = useState<any>();
  const [obstacle, setobstacle] = useState("");
  const [schedule, setschedule] = useState("");
  const [typicalDay, settypicalDay] = useState("");
  const [sleepHours, setsleepHours] = useState("");
  const [weeklyGymDays, setweeklyGymDays] = useState<any>();
  const [dietaryRestrictions, setdietaryRestrictions] = useState("");
  const [medicalConditions, setmedicalConditions] = useState("");
  const [foundFrom, setfoundFrom] = useState("");
  const [signupReason, setsignupReason] = useState("");

  const userEmail = auth?.currentUser?.email;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userEmail));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setgender(data.gender || "");
          setage(data.age);
          setheight(data.userHealthData?.height?.toString());
          setweight(data.userHealthData?.weight?.toString());
          settrainingGoal(data.trainingGoal || "");
          setotherGoal(data.otherGoal || "");
          setcurrentBuild(data.currentBuild || "");
          settrainingStatus(data.trainingStatus || "");
          settrainingExperience(data.trainingExperience || "");
          settrainingYears(data.trainingYears);
          setobstacle(data.obstacle || "");
          setschedule(data.schedule || "");
          settypicalDay(data.typicalDay || "");
          setsleepHours(data.sleepHours || "");
          setweeklyGymDays(data.weeklyGymDays);
          setdietaryRestrictions(data.dietaryRestrictions || "");
          setmedicalConditions(data.medicalConditions || "");
          setfoundFrom(data.foundFrom || "");
          setsignupReason(data.signupReason || "");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userEmail) {
      fetchUserData();
    }
  }, [userEmail]);

  const questions = [
    {
      question: "What is your gender?",
      options: ["Man", "Woman"],
      setter: setgender,
      value: gender,
    },
    {
      question: "What is your age?",
      setter: setage,
      value: age,
      textBox: true,
      keyboardType: "numeric",
      placeholder: "Enter your age",
    },
    {
      question: "How tall are you?",
      setter: setheight,
      value: height,
      textBox: true,
      keyboardType: "numeric",
      placeholder: "Enter your height (in cm)",
    },
    {
      question: "How much do you weigh?",
      setter: setweight,
      value: weight,
      textBox: true,
      keyboardType: "numeric",
      placeholder: "Enter your weight (in kg)",
    },
    {
      question: "What is your main goal for training?",
      options: [
        "Gain Muscle",
        "Lose Body Fat",
        "Improve Endurance",
        "Increase Strength",
        "Other",
      ],
      setter: settrainingGoal,
      value: trainingGoal,
      otherSetter: setotherGoal,
      otherValue: otherGoal,
    },
    {
      question: "What is your current build?",
      options: ["Skinny", "Average", "Overweight"],
      setter: setcurrentBuild,
      value: currentBuild,
    },
    {
      question: "What is your current training status?",
      options: ["Don't train", "Slightly active", "Active", "Very active"],
      setter: settrainingStatus,
      value: trainingStatus,
    },
    {
      question: "What is your training experience level?",
      options: ["Beginner", "Intermediate", "Advanced"],
      setter: settrainingExperience,
      value: trainingExperience,
    },
    {
      question: "How many years have you been training?",
      setter: settrainingYears,
      value: trainingYears,
      textBox: true,
      keyboardType: "numeric",
      placeholder: "Enter number of years",
    },
    {
      question: "What is your biggest perceived obstacle?",
      options: [
        "Lack of time",
        "Lack of motivation",
        "Injuries",
        "Knowledge",
        "Equipment access",
        "Other",
      ],
      setter: setobstacle,
      value: obstacle,
    },
    {
      question: "What is your current daily schedule?",
      options: [
        "9 to 5",
        "Night Shifts",
        "Flexible Hours",
        "I'm Retired/Not Currently Working",
      ],
      setter: setschedule,
      value: schedule,
    },
    {
      question: "What does your typical day look like?",
      options: [
        "Spend most of my time sitting",
        "I take active breaks",
        "I am very physically active",
      ],
      setter: settypicalDay,
      value: typicalDay,
    },
    {
      question: "How much sleep do you get?",
      options: ["Fewer than 5 hours", "5-6 hours", "7-8 hours", "Over 8 hours"],
      setter: setsleepHours,
      value: sleepHours,
    },
    {
      question: "How many times a week can you commit to the gym?",
      setter: setweeklyGymDays,
      value: weeklyGymDays,
      textBox: true,
      keyboardType: "numeric",
      placeholder: "Enter number of days",
    },
    {
      question: "Do you have any dietary preferences or restrictions?",
      setter: setdietaryRestrictions,
      value: dietaryRestrictions,
      textBox: true,
      multiLine: true,
      placeholder: "Describe any dietary restrictions",
    },
    {
      question:
        "Do you have any medical conditions or injuries we should be aware of?",
      setter: setmedicalConditions,
      value: medicalConditions,
      textBox: true,
      multiLine: true,
      placeholder: "Describe any medical conditions or injuries",
    },
    {
      question: "How did you find out about Fitcentre app?",
      setter: setfoundFrom,
      value: foundFrom,
      textBox: true,
      placeholder: "Tell us how you found us",
    },
    {
      question: "Why did you decide to sign up today?",
      setter: setsignupReason,
      value: signupReason,
      textBox: true,
      multiLine: true,
      placeholder: "Tell us your motivation for signing up",
    },
  ];

  return (
    <SafeAreaView
      style={{ height: "100%", width: "100%", backgroundColor: "white" }}
    >
      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "bold" }}>
        Fitness Goals
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(screens.HomeScreen);
        }}
      >
        <Text
          style={{
            textAlign: "right",
            fontSize: 13,
            fontWeight: "bold",
            marginRight: 10,
            textDecorationLine: "underline",
          }}
        >
          Skip
        </Text>
      </TouchableOpacity>

      <View style={{ margin: 20, marginTop: 10 }}>
        <Image source={require("../../assets/images/questionIcon.png")} />
        <View
          style={{ marginTop: 10, flexDirection: "row", alignSelf: "center" }}
        >
          <Progress.Bar
            progress={progressBarController}
            width={350}
            height={10}
            borderRadius={20}
            unfilledColor="#7CD4FD"
            color="#065986"
            borderColor="#fff"
          />
        </View>

        <ScrollView keyboardDismissMode="on-drag">
          {questionNumber < questions.length && (
            <QuestionSection {...questions[questionNumber]} />
          )}
          {loading && (
            <View style={{ marginTop: 20 }}>
              <ActivityIndicator color={"black"} />
            </View>
          )}
        </ScrollView>
      </View>

      <View
        style={{
          marginTop: 25,
          alignSelf: "center",
          width: "100%",
        }}
      >
        <CustomButton
          title={"Continue"}
          textColor={"white"}
          colors={["#4c669f", "#3b5998", "#192f6a"]}
          onClick={async () => {
            if (questionNumber >= questions.length) {
              return;
            }

            if (questionNumber === questions.length - 1) {
              setloading(true);

              try {
                const userDocRef = doc(db, "users", userEmail);
                const userDocSnapshot = await getDoc(userDocRef);

                if (userDocSnapshot.exists()) {
                  const existingData = userDocSnapshot.data();
                  const currentUserHealthData =
                    existingData.userHealthData || {};

                  const updatedUserHealthData = {
                    ...currentUserHealthData,
                    height: height || 0,
                    weight: weight || 0,
                  };

                  await updateDoc(userDocRef, {
                    gender,
                    age,
                    trainingGoal,
                    otherGoal,
                    currentBuild,
                    trainingStatus,
                    trainingExperience,
                    trainingYears,
                    obstacle,
                    schedule,
                    typicalDay,
                    sleepHours,
                    weeklyGymDays,
                    dietaryRestrictions,
                    medicalConditions,
                    foundFrom,
                    signupReason,
                    userHealthData: updatedUserHealthData,
                  });

                  setloading(false);
                  navigation.navigate(screens.HomeScreen);
                } else {
                  throw new Error("User document does not exist");
                }
              } catch (error) {
                Alert.alert(error.message);
                setloading(false);
              }
            }

            setquestionNumber(questionNumber + 1);
            setprogressBarController((questionNumber + 1) / questions.length);
          }}
        />
        <CustomButton
          title={"Back"}
          textColor={"black"}
          colors={["#fff", "#fff", "#fff"]}
          onClick={() => {
            if (questionNumber !== 0) {
              setquestionNumber(questionNumber - 1);
              setprogressBarController(questionNumber / questions.length);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default QuestionScreen;

const styles = StyleSheet.create({});
