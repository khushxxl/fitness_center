import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Modal from "react-native-modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DATA, images, screens } from "../utils/constants";
import WebView from "react-native-webview";
import VideoViewer from "../screens/home/VideoViewer";

const LibraryModal = ({
  modal,
  setModal,
  exerciseDataModal,
  setexerciseDataModal,
  navigation,
  selectedItem,
  setselectedItem,
}) => {
  const [viewVideo, setviewVideo] = useState(false);

  useEffect(() => {
    if (selectedItem == null) {
      setModal(false);
    }
  }, [selectedItem]);

  // const OptionComponent = ({ item }) => {
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         setviewVideo(true);
  //       }}
  //       style={{
  //         borderRadius: 10,
  //         alignSelf: "flex-start",
  //         marginHorizontal: 3,
  //         marginTop: 20,
  //       }}
  //     >
  //       <View
  //         style={{
  //           height: 200,
  //           width: 180,
  //           alignItems: "center",
  //           justifyContent: "center",
  //           borderColor: "black",
  //         }}
  //       >
  //         <Image
  //           style={{
  //             height: 200,
  //             width: 180,
  //             alignSelf: "center",
  //             borderRadius: 10,
  //           }}
  //           source={{
  //             uri: "https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=3098&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //           }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           alignSelf: "center",
  //           bottom: 0,
  //           width: 180,
  //           alignItems: "center",
  //           padding: 8,
  //           opacity: 0.7,
  //         }}
  //       >
  //         <Text style={{ textAlign: "center", fontWeight: "bold" }}>
  //           {item?.name}
  //         </Text>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  // const ViewWorkoutOptions = ({}) => {
  //   return (
  //     <View style={{ height: "100%", backgroundColor: "white" }}>
  //       <TouchableOpacity
  //         onPress={() => {
  //           setexerciseDataModal(null);
  //           setModal(false);
  //         }}
  //         style={{ marginLeft: 10 }}
  //       >
  //         <Ionicons name="close-outline" size={30} />
  //       </TouchableOpacity>

  //       <View style={{ marginTop: 10 }}>
  //         <Image
  //           source={images.fcTextLogo}
  //           style={{ height: 13, width: 200, alignSelf: "center" }}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           marginTop: 20,
  //           alignSelf: "center",
  //         }}
  //       >
  //         <FlatList
  //           data={exerciseDataModal?.exercises}
  //           renderItem={({ item }) => <OptionComponent item={item} />}
  //           keyExtractor={(item) => item.id}
  //           numColumns={2}
  //         />
  //       </View>
  //     </View>
  //   );
  // };

  const ViewVideo = () => {
    return (
      <View style={{ height: "100%" }}>
        <TouchableOpacity
          onPress={() => {
            setviewVideo(setselectedItem(null));
          }}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="close-outline" color={"black"} size={30} />
        </TouchableOpacity>
        <WebView
          style={{}}
          containerStyle={{}}
          scrollEnabled={false}
          source={{
            uri: selectedItem?.videoURL,
          }}
        />
      </View>
    );
  };
  return (
    <Modal style={{ margin: 0 }} isVisible={modal}>
      <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
        {<ViewVideo />}
      </SafeAreaView>
    </Modal>
  );
};

export default LibraryModal;

const styles = StyleSheet.create({});
