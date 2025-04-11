import {
  ActivityIndicator,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import Modal from "react-native-modal";
import CustomInput from "./CustomInput";
import CustomButton from "./CustomButton";
import * as ImagePicker from "expo-image-picker";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { AppContext } from "../context/AppContext";
import { db, storage } from "../utils/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const WeightInputModal = ({
  modal,
  setModal,
  weightInput,
  setWeightInput,
  userWeights,
  setuserWeights,
}) => {
  const [imageCollection, setImageCollection] = useState([]);
  const [loading, setLoading] = useState(false);

  const { appUser } = useContext(AppContext);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
      });

      if (!result.canceled) {
        setImageCollection((prev) => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const uploadImageAsync = async (uri) => {
    const res = await fetch(uri);
    const blob = await res.blob();

    const storageRef = ref(
      storage,
      `users/${appUser.uid}/weightProgress/${new Date().toISOString()}`
    );
    const snapshot = await uploadBytesResumable(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  };

  const addWeight = async () => {
    console.log(weightInput);
    if (!weightInput) {
      return;
    }
    try {
      setLoading(true);
      const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // Upload images and get download URLs
      const uploadedImageUrls = await Promise.all(
        imageCollection.map(uploadImageAsync)
      );

      const newWeightRecord = {
        weight: weightInput,
        date,
        progressImages: uploadedImageUrls,
      };

      // Update the user's weight records in Firestore
      await updateDoc(doc(db, "users", appUser?.email), {
        "userHealthData.weightRecords": arrayUnion(newWeightRecord),
      });

      // await getUser(); // Refresh user data
      setuserWeights((prevWeights) => [...prevWeights, newWeightRecord]);

      // Reset state
      setWeightInput("");
      setImageCollection([]);
      setModal(false);
    } catch (error) {
      console.error("Error adding weight: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      onBackdropPress={() => setModal(false)}
      style={{ margin: 0 }}
      isVisible={modal}
    >
      <View style={styles.modalContainer}>
        <CustomInput
          label="Enter Weight"
          placeholder="Weight"
          value={weightInput}
          onChangeText={(text) => setWeightInput(text)}
          type="number-pad"
        />

        <CustomButton
          onClick={pickImage}
          title="Upload Progress Photos"
          textColor="black"
          colors={["#fff", "#fff"]}
        />

        <ScrollView horizontal style={styles.imageScroll}>
          {imageCollection.map((uri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri }} style={styles.image} />
              <Button
                title="Remove"
                onPress={() => {
                  setImageCollection((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <CustomButton
              onClick={addWeight}
              title="Save Progress"
              textColor="white"
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default WeightInputModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    height: "70%",
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    padding: 20,
  },
  imageScroll: {
    marginTop: 40,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    height: 200,
    width: 120,
    borderRadius: 20,
  },
  footer: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    alignSelf: "center",
  },
});
