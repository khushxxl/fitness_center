import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-native-modal";
import { AppContext } from "../../context/AppContext";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getBlobFroUri, getRandomInt } from "../../utils/constants";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { app, db, storage, auth } from "../../utils/firebase";
import CustomIcon from "../CustomIcon";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";

const EditProfileSheet = ({ modal, setModal }) => {
  const { appUser, getUser, setappUser } = useContext(AppContext);

  const [image, setImage] = useState(appUser?.photo);
  const [userName, setuserName] = useState("");
  const [userHeight, setuserHeight] = useState("");
  const [userWeight, setuserWeight] = useState("");
  const [userAge, setuserAge] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.email));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setuserName(userData.name || "");
          setuserHeight(
            userData.userHealthData?.height
              ? `${userData.userHealthData.height} cm`
              : ""
          );
          setuserWeight(
            userData.userHealthData?.weight
              ? `${userData.userHealthData.weight} kg`
              : ""
          );
          setuserAge(userData.age ? userData.age.toString() : "");
          setImage(userData.photo || null);
        }
      }
    };
    fetchUserData();
  }, []);

  console.log(appUser);
  const updateUserInfo = async () => {
    const updates = {};

    if (appUser?.userHealthData?.height !== userHeight) {
      updates["userHealthData.height"] = parseInt(userHeight);
    }

    if (appUser?.userHealthData?.weight !== userWeight) {
      updates["userHealthData.weight"] = parseInt(userWeight);
    }

    if (appUser?.name !== userName) {
      updates.name = userName;
    }

    if (appUser?.age !== userAge) {
      updates.age = parseInt(userAge);
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, "users", auth.currentUser.email), updates).then(
        async () => {
          await getUser().then(() => {
            setModal(false);
          });
        }
      );
    }

    if (image && image !== appUser?.photo) {
      const imageRef = ref(
        storage,
        `users/profileImages/${auth.currentUser.email + getRandomInt().toString()}`
      );

      const imageBlob = await getBlobFroUri(image);
      if (!imageBlob) {
        throw new Error("Failed to convert image URI to Blob.");
      }

      await uploadBytes(imageRef, imageBlob);
      const downloadURL = await getDownloadURL(imageRef);

      await updateDoc(doc(db, "users", auth.currentUser.email), {
        photo: downloadURL,
      });
    }

    await getUser();
    setModal(false);
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("From Photo Change", error);
    }
  };
  return (
    <Modal
      onBackdropPress={() => setModal(false)}
      style={{ margin: 0 }}
      isVisible={modal}
    >
      <ScrollView
        style={{
          backgroundColor: "white",
          height: "90%",
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        <CustomIcon
          name={"close-outline"}
          onClick={() => setModal(false)}
          size={30}
          styles={{ marginTop: 15 }}
        />
        <View style={{ width: "100%", alignItems: "center" }}>
          <TouchableOpacity>
            {image ? (
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 35,
                }}
                source={{ uri: image }}
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
              ></View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await pickImage();
            }}
          >
            <Text style={{ marginTop: 10, color: "blue" }}>
              Change Profile Picture
            </Text>
          </TouchableOpacity>
          <KeyboardAvoidingView behavior="padding" style={{ width: "100%" }}>
            <View style={{ width: "100%" }}>
              <CustomInput
                label={"Name"}
                placeholder={"Enter your name"}
                value={userName}
                onChangeText={setuserName}
              />
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  alignSelf: "center",
                }}
              >
                <CustomInput
                  label={"Height"}
                  placeholder={"Current Height"}
                  value={userHeight}
                  onChangeText={setuserHeight}
                  styles={{ minWidth: 150 }}
                />
                <CustomInput
                  label={"Weight"}
                  placeholder={"Current weight"}
                  value={userWeight}
                  onChangeText={setuserWeight}
                  styles={{ minWidth: 150 }}
                />
              </View>
              <View style={{ width: "35%" }}>
                <CustomInput
                  label={"Age"}
                  placeholder={"Current Age"}
                  value={userAge}
                  onChangeText={setuserAge}
                />
              </View>

              <CustomButton
                onClick={updateUserInfo}
                title={"Save Changes"}
                textColor={"white"}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </Modal>
  );
};

export default EditProfileSheet;

const styles = StyleSheet.create({});
