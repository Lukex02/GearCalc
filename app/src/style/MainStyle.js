import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9FD8E6",
  },
  header: {
    backgroundColor: "#9FD8E6",
    marginTop: 20,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    color: "#BLACK",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: "monospace",
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
    margin: 1,
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 15,
    position: "absolute",
    bottom: 10,
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
