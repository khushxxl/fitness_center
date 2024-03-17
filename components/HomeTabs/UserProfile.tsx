import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../utils/firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getBlobFroUri, screens } from "../../utils/constants";
import { useStripe } from "@stripe/stripe-react-native";

const UserProfile = ({ navigation }) => {
  const { appUser, getUser } = useContext(AppContext);
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:8000";

  const fetchPaymentSheetParams = async () => {
    const amount = 1399;
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      returnURL: "",
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
    }
  };

  const [image, setImage] = useState(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    const imageRef = ref(storage, `users/profileImages/${appUser?.name}`);
    const imageBlob: any = await getBlobFroUri(result.assets[0].uri);

    console.log("Blob", imageBlob);

    await uploadBytes(imageRef, imageBlob)
      .then(async (snapshot) => {
        const downloadURL = await getDownloadURL(imageRef);
        // await console.log(downloadURL);
        await updateDoc(doc(db, "users", appUser?.email), {
          photo: downloadURL,
        });
      })
      .then(async (result) => {
        // console.log(result);
        await getUser();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const OptionsBox = ({ onClick, title }) => {
    return (
      <TouchableOpacity
        onPress={onClick}
        style={{
          backgroundColor: "white",
          padding: 10,
          width: "90%",
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: 10,
          marginTop: 8,
          borderWidth: 0.5,
          borderColor: "gray",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="heart-outline" size={25} />
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 15 }}>
            {title}
          </Text>
        </View>
        <Ionicons name="chevron-forward-outline" size={25} />
      </TouchableOpacity>
    );
  };

  const DataBox = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: "white",
          width: "auto",
          alignSelf: "flex-start",
          padding: 8,
          borderRadius: 8,
          borderWidth: 0.5,
          borderColor: "gray",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 2,
          elevation: 5,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Ionicons color={"#0086C9"} name="flame-outline" size={25} />
        </View>
        <Text
          style={{
            textAlign: "center",
            marginTop: 5,
            fontWeight: "bold",
            fontSize: 17,
          }}
        >
          20,000
        </Text>
        <Text
          style={{ textAlign: "center", fontWeight: "400", color: "#344054" }}
        >
          Calories Burned
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        // backgroundColor: "#EAECF0",
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <View style={{ marginTop: 10 }}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
          Profile
        </Text>
      </View>

      <View style={{ alignSelf: "center", marginTop: 30 }}>
        <TouchableOpacity
          onPress={async () => {
            await pickImage();
          }}
        >
          {appUser && appUser?.photo ? (
            <Image
              style={{ height: 70, width: 70, borderRadius: 35 }}
              source={{ uri: appUser?.photo }}
            />
          ) : (
            <View
              style={{
                alignItems: "center",
                borderWidth: 2,
                height: 100,
                width: 100,
                justifyContent: "center",
                borderRadius: 50,
              }}
            >
              <Image
                style={{ height: 70, width: 70, borderRadius: 35 }}
                source={{ uri: "https://i.ibb.co/FJ1cyK4/weightlifter.png" }}
              />
            </View>
          )}
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            marginTop: 10,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {appUser?.name}
        </Text>
      </View>

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <DataBox />
        <DataBox />
        <DataBox />
      </View>

      <View style={{ marginTop: 20, justifyContent: "center" }}>
        <OptionsBox title={"Edit Profile"} onClick={async () => {}} />
        <OptionsBox
          title={"Subscribe"}
          onClick={() => {
            navigation.navigate(screens.Payment);
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({});