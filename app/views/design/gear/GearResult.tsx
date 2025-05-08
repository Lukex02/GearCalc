import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CalcFooter from "@views/common/CalcFooter";
import styles, { shadows } from "@style/MainStyle";
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import { scale, verticalScale } from "react-native-size-matters";
import LoadingScreen from "@views/common/LoadingScreen";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";

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
    calcController.getGearSet().forEach((gearSet, index) => {
      // console.log(gearSet);
      if (index == 0) {
        setGearSetFast(gearSet.returnPostStats());
      } else if (index == 1) {
        setGearSetSlow(gearSet.returnPostStats());
      }
    });
  }, []);

  useEffect(() => {
    if (gearSetFast && gearSetSlow) {
      setH2((gearSetFast.da2 - gearSetFast.df2) / 2);
      setda4Over3(gearSetSlow.da2 / 3);
      setH({ min: gearSetFast.da2 / 2 - 10 - 15, max: gearSetFast.da2 / 2 - 10 - 10 });
      setLubricationSatisfied(h2 < 10 && H.min >= da4Over3 && H.max >= da4Over3);
      setIsValid(true);
    }
  }, [gearSetSlow, gearSetFast]);

  return (
    <View style={styles.container}>
      <Header title="Kết quả tính toán" rightIcon={<SaveComponent />} />

      {/* Bảng hiển thị thông số */}
      {isValid ? (
        <View style={localStyles.table}>
          <View
            style={{ ...localStyles.row, backgroundColor: "rgba(34, 34, 34, 0.38)", borderBottomWidth: 1 }}
          >
            <Text style={{ ...localStyles.cell, color: Colors.primary }}>Thông số</Text>
            <Text style={{ ...localStyles.cell, color: Colors.primary }}>Giá trị (mm)</Text>
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
      ) : (
        <LoadingScreen />
      )}
      {/* Thông báo điều kiện bôi trơn */}
      {isValid && (
        <View style={localStyles.lubricationContainer}>
          {lubricationSatisfied ? (
            <Text style={localStyles.lubricationSatisfied}>
              Bộ truyền thỏa mãn điều kiện bôi trơn {H.min.toFixed(2)} ÷ {H.max.toFixed(2)} {">"}{" "}
              {da4Over3.toFixed(2)}
            </Text>
          ) : (
            <Text style={localStyles.lubricationNotSatisfied}>
              Bộ truyền không thỏa mãn điều kiện bôi trơn
            </Text>
          )}
        </View>
      )}

      <CalcFooter onValidate={handleValidation} finish={true} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  table: {
    maxHeight: verticalScale(380),
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: Colors.card,
    ...shadows.default,
  },
  row: {
    flexDirection: "row",
    paddingVertical: Math.round(scale(5)),
  },
  cell: {
    marginVertical: "auto",
    flex: 1,
    padding: Math.round(scale(10)),
    textAlign: "center",
    fontWeight: "bold",
    fontSize: Math.round(scale(16)),
    color: Colors.text.primary,
  },
  lubricationContainer: {
    alignItems: "center",
  },
  lubricationSatisfied: {
    color: Colors.text.success,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: Math.round(scale(20)),
  },
  lubricationNotSatisfied: {
    color: Colors.text.error,
    fontWeight: "bold",
    fontSize: Math.round(scale(20)),
  },
});
