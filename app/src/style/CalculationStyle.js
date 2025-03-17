import { StyleSheet } from "react-native";

const calculationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8d7da",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contentContainer: {
    flexGrow: 1, 
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20, 
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    alignSelf: "stretch",
    width: "95%",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  resultText: {
    fontSize: 18,
    color: "#000", 
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default calculationStyles;
