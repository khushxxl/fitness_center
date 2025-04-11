import { StyleSheet } from "react-native";

export const customAppStyles = StyleSheet.create({
  custInputViewStyle: {
    borderColor: "#D0D5DD",
    borderWidth: 2.7,
    padding: 10,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerTitle2: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subheading2: {
    fontSize: 16,
    fontWeight: "500",
  },
  blueGlassmorphism: {
    backgroundColor: "rgba(39, 51, 89, 0.4)",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    borderColor: "rgba(0, 0, 0, 0.3)",
  },
  whiteGlassmorphism: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    shadowColor: "white",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  horizontalLine: {
    height: 1,
    width: "100%",
    backgroundColor: "lightgray",
    marginTop: 20,
  },
});
