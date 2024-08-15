import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const CustomInput = ({
  autofocus = false,
  label,
  placeholder,
  value,
  onChangeText,
  multiLine = false,
  type = "default",
  editable = true,
  isPassword = false,
  mt = 30,
  styles = {},
}) => {
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={[styles, { marginTop: mt }]}>
      <Text style={{ marginLeft: 12, marginBottom: 10, fontSize: 15 }}>
        {label}
      </Text>
      <View
        style={{
          borderColor: "#D0D5DD",
          borderWidth: 2.7,
          padding: 10,
          borderRadius: 10,
          height: multiLine ? 100 : 50,
          justifyContent: "center",
          marginHorizontal: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={"#667085"}
          style={{ flex: 1 }}
          onChangeText={onChangeText}
          value={value}
          multiline={multiLine}
          keyboardType={type}
          autoFocus={autofocus}
          editable={editable}
          secureTextEntry={isPassword && !showPass}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"}
              size={20}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({});
