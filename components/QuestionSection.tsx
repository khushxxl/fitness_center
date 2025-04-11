import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import CustomInput from "./CustomInput";

const QuestionSection = ({
  question,
  options,
  setter,
  value,
  textBox,
  multiLine,
  label,
  placeholder,
  keyboardType,
}: {
  question: string;
  options?: string[];
  setter: Function;
  value: any;
  textBox?: boolean;
  multiLine?: boolean;
  label?: string;
  placeholder?: string;
  keyboardType?: string;
}) => {
  const OptionComponent = ({ title }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setter(title);
        }}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          borderRadius: 10,
          padding: 15,
          marginTop: 20,
          backgroundColor: value === title ? "#0086C9" : "white",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: value === title ? "white" : "black",
            fontWeight: "bold",
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>
        {question}
      </Text>
      {options &&
        options.length > 0 &&
        options.map((option, i) => {
          return <OptionComponent key={i} title={option} />;
        })}
      {textBox && (
        <View style={{ marginTop: 20 }}>
          <CustomInput
            label={label}
            placeholder={placeholder}
            value={value}
            onChangeText={setter}
            multiLine={multiLine}
            type={keyboardType}
            autofocus={true}
          />
        </View>
      )}
    </View>
  );
};

export default QuestionSection;

const styles = StyleSheet.create({});
