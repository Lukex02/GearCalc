import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CalcFooter from "./CalcFooter";
import styles from "../style/MainStyle";

export default function GearResult() {
  // Các thông số giả lập (mock data)
  const [da2, setDa2] = useState(100); // Đường kính đỉnh bánh răng 2
  const [df2, setDf2] = useState(90); // Đường kính chân răng bánh răng 2
  const [da4, setDa4] = useState(150); // Đường kính đỉnh bánh răng 4
  const [h2, setH2] = useState(10); // Chiều cao dầu bôi trơn
  const [H, setH] = useState({ min: 8, max: 12 }); // Điều kiện bôi trơn
  const [lubricationSatisfied, setLubricationSatisfied] = useState(false); // Điều kiện bôi trơn

  useEffect(() => {
    // Kiểm tra điều kiện bôi trơn
    const da4Over3 = da4 / 3;
    setLubricationSatisfied(h2 >= H.min && h2 <= H.max && da4Over3 > 0);
  }, [da2, df2, da4, h2, H]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Kết quả tính toán</Text>
      </View>

      {/* Bảng hiển thị thông số */}
      <View style={localStyles.table}>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>Thông số</Text>
          <Text style={localStyles.cell}>Giá trị</Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>da2</Text>
          <Text style={localStyles.cell}>{da2.toFixed(2)}</Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>df2</Text>
          <Text style={localStyles.cell}>{df2.toFixed(2)}</Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>da4</Text>
          <Text style={localStyles.cell}>{da4.toFixed(2)}</Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>h2</Text>
          <Text style={localStyles.cell}>{h2.toFixed(2)}</Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>H (min - max)</Text>
          <Text style={localStyles.cell}>
            {H.min.toFixed(2)} - {H.max.toFixed(2)}
          </Text>
        </View>
        <View style={localStyles.row}>
          <Text style={localStyles.cell}>da4/3</Text>
          <Text style={localStyles.cell}>{(da4 / 3).toFixed(2)}</Text>
        </View>
      </View>

      {/* Thông báo điều kiện bôi trơn */}
      <View style={localStyles.lubricationContainer}>
        {lubricationSatisfied ? (
          <Text style={localStyles.lubricationSatisfied}>Bộ truyền thỏa mãn điều kiện bôi trơn</Text>
        ) : (
          <Text style={localStyles.lubricationNotSatisfied}>Bộ truyền không thỏa mãn điều kiện bôi trơn</Text>
        )}
      </View>

      <CalcFooter nextPage={"./src/views/SelectEngineScreen"} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  table: {
    marginTop: 20,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
    padding: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  lubricationContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  lubricationSatisfied: {
    color: "green",
    fontWeight: "bold",
    fontSize: 20,
  },
  lubricationNotSatisfied: {
    color: "red",
    fontWeight: "bold",
    fontSize: 20,
  },
});
