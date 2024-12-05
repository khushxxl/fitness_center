import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState, useEffect } from "react";
import Modal from "react-native-modal";
import CustomIcon from "./CustomIcon";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../utils/firebase";
import { AppContext } from "../context/AppContext";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const AddPostModal = ({
  modal,
  setModal,
  postData,
  setPostData,
  getAllPosts,
}) => {
  const [postContent, setpostContent] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const addPost = () => {
    setPostData([...postData, { postContent, media: image }]);
    setModal(false);
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.email));
        if (userDoc.exists()) {
          setUser(userDoc.data());
        }
      }
    };
    fetchUser();
  }, []);

  const uploadImageAsync = async (uri) => {
    const res = await fetch(uri);
    const blob = await res.blob();

    const storageRef = ref(
      storage,
      `post/${user?.name + " " + new Date().toISOString()}`
    );
    const snapshot = await uploadBytesResumable(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  };

  const uploadPost = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }
    setLoading(true);
    try {
      let downloadURL;
      if (image) {
        downloadURL = await uploadImageAsync(image);
      }

      await addDoc(collection(db, `posts`), {
        uploadedBy: user,
        comments: [],
        likedBy: [],
        content: postContent,
        media: downloadURL ? downloadURL : "",
        timestamp: serverTimestamp(),
      });

      await getAllPosts();
      console.log("Post Uploaded");
      setModal(false);
    } catch (error) {
      console.error("Error uploading post:", error);
      Alert.alert("Error", "Failed to upload post");
    } finally {
      setLoading(false);
    }
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
    <Modal style={{ margin: 0 }} isVisible={modal}>
      <View style={{ height: "100%", width: "100%", backgroundColor: "white" }}>
        <SafeAreaView>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 20,
            }}
          >
            <CustomIcon
              name={"close-outline"}
              onClick={() => setModal(false)}
              size={25}
              styles={false}
            />
            <TouchableOpacity onPress={uploadPost}>
              <Text style={{ fontSize: 15, color: "blue", fontWeight: "bold" }}>
                Post
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              minHeight: "20%",
              backgroundColor: "white",
              marginHorizontal: 20,
              justifyContent: "space-between",
            }}
          >
            <TextInput
              placeholder="Start Typing"
              multiline={true}
              placeholderTextColor={"gray"}
              style={{ fontSize: 18, marginTop: 30 }}
              onChangeText={setpostContent}
            />
            <TouchableOpacity onPress={pickImage}>
              <Text
                style={{
                  fontSize: 15,
                  color: "blue",
                  fontWeight: "bold",
                  marginTop: 15,
                }}
              >
                Add Media
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 40 }}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{
                  height: 200,
                  width: "95%",
                  borderRadius: 20,
                  alignSelf: "center",
                }}
              />
            )}
          </View>
          {loading && <ActivityIndicator size={"large"} />}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default AddPostModal;

const styles = StyleSheet.create({});
