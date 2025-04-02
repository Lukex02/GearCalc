import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import CalcController from "../controller/CalcController";
import EngineController from "../controller/EngineController";
import CalcFooter from "./CalcFooter";
import styles from "../style/MainStyle";

export default function SelectEngineScreen() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const calcController = CalcController.getInstance();
  const postStats = calcController.getEnginePostStats();
  console.log(postStats);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Thông số động học</Text>
      </View>
      <View style={styles.specContainer}>
        {/* Header */}
        <View style={styles.specHeader}>
          <Text style={styles.specHeaderCell}>Thông số</Text>
          <Text style={styles.specHeaderCell}>Trục động cơ</Text>
          <Text style={styles.specHeaderCell}>Trục 1</Text>
          <Text style={styles.specHeaderCell}>Trục 2</Text>
          <Text style={styles.specHeaderCell}>Trục 3</Text>
          <Text style={styles.specHeaderCell}>Trục công tác</Text>
        </View>

        {/* Body */}
      </View>
      <CalcFooter nextPage={"/"} />
    </View>
  );
}
