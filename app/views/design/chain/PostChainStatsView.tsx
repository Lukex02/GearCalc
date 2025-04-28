import { useEffect, useState } from "react";
import { View, Text, Alert, FlatList } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import styles from "@style/MainStyle";
import CalculatedChain from "@models/Chain";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import { chainLabel as label } from "@/views/common/Label";

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
        <Header title="Thông số bộ truyền xích" rightIcon={<SaveComponent />} />
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
        <CalcFooter nextPage="/views/design/gear/GearFast" />
      </View>
    );
  }
}
