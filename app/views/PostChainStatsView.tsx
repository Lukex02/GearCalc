import { useEffect, useState } from "react";
import { View, Text, Alert, FlatList } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import CalcController from "@controller/CalcController";
import CalcFooter from "./CalcFooter";
import styles from "@style/MainStyle";
import CalculatedChain from "@models/Chain";

const label = {
  z1: "Số bánh răng dẫn",
  z2: "Số bánh răng bị dẫn",
  p: "Bước xích (mm)",
  B: "Chiều dài ống lót (mm)",
  d_c: "Đường kính chốt (mm)",
  x: "Số mắt xích",
  a: "Khoảng cách trục (mm)",
  d1: "Đường kính vòng chia đĩa xích dẫn (mm)",
  d2: "Đường kính vòng chia đĩa bị dẫn (mm)",
  F_rx: "Lực tác dụng lên đĩa xích (N)",
};

export default function PostChainStatsView() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const [isValid, setIsValid] = useState(false);
  const calcController = CalcController.getInstance();
  const calcChain: CalculatedChain = calcController.getCalcMechDrive();
  const [chainStats, setChainStats] = useState({});

  useEffect(() => {
    if (calcChain) {
      setChainStats(calcChain.getChainPostStats());
      setIsValid(true);
    } else {
      alert("Thiết kế xích không phù hợp, hãy chọn thiết kế xích khác");
      router.back();
    }
  }, []);

  if (isValid) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Thông số bộ truyền xích</Text>
        </View>
        <View style={styles.specContainerRow}>
          {/* Header */}
          <View style={styles.specHeaderRow}>
            <Text style={styles.specHeaderCell}>Thông số</Text>
            <Text style={styles.specHeaderCell}>Giá trị</Text>
          </View>
          <FlatList
            data={Object.keys(chainStats)}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <View key={item} style={styles.specRow}>
                <Text style={styles.specCellRow}>{label[item as keyof typeof label]}</Text>
                <Text style={styles.specCellRow}>{chainStats[item as keyof typeof chainStats]}</Text>
              </View>
            )}
          />
        </View>

        {/* Truyền địa chỉ trang xích tiếp theo ở đây */}
        <CalcFooter nextPage="/src/views/GearFast" />
      </View>
    );
  }
}
