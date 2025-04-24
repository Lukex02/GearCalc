import { StyleSheet, Dimensions } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { shadows } from "./MainStyle";
import { rgbaColor } from "react-native-reanimated/lib/typescript/Colors";

export default StyleSheet.create({
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  continueBtn: {
    backgroundColor: "rgb(123, 135, 238)",
    paddingVertical: Math.round(scale(10)),
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
