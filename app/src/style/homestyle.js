import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9FD8E6",
    padding: 20,
  },
  optionContainer: {
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
