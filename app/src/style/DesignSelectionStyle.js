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
    width: "90%",
    alignSelf: "center",
    justifyContent: "flex-start",
    marginBottom: 60,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  imgPreview: {
    width: "90%",
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
});

export default styles;
