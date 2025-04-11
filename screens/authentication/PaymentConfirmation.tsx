import { StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import CustomButton from "../../components/CustomButton";
import { AppContext } from "../../context/AppContext";
import { screens } from "../../utils/constants";

const PaymentConfirmation = ({ navigation }) => {
  const { appUser } = useContext(AppContext);

  return (
    <View style={{ justifyContent: "center", flex: 1, alignItems: "center" }}>
      <ConfettiCannon count={300} origin={{ x: -10, y: 0 }} />

      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>
          Let's Begin your fittness journey
        </Text>
        <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}>
          Payment Successful
        </Text>
      </View>
      <View style={{ width: "80%" }}>
        <CustomButton
          onClick={() => {
            console.log(appUser.subsription);
            if (appUser && appUser.subsription) {
              navigation.navigate(screens.HomeScreen);
            }
          }}
          title={"Continue to Home"}
          textColor={"white"}
        />
      </View>
    </View>
  );
};

export default PaymentConfirmation;

const styles = StyleSheet.create({});
