import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { shadows } from "./MainStyle";

export default StyleSheet.create({
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  continueBtn: {
    backgroundColor: "#008000",
    borderRadius: 10,
    width: Math.round(scale(100)),
    ...shadows.default,
  },
  continueBtnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Math.round(scale(16)),
  },
  cancelBtn: {
    backgroundColor: "#C1121F",
    borderRadius: 10,
    width: Math.round(scale(100)),
    ...shadows.default,
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Math.round(scale(16)),
  },
});
