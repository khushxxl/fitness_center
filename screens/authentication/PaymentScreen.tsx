import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { customAppStyles } from "../../utils/styles";
import CustomButton from "../../components/CustomButton";
import { useStripe } from "@stripe/stripe-react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { AppContext } from "../../context/AppContext";
import ConfettiCannon from "react-native-confetti-cannon";
import { screens } from "../../utils/constants";

const PaymentScreen = ({ navigation, route }) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);

  const { appUser, getUser } = useContext(AppContext);

  const API_URL = "http://localhost:8000";

  const fetchPaymentSheetParams = async () => {
    const amount = selectedPlan.price;
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: 1099 }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  // useEffect(() => {
  //   initializePaymentSheet();
  // }, []);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      await updateDoc(doc(db, "users", appUser?.email), {
        subsription: true,
        subscription: new Date(),
      }).then(async () => {
        await getUser();
        navigation.navigate(screens.PaymentConfirm);
      });
    }
  };
  const plans = [
    {
      plan: "Basic",
      price: 1099,
      features: ["Benefit 1", "Benefit 2", "Benefit 3"],
    },
    {
      plan: "Premium",
      price: 2099,
      features: ["Benefit 1", "Benefit 2", "Benefit 3"],
    },
  ];

  const fromScreen = route?.params?.from;

  const [selectedPlan, setselectedPlan] = useState(plans[0]);
  const SelectionComponent = ({ data }) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "#dcecfa",
          margin: 20,
          padding: 10,
          borderRadius: 10,
        }}
        onPress={() => setselectedPlan(data)}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {selectedPlan.plan == data.plan ? (
              <Ionicons name="checkmark-circle" color={"#0086C9"} size={30} />
            ) : (
              <Ionicons name="ellipse-outline" size={30} />
            )}
            <Text style={[customAppStyles.headerTitle2, { marginLeft: 10 }]}>
              {data?.plan}
            </Text>
          </View>
          <Text
            style={[
              customAppStyles.headerTitle2,
              { marginLeft: 10, color: "#0086C9" },
            ]}
          >
            £{data?.price / 100}/month
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text style={[customAppStyles.subheading2, { color: "#667085" }]}>
            Includes
          </Text>
          {data?.features?.map((item, i) => {
            return (
              <View
                key={i}
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons
                  name="checkmark-done-circle"
                  color={"#667085"}
                  size={26}
                />
                <Text
                  style={[
                    customAppStyles.subheading2,
                    { marginLeft: 4, color: "#667085" },
                  ]}
                >
                  {item}
                </Text>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginHorizontal: 20,
        }}
      >
        <TouchableOpacity>
          <Ionicons
            name="chevron-back"
            size={30}
            style={{ alignSelf: "flex-start" }}
            color={"white"}
          />
        </TouchableOpacity>
        <Text
          style={[
            customAppStyles.headerTitle,
            { marginLeft: 10, textAlign: "center" },
          ]}
        >
          Pricing
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="close-outline"
            size={30}
            style={{ alignSelf: "flex-start" }}
          />
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 10 }}>
        {plans.map((data, i) => {
          return <SelectionComponent data={data} key={i} />;
        })}
      </View>

      <View>
        <CustomButton
          onClick={async () => {
            try {
              await initializePaymentSheet().then(async () => {
                await openPaymentSheet();
              });
            } catch (error) {
              console.log(error);
            }
          }}
          title={"Make Payment"}
          textColor={"white"}
        />
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;

const styles = StyleSheet.create({});
