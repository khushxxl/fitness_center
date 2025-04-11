import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { WebView } from "react-native-webview";
import Ionicons from "@expo/vector-icons/Ionicons";
import Modal from "react-native-modal";
const VideoViewer = ({ navigation, url, setModal, modal }) => {
  return (
    <Modal isVisible={modal} style={{ margin: 0 }}>
      <SafeAreaView
        style={{ flex: 1, width: "100%", backgroundColor: "black" }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ marginLeft: 10 }}
        >
          <Ionicons name="close-outline" size={30} />
        </TouchableOpacity>
        <WebView
          allowsFullscreenVideo={true}
          style={{}}
          containerStyle={{}}
          scrollEnabled={false}
          // source={{ uri: "https://youtube.com/shorts/BlkRLAL9NKs" }}
          source={{
            uri: `https://www.youtube.com/embed/${"BlkRLAL9NKs"}?&autoplay=1&showinfo=0&controls=1&fullscreen=1`,
          }}
        />
      </SafeAreaView>
    </Modal>
  );
};

export default VideoViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
