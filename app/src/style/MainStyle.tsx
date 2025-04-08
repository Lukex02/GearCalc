import { StyleSheet, Platform, TextStyle } from "react-native";
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
      boxShadowColor: "#000",
      boxShadowOffset: { width: 5, height: 5 },
      boxShadowOpacity: 0.25,
      boxShadowRadius: 10,
      // shadowColor: "#000",
      // shadowOffset: { width: 5, height: 5 },
      // shadowOpacity: 0.25,
      // shadowRadius: 10,
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
    textShadow: {
      color: "black",
      offset: { width: 1, height: 1 },
      radius: 4,
    },
    fontFamily: "monospace",
  } as TextStyle,

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

  profileImg: {
    width: scale(100),
    height: scale(100),
    margin: scale(10),
    borderRadius: 8,
    ...shadows.default,
  },
  historyContainer: {
    height: verticalScale(300),
    width: scale(300),
    justifyContent: "space-around",
    backgroundColor: "white",
    padding: scale(10),
    borderRadius: 10,
    ...shadows.default,
  },
  historyHeader: {
    flexDirection: "row",
    paddingBottom: scale(10),
    borderBottomWidth: 2,
  },
  historyHeaderCell: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  historyRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  historyCell: {
    flex: 1,
    margin: "auto",
    textAlign: "center",
    padding: scale(10),
  },
  historySpecBtn: {
    flex: 1,
    backgroundColor: "rgb(0, 140, 255)",
    borderRadius: 6,
    margin: "auto",
    marginHorizontal: scale(5),
    padding: scale(5),
    alignItems: "center",
    width: "100%",
    ...shadows.default,
  },
  historyPrintBtn: {
    flex: 1,
    backgroundColor: "rgb(0, 255, 98)",
    borderRadius: 6,
    margin: "auto",
    padding: scale(5),
    marginHorizontal: scale(5),
    alignItems: "center",
    width: "100%",
    ...shadows.default,
  },

  // Option styles
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
    textShadow: {
      color: "black",
      offset: { width: 1, height: 1 },
      radius: 4,
    },
    fontFamily: "monospace",
  } as TextStyle,

  // ! Grid
  gridContainer: {
    flex: 1,
    marginVertical: verticalScale(5),
  },
  gridItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: scale(20),
    borderRadius: 8,
    ...shadows.default,
    width: "90%",
    marginBottom: verticalScale(20),
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
    width: "100%",
    alignSelf: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 10,
    ...shadows.default,
  },
  dropdownContainer: {
    width: "100%",
    alignSelf: "center",
  },

  // Design image preview
  designImgPreview: {
    width: "100%",
    height: verticalScale(300),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
  },

  // Design Page Style
  pageTitle: {
    fontSize: scale(20),
    fontWeight: "bold",
    color: "#black",
    textTransform: "uppercase",
    textAlign: "center",
  },
  inputContainer: {
    maxHeight: verticalScale(450),
    // marginVertical: scale(20),
    width: "100%",
    backgroundColor: "white",
    padding: scale(20),
    borderRadius: 10,
    ...shadows.default,
  },
  inputFieldLabel: {
    fontSize: scale(14),
    fontStyle: "italic",
    color: "#000",
    marginBottom: scale(5),
  },
  inputField: {
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
    width: "100%",
    backgroundColor: "white",
    padding: scale(20),
    borderRadius: 10,
    ...shadows.default,
  },
  resultText: {
    fontSize: scale(16),
    color: "#000",
  },
  colContainer: {
    maxHeight: verticalScale(300),
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: scale(10),
    backgroundColor: "white",
    borderRadius: 10,
    ...shadows.default,
  },
  tableContainer: {
    flex: 1,
  },
  tableContainerPad10: {
    flex: 1,
    padding: scale(10),
    justifyContent: "space-around",
  },
  tableTitle: {
    fontSize: scale(16),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: verticalScale(5),
  },
  parameterRow: {
    marginBottom: scale(5),
    marginHorizontal: scale(15),
  },
  paramType: {
    fontSize: scale(14),
    fontStyle: "italic",
  },
  slider: {
    width: "80%",
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
  specContainer: {
    height: verticalScale(400),
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: scale(10),
    borderRadius: 10,
    flexDirection: "row",
    ...shadows.default,
  },
  specHeader: {
    flex: 1,
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-around",
    alignSelf: "center",
    borderRightWidth: 2,
  },
  specHeaderCell: {
    flex: 1,
    flexWrap: "wrap",
    paddingHorizontal: scale(5),
    alignContent: "center",
    textAlign: "center",
    fontWeight: "bold",
  },
  specCol: {
    flex: 1,
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    borderRightWidth: 1,
    borderBottomColor: "black",
  },
  specCell: {
    flex: 1,
    flexWrap: "wrap",
    paddingHorizontal: scale(5),
    alignContent: "center",
    textAlign: "center",
    borderTopWidth: 1,
  },
});
