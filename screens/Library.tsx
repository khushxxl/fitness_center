import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import LibraryModal from "../components/LibraryModal";
import { exercises, images, libraryOptions, screens } from "../utils/constants";
import SearchExercise from "../components/SearchExercise";
import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AppContext } from "../context/AppContext";

const Library = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);

  const { settingOptions, setsettingOptions } = useContext(AppContext);

  const [libraryModal, setlibraryModal] = useState(false);
  const [exerciseDataModal, setexerciseDataModal] = useState(null);

  useEffect(() => {
    if (exerciseDataModal) {
      setlibraryModal(true);
    }
  }, [exerciseDataModal]);

  // const [settingOptions, setsettingOptions] = useState([]);

  const getSettings = async () => {
    const settings: any = [];
    const querySnapshot = await getDocs(collection(db, "settings"));
    querySnapshot.forEach((doc) => {
      settings.push(doc.data());
      console.log(doc.id, " => ", doc.data());
    });
    setsettingOptions(settings);
  };

  useEffect(() => {
    getSettings();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(async () => {
      await getSettings();
      setRefreshing(false);
    }, 2000);
  }, []);

  const OptionComponent = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(screens.WorkoutLibrary, { data: item })
        }
        style={{
          borderRadius: 10,
          alignSelf: "flex-start",
          marginHorizontal: 3,
          marginTop: 20,
        }}
      >
        <View
          style={{
            height: 200,
            width: 180,
            alignItems: "flex-start",
            justifyContent: "center",
            // borderWidth: 0.9,
            // borderColor: "black",
            borderRadius: 10,
          }}
        >
          <Image
            style={{
              height: 200,
              width: 180,
              alignSelf: "center",
              borderRadius: 10,
            }}
            source={{
              uri: item?.sectionThumbnail,
            }}
          />
        </View>
        <View
          style={{
            alignSelf: "center",
            width: 180,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            alignItems: "center",
            padding: 8,
            opacity: 0.7,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "bold" }}>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white", flex: 1 }}>
      <View style={{ marginTop: 10 }}>
        <Image
          source={images.fc_header_img}
          style={{ height: 20, width: 170, alignSelf: "center" }}
        />
      </View>

      <View
        style={{
          marginTop: 10,
          alignSelf: "center",
        }}
      >
        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          // onRefresh={getSettings}
          data={settingOptions}
          renderItem={({ item }) => <OptionComponent item={item} />}
          keyExtractor={(item) => item?.id}
          numColumns={2}
        />
      </View>
      {/* <View style={{ height: 200 }} /> */}
    </SafeAreaView>
  );
};

export default Library;

const styles = StyleSheet.create({});
