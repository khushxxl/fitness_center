import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import Modal from "react-native-modal";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import * as ImagePicker from "expo-image-picker";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { AppContext } from "../context/AppContext";
import { db, storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getBlobFroUri } from "../utils/constants";

const WeightInputModal = ({
  modal,
  setModal,
  weightInput,
  setWeightInput,
  userWeights,
  setuserWeights,
}) => {
  const [imageCollection, setimageCollection] = useState([]);
  const [loading, setloading] = useState(false);

  const { appUser, getUser } = useContext(AppContext);

  const addWeight = async () => {
    if (!weightInput) {
      Alert.alert("Error", "Please enter a weight value.");
      return;
    }

    try {
      setloading(true);
      const imageURLS = await uploadImages();
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

      const newWeightRecord = {
        weight: weightInput,
        date,
        progressImages: imageURLS && imageURLS.length > 0 ? imageURLS : [],
      };

      // Update the user's weight records array by pushing the new record
      await updateDoc(doc(db, "users", appUser?.email), {
        "userHealthData.weightRecords": arrayUnion(newWeightRecord),
      });

      await getUser();
      setuserWeights((prevWeights) => [...prevWeights, newWeightRecord]);

      setWeightInput("");
      setimageCollection([]);
      setModal(false);
    } catch (error) {
      console.error("Error adding weight: ", error);
      Alert.alert("Error", "Failed to save progress. Please try again.");
    } finally {
      setloading(false);
    }
  };

  const chooseProgressImages = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setimageCollection((prevCollection) => [
          ...prevCollection,
          result.assets[0].uri,
        ]);
      }
    } catch (error) {
      console.error("Error choosing images: ", error);
      Alert.alert("Error", "Failed to choose image. Please try again.");
    }
  };

  const uploadImages = async () => {
    const uploadedUrls = [];
    for (const uri of imageCollection) {
      try {
        const imageRef = ref(
          storage,
          `users/progressImages/${
            appUser?.name
          }/Weight - ${weightInput} kg/${Date.now()}`
        );
        const imageBlob = await getBlobFroUri(uri);
        await uploadBytes(imageRef, imageBlob);
        const downloadUrl = await getDownloadURL(imageRef);
        uploadedUrls.push(downloadUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert(
          "Error",
          "Failed to upload an image. Continuing with others."
        );
      }
    }
    return uploadedUrls;
  };

  return (
    <Modal
      onBackdropPress={() => setModal(false)}
      style={{ margin: 0 }}
      isVisible={modal}
    >
      <View
        style={{
          backgroundColor: "white",
          height: "70%",
          width: "90%",
          alignSelf: "center",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <CustomInput
          label={"Enter Weight"}
          placeholder={"Weight"}
          value={weightInput}
          onChangeText={(text) => setWeightInput(text)}
          type="numeric"
        />

        <CustomButton
          onClick={chooseProgressImages}
          title={"Upload Progress Photos"}
          textColor={"black"}
          colors={["#fff", "#fff"]}
        />

        <ScrollView horizontal style={{ marginTop: 20 }}>
          {imageCollection.map((data, index) => (
            <View key={index} style={{ marginRight: 10 }}>
              <Image
                style={{ height: 200, width: 120, borderRadius: 20 }}
                source={{ uri: data }}
              />
              <Button
                onPress={() => {
                  setimageCollection((prevItems) =>
                    prevItems.filter((_, i) => i !== index)
                  );
                }}
                title="Remove"
              />
            </View>
          ))}
        </ScrollView>

        <View
          style={{
            position: "absolute",
            bottom: 10,
            width: "100%",
            alignSelf: "center",
          }}
        >
          {loading && <ActivityIndicator />}
          <CustomButton
            onClick={addWeight}
            title={"Save Progress"}
            textColor={"white"}
            disabled={loading}
          />
        </View>
      </View>
    </Modal>
  );
};

export default WeightInputModal;

const styles = StyleSheet.create({});
