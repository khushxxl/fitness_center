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
import { DATA, exercises, images } from "../../utils/constants";
import LibraryModal from "../../components/LibraryModal";
import SearchExercise from "../../components/SearchExercise";
import CustomIcon from "../../components/CustomIcon";

const WorkoutLibrary = ({ navigation, route }) => {
  const [libraryModal, setlibraryModal] = useState(false);
  const [exerciseDataModal, setexerciseDataModal] = useState(null);

  const sectionsData = route?.params?.data;
  console.log(sectionsData);

  const [selectedItem, setselectedItem] = useState();

  useEffect(() => {
    if (selectedItem) {
      setlibraryModal(true);
    }
  }, [selectedItem]);

  const OptionComponent = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => setselectedItem(item)}
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
              uri: item?.thumbnailURL,
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
            {item.sectionName?.toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "white", flex: 1 }}>
      <LibraryModal
        navigation={navigation}
        exerciseDataModal={exerciseDataModal}
        setexerciseDataModal={setexerciseDataModal}
        modal={libraryModal}
        setModal={setlibraryModal}
        selectedItem={selectedItem}
        setselectedItem={setselectedItem}
      />

      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CustomIcon
            onClick={() => navigation.goBack()}
            name={"chevron-back"}
            styles={{ marginLeft: 0 }}
          />
          <Text style={{ marginLeft: 2, color: "blue" }}>
            {sectionsData?.name}
          </Text>
        </View>
        {/* <Image
          source={images.fcTextLogo}
          style={{ height: 13, width: 200, alignSelf: "center" }}
        /> */}
      </View>
      {/* <View style={{ marginTop: 30 }}>
        <SearchExercise navigation={navigation} />
      </View> */}

      <View
        style={{
          marginTop: 10,
          alignSelf: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {sectionsData?.inSections?.length > 0 ? (
          <FlatList
            data={sectionsData?.inSections}
            renderItem={({ item }) => <OptionComponent item={item} />}
            keyExtractor={(item) => item?.name}
            numColumns={2}
          />
        ) : (
          <Text style={{}}>The Section is Empty</Text>
        )}
      </View>
      {/* <View style={{ height: 200 }} /> */}
    </SafeAreaView>
  );
};

export default WorkoutLibrary;

const styles = StyleSheet.create({});
