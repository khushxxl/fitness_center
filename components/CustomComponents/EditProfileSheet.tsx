import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../utils/firebase";
import { AppContext } from "../../context/AppContext";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";

const EditProfileSheet = ({ isVisible, onClose }) => {
  const { userData, refreshUserData, setuserData } = useContext(AppContext);

  const [formData, setFormData] = useState({
    photo: userData?.photo || null,
    name: "",
    height: "",
    weight: "",
    age: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    requestImagePickerPermissions();
    fetchUserData();
  }, []);

  const requestImagePickerPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant media library access.");
    }
  };

  const fetchUserData = async () => {
    try {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.email));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFormData({
            photo: data.photo || null,
            name: data.name || "",
            height: data.userHealthData?.height?.toString() || "",
            weight: data.userHealthData?.weight?.toString() || "",
            age: data.age?.toString() || "",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const downloadUrl = await uploadImageAsync(result.assets[0].uri);
        handleInputChange("photo", downloadUrl);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setIsUploading(false);
    }
  };

  const uploadImageAsync = async (uri) => {
    const res = await fetch(uri);
    const blob = await res.blob();
    const storageRef = ref(
      storage,
      `users/${auth.currentUser.uid}/${new Date().toISOString()}`
    );
    const snapshot = await uploadBytesResumable(storageRef, blob);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  const validateInput = () => {
    const { name, height, weight, age } = formData;
    if (!name || !height || !weight || !age) {
      Alert.alert("Incomplete Data", "Please fill out all fields.");
      return false;
    }
    return true;
  };

  const updateUserInfo = async () => {
    if (!validateInput()) return;

    try {
      const updates = {
        name: formData.name,
        "userHealthData.height": parseInt(formData.height),
        "userHealthData.weight": parseInt(formData.weight),
        age: parseInt(formData.age),
        photo: formData.photo,
      };

      await updateDoc(doc(db, "users", auth.currentUser.email), updates);

      setuserData((prevData) => ({
        ...prevData,
        displayName: formData.name,
        photo: formData.photo,
        userHealthData: {
          ...prevData,
          height: parseInt(formData.height),
          weight: parseInt(formData.weight),
        },
        age: parseInt(formData.age),
      }));
      await fetchUserData();
      onClose();
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating user info:", error);
      Alert.alert(
        "Update Failed",
        "Could not update profile. Please try again."
      );
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} style={styles.modal}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollView}
        >
          <CustomIcon
            name="close-outline"
            onClick={onClose}
            size={30}
            styles={styles.closeIcon}
          />
          <View style={styles.content}>
            <TouchableOpacity onPress={pickImage} disabled={isUploading}>
              {isUploading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              ) : formData.photo ? (
                <Image
                  source={{ uri: formData.photo }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.emptyImage}>
                  <CustomIcon
                    name="person-outline"
                    size={30}
                    onClick={pickImage}
                    styles={false}
                  />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} disabled={isUploading}>
              <Text style={styles.changePhotoText}>
                {isUploading ? "Uploading..." : "Change Profile Picture"}
              </Text>
            </TouchableOpacity>
            <View style={styles.inputContainer}>
              <CustomInput
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
              />
              <View style={styles.row}>
                <CustomInput
                  label="Height (cm)"
                  placeholder="Enter height"
                  value={formData.height}
                  onChangeText={(text) => handleInputChange("height", text)}
                  type="numeric"
                  styles={styles.halfInput}
                />
                <CustomInput
                  label="Weight (kg)"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChangeText={(text) => handleInputChange("weight", text)}
                  type="numeric"
                  styles={styles.halfInput}
                />
              </View>
              <CustomInput
                label="Age"
                placeholder="Enter age"
                value={formData.age}
                onChangeText={(text) => handleInputChange("age", text)}
                type="numeric"
              />
              <CustomButton
                title="Save Changes"
                onClick={updateUserInfo}
                textColor="white"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { margin: 0, flex: 1 },
  container: { flex: 1, backgroundColor: "white", paddingTop: 60 },
  scrollView: { paddingBottom: 20 },
  closeIcon: { marginTop: 15 },
  content: { alignItems: "center" },
  profileImage: { height: 100, width: 100, borderRadius: 50 },
  emptyImage: {
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
  },
  loaderContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(200, 200, 200, 0.5)",
  },
  changePhotoText: { marginTop: 10, color: "blue" },
  inputContainer: { width: "100%" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
});

export default EditProfileSheet;
