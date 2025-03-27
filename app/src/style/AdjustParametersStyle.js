import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9FD8E6", 
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  header: {
    marginTop: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 20,
    marginVertical: 10,
    color: "#000",
  },
  infoContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 18,
    color: "#000",
  },
  parameterAdjustment: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    marginBottom: 20,
  },
  parameterTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  parameterRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  paramType: {
    fontSize: 18,
    marginRight: 10,
  },
  inputField: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000",
    width: "50%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#55DD7E",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF7F7F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});
