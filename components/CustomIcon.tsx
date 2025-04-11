import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomIcon = ({
  name,
  onClick,
  size = 30,
  styles,
}: {
  name: any;
  onClick: any;
  size?: number;
  styles: StyleProp<ViewStyle>;
}) => {
  return (
    <TouchableOpacity style={styles} onPress={onClick}>
      <Ionicons name={name} size={size} />
    </TouchableOpacity>
  );
};

export default CustomIcon;

const styles = StyleSheet.create({});
