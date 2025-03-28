import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#9FD8E6",
    paddingTop: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    position: "absolute",
    top: 230,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 40,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
    marginLeft: 44,
  },
  input: {
    width: "80%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 20,
    gap: 20,
  },
  button: {
    backgroundColor: "#86EFAC",
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "35%",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default styles;
