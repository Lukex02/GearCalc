import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import CalcFooter from "@views/common/CalcFooter";
import CalcController from "@controller/CalcController";
import { selectRollerBearingLabel as label } from "@/views/common/Label";
import { SelectedRollerBearing } from "@models/RollerBearing";

export default function PostBearingStatsView() {
  const router = useRouter();
  const [bearing, setBearing] = useState<SelectedRollerBearing | null>(null);

  useEffect(() => {
    const selected = CalcController.getInstance().getCalcMechDrive().selectedRollerBearing;
    if (!selected) {
      Alert.alert("Lỗi", "Không tìm thấy ổ lăn đã chọn.");
      router.back();
    } else {
      setBearing(selected);
    }
  }, []);

  if (!bearing) return null;

  const infoList = [
    { key: "Ký hiệu", value: bearing.symbol },
    { key: "Loại", value: bearing.type },
    { key: "Mô tả", value: bearing.description },
    { key: "d (mm)", value: bearing.d },
    { key: "D (mm)", value: bearing.D },
    { key: "B (mm)", value: bearing.B },
    { key: "C (N)", value: bearing.C },
    { key: "Co (N)", value: bearing.C_O },
    { key: "b", value: bearing.b },
    { key: "r1", value: bearing.r1 },
  ];

  return (
    <View style={styles.container}>
      <Header title="Thông số ổ lăn đã chọn" rightIcon={<SaveComponent />} />
      <View style={styles.specContainerRow}>
        <View style={styles.specHeaderRow}>
          <Text style={styles.specHeaderCell}>Thông số</Text>
          <Text style={styles.specHeaderCell}>Giá trị</Text>
        </View>
        <FlatList
          data={infoList}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <View style={styles.specRow}>
              <Text style={styles.specCellRow}>{item.key}</Text>
              <Text style={styles.specCellRow}>{item.value}</Text>
            </View>
          )}
        />
      </View>
      <CalcFooter nextPage="/views/design/gear/GearFast" />
    </View>
  );
}
