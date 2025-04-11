import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const CustomButton = ({
  onClick,
  title,
  textColor,
  colors = ["#4c669f", "#3b5998", "#192f6a"],
  iconSource = null,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={styles.buttonContainer}
      onPress={onClick}
    >
      <LinearGradient
        colors={disabled ? ["#B2BEB5", "#B2BEB5"] : colors}
        style={styles.button}
      >
        {iconSource && <Image style={styles.icon} source={iconSource} />}
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    padding: 12,
    marginTop: 20,
    justifyContent: "center",
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    borderColor: "grey",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 20,
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    alignSelf: "center",
  },
});

export default CustomButton;
