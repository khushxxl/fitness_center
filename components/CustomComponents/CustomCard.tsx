import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const CustomCard = ({
  title,
  description,
  onPress,
  subtitle,
  navigationText,
}: {
  title: string;
  description?: string;
  subtitle?: string;
  navigationText?: string;
  onPress: () => void;
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && (
          <Text style={[styles.title, { marginTop: 3 }]}>{subtitle}</Text>
        )}
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <TouchableOpacity onPress={onPress} style={{ marginTop: 25 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            textDecorationLine: "underline",
          }}
        >
          {navigationText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CustomCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
  },
  cardContent: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
});
