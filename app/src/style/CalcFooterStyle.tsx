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
    backgroundColor: "#86EFAC",
    paddingVertical: Math.round(scale(10)),
    borderRadius: 10,
    width: Math.round(scale(100)),
    ...shadows.default,
  },
  continueBtnText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Math.round(scale(16)),
  },
  cancelBtn: {
    backgroundColor: "#FF6347",
    paddingVertical: Math.round(scale(10)),
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
