import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E48C8C",
  },
  header: {
    backgroundColor: "#E48C8C",
    elevation: 0,
    marginBottom: 20,
  },
  title: {
    color: "black",
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  gridContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  gridItem: {
    width: "48%",
    height: "30%",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    margin: "1%",
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 15,
  },
  menuContent: {
    backgroundColor: "white",
  },
  menuItem: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
  },

  gridImage: {
    width: "100%",
    height: "100%",
  },
});
