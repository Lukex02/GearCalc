import { StyleSheet, Platform } from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export const shadows = {
  default: Platform.select({
    ios: {
      shadowColor: "#000",
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
    android: {
      elevation: 5,
    },
    web: {
      shadowColor: "#000",
      shadowOffset: { width: 5, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 10,
    },
  }),
};

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9FD8E6",
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(20),
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerCentered: {
    flex: 1,
    backgroundColor: "#9FD8E6",
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(20),
    justifyContent: "center",
    gap: scale(40),
    alignItems: "center",
  },
  indexBackground: {
    width: scale(300),
    height: verticalScale(300),
    alignSelf: "center",
  },
  overlay: {
    textAlign: "center",
    fontSize: scale(30),
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: "monospace",
  },

  // ! Option button
  mainBtn: {
    backgroundColor: "#9CF2D4",
    paddingVertical: scale(10),
    paddingHorizontal: scale(10),
    borderRadius: 10,
    width: scale(170),
    alignSelf: "center",
    ...shadows.default,
  },
  mainBtnTxt: {
    color: "#000",
    fontWeight: "bold",
    fontSize: scale(16),
    textAlign: "center",
  },
  mainBtnMedium: {
    backgroundColor: "#9CF2D4",
    paddingVertical: scale(10),
    borderRadius: 10,
    width: scale(120),
    alignSelf: "center",
    ...shadows.default,
  },
  mainBtnMediumTxt: {
    color: "#000",
    fontWeight: "bold",
    fontSize: scale(14),
    textAlign: "center",
  },
  optionCard: {
    backgroundColor: "#fff",
    padding: scale(20),
    borderRadius: 10,
    alignItems: "center",
    ...shadows.default,
    height: scale(250),
    width: scale(250),
    marginTop: "auto",
    marginBottom: "auto",
    justifyContent: "space-around", // Căn đều khoảng cách giữa các phần tử
  },
  optionCardImg: {
    width: scale(120),
    height: verticalScale(120),
  },
  header: {
    backgroundColor: "#9FD8E6",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(10),
  },
  navTitle: {
    textAlign: "center",
    fontSize: scale(24),
    fontWeight: "bold",
    color: "#black",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: "monospace",
  },

  // ! Grid
  gridContainer: {
    flex: 1,
    marginVertical: verticalScale(5),
  },
  gridItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    ...shadows.default,
    width: "90%",
    marginBottom: 20,
  },
  gridImage: {
    width: scale(80),
    height: scale(80),
    marginRight: scale(30),
  },
  gridTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: scale(14),
    fontWeight: "bold",
    color: "#black",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: scale(12),
  },

  // ! Menu
  menu: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "50%",
  },
  menuContent: {
    backgroundColor: "white",
  },
  menuItem: {
    color: "black",
    fontWeight: "bold",
    fontSize: scale(14),
    textAlign: "left",
  },

  // ! Component
  componentTitle: {
    fontSize: scale(32),
    fontWeight: "bold",
    color: "#000",
    textTransform: "uppercase",
    letterSpacing: 2,
    textAlign: "center",
  },
  componentImg: {
    width: scale(200),
    height: scale(200),
    marginBottom: scale(10),
  },
  componentInfoContainer: {
    alignSelf: "flex-start",
    padding: scale(20),
  },
  componentInfo: {
    fontSize: scale(16),
    color: "#000",
    marginBottom: scale(10),
  },
  componentInfoName: {
    fontWeight: "bold",
  },

  // ! Dropdown
  dropdown: {
    flex: 1,
    marginVertical: verticalScale(5),
    width: scale(300),
    alignSelf: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    ...shadows.default,
  },
  dropdownContainer: {
    width: scale(300),
    alignSelf: "center",
  },

  // Design image preview
  designImgPreview: {
    width: scale(300),
    height: verticalScale(300),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },

  // Design Page Style
  designTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#black",
    textTransform: "uppercase",
    textAlign: "center",
  },
  inputContainer: {
    maxHeight: verticalScale(450),
    // marginVertical: scale(20),
    width: scale(300),
    backgroundColor: "white",
    padding: scale(20),
    borderRadius: 10,
    ...shadows.default,
  },
  inputFieldLabel: {
    fontSize: scale(14),
    fontStyle: "italic",
    color: "#000",
  },
  inputField: {
    marginTop: scale(5),
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: scale(5),
    paddingHorizontal: scale(10),
    paddingVertical: scale(4),
    fontSize: scale(14),
    color: "#000",
  },

  // Adjustment Page Style
  resultContainer: {
    width: scale(300),
    backgroundColor: "white",
    padding: scale(20),
    borderRadius: 10,
    ...shadows.default,
  },
  resultText: {
    fontSize: scale(16),
    color: "#000",
  },
  adjContainer: {
    maxHeight: verticalScale(300),
    flexDirection: "row",
    justifyContent: "space-around",
    width: scale(300),
    backgroundColor: "white",
    // padding: scale(10),
    borderRadius: 10,
    ...shadows.default,
  },
  tableContainer: {
    padding: scale(10),
    width: scale(150),
    // marginTop: scale(50),
  },
  tableTitle: {
    fontSize: scale(16),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: verticalScale(5),
  },
  parameterRow: {
    marginBottom: scale(5),
    // marginHorizontal: scale(10),
  },
  paramType: {
    fontSize: scale(14),
    fontStyle: "italic",
  },
  slider: {
    width: "90%",
    height: verticalScale(20),
    margin: "auto",
  },

  // Select Engine Page Style
  engineContainer: {
    flex: 1,
    maxHeight: verticalScale(300),
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    padding: scale(10),
    borderRadius: 10,
    ...shadows.default,
  },
  engineItem: {
    marginBottom: scale(10),
    padding: scale(5),
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  engineImage: {
    width: scale(60),
    height: verticalScale(60),
    marginRight: scale(10),
    borderRadius: 8,
  },
  engineName: {
    fontSize: scale(16),
    fontWeight: "bold",
    color: "#000",
    marginBottom: verticalScale(10),
  },
  engineDetails: {
    fontSize: scale(12),
    color: "#555",
  },
  noDataWarn: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: scale(24),
  },
});
