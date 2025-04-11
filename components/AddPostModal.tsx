import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
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

    if (!postContent.trim()) {
      Alert.alert("Error", "Please enter some content for your post");
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
        content: postContent.trim(),
        media: downloadURL ? downloadURL : "",
        timestamp: serverTimestamp(),
      });

      await getAllPosts();
      setpostContent("");
      setImage(null);
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
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <Modal
      style={{ margin: 0 }}
      isVisible={modal}
      avoidKeyboard
      onBackdropPress={() => setModal(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <CustomIcon
                name={"close-outline"}
                onClick={() => setModal(false)}
                size={25}
                styles={false}
              />
              <TouchableOpacity
                onPress={uploadPost}
                disabled={loading}
                style={[
                  styles.postButton,
                  !postContent.trim() && styles.disabledButton,
                ]}
              >
                <Text style={styles.postButtonText}>
                  {loading ? "Posting..." : "Post"}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
              <TextInput
                placeholder="What's on your mind?"
                multiline={true}
                placeholderTextColor={"gray"}
                style={styles.input}
                onChangeText={setpostContent}
                value={postContent}
                maxLength={500}
              />

              <View style={styles.mediaSection}>
                <TouchableOpacity
                  onPress={pickImage}
                  style={styles.mediaButton}
                >
                  <CustomIcon name="image-outline" size={24} styles={false} />
                  <Text style={styles.mediaButtonText}>Add Photo</Text>
                </TouchableOpacity>
              </View>
            </View>

            {image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  onPress={removeImage}
                  style={styles.removeImageButton}
                >
                  <CustomIcon name="close-circle" size={24} styles={false} />
                </TouchableOpacity>
              </View>
            )}

            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddPostModal;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "white",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#0066ff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  postButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    fontSize: 18,
    minHeight: 100,
    textAlignVertical: "top",
  },
  mediaSection: {
    flexDirection: "row",
    marginTop: 20,
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 20,
  },
  mediaButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  imageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  image: {
    height: 200,
    width: "100%",
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 15,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
