import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9FD8E6",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
    textAlign: "center",
  },
  dropdown: {
    flex: 1,
    width: 400,
    alignSelf: "center",
    justifyContent: "flex-start",
    marginBottom: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#86EFAC",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
    width: "45%",
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
    width: "45%",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 400,
    bottom: 40,
    position: "absolute",
  },
  imgPreview: {
    width: 400,
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
});

export default styles;
