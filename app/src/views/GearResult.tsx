import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CalcFooter from "./CalcFooter";
import styles from "../style/MainStyle";
import CalcController from "../controller/CalcController";
import { scale, verticalScale } from "react-native-size-matters";
import LoadingScreen from "./LoadingScreen";

export default function GearResult() {
  const [gearSetFast, setGearSetFast] = useState<any>(null);
  const [gearSetSlow, setGearSetSlow] = useState<any>(null);

  const [da4Over3, setda4Over3] = useState<number>(0); // Đường kính đỉnh bánh răng 4
  const [h2, setH2] = useState<number>(0); // Chiều cao bánh răng lớn cấp nhanh
  const [H, setH] = useState<{ min: number; max: number }>({ min: 0, max: 0 }); // Mức dầu
  const [lubricationSatisfied, setLubricationSatisfied] = useState(false); // Điều kiện bôi trơn
  const [isValid, setIsValid] = useState(false);

  const handleValidation = () => {
    return lubricationSatisfied;
  };

  useEffect(() => {
    // Kiểm tra điều kiện bôi trơn
    const calcController = CalcController.getInstance();
    calcController.getCalcGearSet().forEach((gearSet, index) => {
      if (index == 0) {
        setGearSetFast(gearSet.returnPostStats());
      } else if (index == 1) {
        setGearSetSlow(gearSet.returnPostStats());
      }
    });
  }, []);

  useEffect(() => {
    if (gearSetFast && gearSetSlow) {
      setH2((gearSetFast.da2 - gearSetSlow.df2) / 2);
      setda4Over3(gearSetSlow.da2 / 3);
      setH({ min: gearSetFast.da2 / 2 - 10 - 15, max: gearSetFast.da2 / 2 - 10 - 10 });
      setLubricationSatisfied(h2 < 10 && H.min >= da4Over3 && H.max >= da4Over3);
      setIsValid(true);
    }
  }, [gearSetSlow, gearSetFast]);

  return isValid ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Kết quả tính toán</Text>
      </View>

      {/* Bảng hiển thị thông số */}
      <View style={localStyles.table}>
        <View
          style={{ ...localStyles.row, backgroundColor: "rgba(202, 202, 202, 0.38)", borderBottomWidth: 1 }}
        >
          <Text style={localStyles.cell}>Thông số</Text>
          <Text style={localStyles.cell}>Giá trị (mm)</Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>Chiều cao răng của bánh răng lớn cấp nhanh</Text>
          <Text style={localStyles.cell}>{h2.toFixed(2)}</Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>Mức dầu thấp nhất và mức dầu cao nhất</Text>
          <Text style={localStyles.cell}>
            {H.min.toFixed(2)} ÷ {H.max.toFixed(2)}
          </Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>1/3 bán kính bánh lớn phần cấp chậm</Text>
          <Text style={localStyles.cell}>{da4Over3.toFixed(2)}</Text>
        </View>
      </View>

      {/* Thông báo điều kiện bôi trơn */}
      <View style={localStyles.lubricationContainer}>
        {lubricationSatisfied ? (
          <Text style={localStyles.lubricationSatisfied}>
            Bộ truyền thỏa mãn điều kiện bôi trơn {H.min.toFixed(2)} ÷ {H.max.toFixed(2)} {">"}{" "}
            {da4Over3.toFixed(2)}
          </Text>
        ) : (
          <Text style={localStyles.lubricationNotSatisfied}>Bộ truyền không thỏa mãn điều kiện bôi trơn</Text>
        )}
      </View>

      <CalcFooter onValidate={handleValidation} nextPage={"/"} />
    </View>
  ) : (
    <LoadingScreen />
  );
}

const localStyles = StyleSheet.create({
  table: {
    maxHeight: verticalScale(380),
    width: "100%",
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    paddingVertical: scale(5),
  },
  cell: {
    marginVertical: "auto",
    flex: 1,
    padding: scale(10),
    textAlign: "center",
    fontWeight: "bold",
    fontSize: scale(16),
  },
  lubricationContainer: {
    alignItems: "center",
  },
  lubricationSatisfied: {
    color: "green",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: scale(20),
  },
  lubricationNotSatisfied: {
    color: "red",
    fontWeight: "bold",
    fontSize: scale(20),
  },
});
