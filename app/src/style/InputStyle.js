import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
    alignSelf: "stretch",
    width: "95%",
    borderWidth: 0, // ✅ Đảm bảo không có viền ngoài
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2, // ✅ Viền chỉ có một lớp
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
    marginBottom: 12,
    width: "100%",
  },
  buttonContainer: {
    alignSelf: "center",
    width: "90%",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#e74c3c",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default styles;
