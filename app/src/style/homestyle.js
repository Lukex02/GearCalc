import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#9FD8E6",
    paddingTop: 20,
  },
  header: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  goBackButton: {
    marginRight: 10,
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

  optionContainer: {
    marginTop: 30,
    width: "120%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 50,
    marginTop: 20,
    elevation: 5,
    height: 300,
    width: 300,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  button: {
    marginTop: 10,
    backgroundColor: "#9CF2D4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default styles;
