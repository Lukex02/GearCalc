import { StyleSheet, Dimensions } from "react-native";
import { scale } from "react-native-size-matters";
import { shadows } from "./MainStyle";
import { Colors } from "./Colors";

export default StyleSheet.create({
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  continueBtn: {
    backgroundColor: Colors.text.success,
    borderRadius: 10,
    width: Math.round(scale(100)),
    ...shadows.default,
  },
  continueBtnText: {
    color: Colors.text.secondary,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Math.round(scale(16)),
  },
  cancelBtn: {
    backgroundColor: Colors.text.error,
    borderRadius: 10,
    width: Math.round(scale(100)),
    ...shadows.default,
  },
  cancelBtnText: {
    color: Colors.text.secondary,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Math.round(scale(16)),
  },
});
