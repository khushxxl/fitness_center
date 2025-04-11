import {
  ActivityIndicator,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { images } from "../utils/constants";
import { customAppStyles } from "../utils/styles";
import CustomPost from "./CustomPost";
import AddPostModal from "./AddPostModal";
import Icon from "react-native-vector-icons/FontAwesome";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AppContext } from "../context/AppContext";

const Post = ({ navigation }) => {
  const [postData, setpostData] = useState([]);
  const [showAddPostModal, setshowAddPostModal] = useState(false);
  const [postLoading, setpostLoading] = useState(false);
  const { allPosts, setallPosts } = useContext(AppContext);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const preloadImages = async (posts) => {
    try {
      const imagePromises = posts.map((post) => {
        if (post.media) {
          return Image.prefetch(post.media);
        }
        if (post.uploadedBy?.photo) {
          return Image.prefetch(post.uploadedBy.photo);
        }
        return Promise.resolve();
      });

      await Promise.all(imagePromises);
      setImagesLoaded(true);
    } catch (error) {
      console.error("Error preloading images:", error);
      setImagesLoaded(true); // Set to true even on error to not block rendering
    }
  };

  const getAllPosts = async () => {
    setpostLoading(true);
    const allPostsInline: any = [];
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(postsQuery);
    querySnapshot.forEach((doc) => {
      allPostsInline.push({ id: doc.id, ...doc.data() });
    });
    setallPosts(allPostsInline);
    await preloadImages(allPostsInline);
    setpostLoading(false);
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await getAllPosts();
      setRefreshing(false);
    }, 2000);
  }, []);

  if (postLoading || !imagesLoaded) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <AddPostModal
        modal={showAddPostModal}
        setModal={setshowAddPostModal}
        postData={postData}
        setPostData={setpostData}
        getAllPosts={getAllPosts}
      />
      <View
        style={{
          flexDirection: "row",
          alignSelf: "center",
          alignItems: "center",
          marginTop: 10,
          width: "100%",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          Community
        </Text>
        <TouchableOpacity
          onPress={() => setshowAddPostModal(true)}
          style={{ position: "absolute", right: 30 }}
        >
          <Icon color={"black"} name="plus" size={20} />
        </TouchableOpacity>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {allPosts &&
          allPosts?.map((data, i) => {
            return <CustomPost onRefresh={getAllPosts} data={data} key={i} />;
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Post;

const styles = StyleSheet.create({});
