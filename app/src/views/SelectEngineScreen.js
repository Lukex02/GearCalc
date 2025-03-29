import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import styles from "../style/SelectEngineScreenStyle"; // Sử dụng style đã tạo
import calcFooter from "../style/calcFooter";
import CalcController from "../controller/CalcController";
import EngineController from "../controller/EngineController";

export default function SelectEngineScreen() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const calcController = CalcController.getInstance();
  const requiredPower = calcController.getCalcEngine().p_ct;
  const requiredSpeed = calcController.getCalcEngine().n_sb;
  const [selectedEngine, setSelectedEngine] = useState(null);
  const [engineList, setEngineList] = useState([]);

  const handleSelectEngine = (engine) => {
    setSelectedEngine(engine); // Lưu động cơ đã chọn
  };

  const handleContinue = () => {
    if (selectedEngine) {
      calcController.chooseEngine(selectedEngine);
      router.push(`/src/views/PostEngineStatsView`);
    } else {
      Alert.alert("Vui lòng chọn động cơ.");
    }
  };

  const handleBack = () => {
    router.back(); // Quay lại trang trước
  };

  // Lọc động cơ thỏa mãn các yêu cầu
  const getEngineList = () => {
    EngineController.getSelectedEngine(requiredPower, requiredSpeed, calcController.getCalcEngine().T_mm).then((list) => {
      setEngineList(list);
      console.log(list);
    });
  };
  useEffect(() => {
    getEngineList();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chọn động cơ</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Công suất cần thiết: <Text style={{ color: "green", fontWeight: "bold" }}>{requiredPower.toFixed(3)}</Text> kW
        </Text>
        <Text style={styles.infoText}>
          Tốc độ quay cần thiết: <Text style={{ color: "green", fontWeight: "bold" }}>{requiredSpeed.toFixed(0)}</Text> rpm
        </Text>
      </View>
      {/* Danh sách động cơ */}
      <View style={styles.parameterAdjustment}>
        <Text style={styles.parameterTitle}>Danh sách động cơ thỏa mãn</Text>
        {engineList.length == 0 && <Text style={{ textAlign: "center" }}>Không có động cơ thỏa mãn điều kiện!</Text>}
        <FlatList
          contentContainerStyle={{ flex: 1 }}
          data={engineList}
          keyExtractor={(item) => item.M_ID}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.engineItem} onPress={() => handleSelectEngine(item)}>
              <Image source={require("../img/wrench.png")} style={styles.engineImage} resizeMode="contain" />
              <View style={{ flex: 1 }}>
                <Text style={styles.engineName}>Động cơ: {item.name}</Text>
                <Text style={styles.engineDetails}>Công suất: {item.power} kW</Text>
                <Text style={styles.engineDetails}>Tốc độ vòng quay: {item.n_t} rpm</Text>
                <Text style={styles.engineDetails}>Hệ số công suất: {item.eng_effi} %</Text>
                <Text style={styles.engineDetails}>Hiệu suất động cơ: {item.H}</Text>
                <Text style={styles.engineDetails}>Hệ số momen khởi động: {item.T_k_T_dn} / T_dn</Text>
                <Text style={styles.engineDetails}>Hệ số momen tối đa: {item.T_max_T_dn} / T_dn</Text>
              </View>
              {selectedEngine?.M_ID === item.M_ID && (
                <Image source={require("../img/tick.jpg")} style={styles.engineImage} resizeMode="contain" />
              )}
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={calcFooter.buttonFooter}>
        <TouchableOpacity style={calcFooter.cancelButton} onPress={handleBack}>
          <Text style={calcFooter.cancelButtonText}>Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity style={calcFooter.button} onPress={handleContinue}>
          <Text style={calcFooter.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
