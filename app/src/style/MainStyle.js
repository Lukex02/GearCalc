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
    // flexDirection: "row",
    flexWrap: "wrap",
    // alignContent: "center",
    // justifyContent: "center",
    // paddingHorizontal: 10,
    // paddingVertical: 5,
    marginVertical: 20,
  },
  gridItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    width: "90%",
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },

  menu: {
    backgroundColor: "#fff",
    borderRadius: 15,
    position: "fixed",
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
  menuBtn: {
    // width: "fit-content",
  },

  gridImage: {
    width: 100,
    height: 100,
    // padding: 20,
    marginRight: 50,
  },
});
