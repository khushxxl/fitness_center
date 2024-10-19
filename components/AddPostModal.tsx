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
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../utils/firebase";
import { AppContext } from "../context/AppContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getBlobFroUri, getRandomInt } from "../utils/constants";

const AddPostModal = ({
  modal,
  setModal,
  postData,
  setPostData,
  getAllPosts,
}) => {
  const [postContent, setpostContent] = useState("");
  const [postMedia, setpostMedia] = useState("");
  const [image, setimage] = useState<any>();
  const [user, setUser] = useState(null);

  const addPost = () => {
    setPostData([...postData, { postContent, postMedia }]);
    setModal(false);
  };
  const [loading, setloading] = useState(false);

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

  const uploadPost = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }
    setloading(true);
    let downloadURL;
    if (image) {
      const imageRef = ref(
        storage,
        `post/${user?.name + " " + getRandomInt()}`
      );
      const imageBlob: any = await getBlobFroUri(image);

      console.log("Blob", imageBlob);

      await uploadBytes(imageRef, imageBlob)
        .then(async (snapshot) => {
          downloadURL = await getDownloadURL(imageRef);
        })
        .then(async (result) => {
          await getAllPosts().then(() => {
            setModal(false);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    await addDoc(collection(db, `posts`), {
      uploadedBy: user,
      comments: [],
      likedBy: [],
      content: postContent,
      media: downloadURL ? downloadURL : "",
    }).then(() => {
      setloading(false);
      Alert.alert("Post Uploaded");
      setModal(false);
    });
    setloading(false);
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
        setimage(result.assets[0].uri);
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
            <Image
              source={{ uri: image }}
              style={{
                height: 200,
                width: "95%",
                // objectFit: "contain",
                borderRadius: 20,
                alignSelf: "center",
              }}
            />
          </View>
          {loading && <ActivityIndicator size={"large"} />}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default AddPostModal;

const styles = StyleSheet.create({});
