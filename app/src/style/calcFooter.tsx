import { StyleSheet } from "react-native";

export default StyleSheet.create({
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 400,
    bottom: 40,
    position: "absolute",
  },
  button: {
    backgroundColor: "#86EFAC",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    width: "40%",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    width: "40%",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});
