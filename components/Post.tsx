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
import { collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AppContext } from "../context/AppContext";

const Post = ({ navigation }) => {
  const [postData, setpostData] = useState([]);
  const [showAddPostModal, setshowAddPostModal] = useState(false);
  const [postLoading, setpostLoading] = useState(false);
  const { allPosts, setallPosts } = useContext(AppContext);
  // const [allPosts, setallPosts] = useState([]);

  const getAllPosts = async () => {
    setpostLoading(true);
    const allPostsInline: any = [];
    const querySnapshot = await getDocs(collection(db, "posts"));
    querySnapshot.forEach((doc) => {
      allPostsInline.push({ id: doc.id, ...doc.data() });
      console.log(doc.id, " => ", doc.data());
    });
    setallPosts(allPostsInline);
    console.log(allPosts);
    setpostLoading(false);
  };

  // useEffect(() => {
  //   getAllPosts();
  // }, []);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await getAllPosts();
      setRefreshing(false);
    }, 2000);
  }, []);

  if (postLoading) {
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
        {/* <CustomPost />
        <CustomPost />
        <CustomPost /> */}
        {allPosts &&
          allPosts?.map((data, i) => {
            return <CustomPost data={data} key={i} />;
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Post;

const styles = StyleSheet.create({});
