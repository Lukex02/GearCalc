import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import styles from "@style/MainStyle"; // Sử dụng style đã tạo
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import EngineController from "@controller/EngineController";
import { SelectedEngine } from "@models/EngineModel";
import CalcFooter from "@views/common/CalcFooter";
import LoadingScreen from "@views/common/LoadingScreen";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";

export default function SelectEngineScreen() {
  const calcController = CalcController.getInstance();
  const requiredPower = calcController.getCalcEngine().p_ct;
  const requiredSpeed = calcController.getCalcEngine().n_sb;
  const [selectedEngine, setSelectedEngine] = useState<SelectedEngine>();
  const [engineList, setEngineList] = useState<SelectedEngine[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelectEngine = (engine: SelectedEngine) => {
    setSelectedEngine(engine); // Lưu động cơ đã chọn
  };

  const handleValidation = () => {
    if (selectedEngine) {
      calcController.chooseEngine(selectedEngine);
      return true;
    } else {
      alert("Vui lòng chọn động cơ.");
      return false;
    }
  };

  // Lọc động cơ thỏa mãn các yêu cầu
  const getEngineList = () => {
    EngineController.getSelectedEngine(
      requiredPower,
      requiredSpeed,
      calcController.getCalcEngine().T_mm
    ).then((list) => {
      setEngineList(list);
      // console.log(list);
      setLoading(false);
    });
  };
  useEffect(() => {
    getEngineList();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Chọn động cơ" rightIcon={<SaveComponent />} />
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Công suất cần thiết:{" "}
          <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>{requiredPower.toFixed(3)}</Text>{" "}
          kW
        </Text>
        <Text style={styles.resultText}>
          Tốc độ quay cần thiết:{" "}
          <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>{requiredSpeed.toFixed(0)}</Text>{" "}
          rpm
        </Text>
      </View>
      {/* Danh sách động cơ */}
      <Text style={styles.pageTitle}>Danh sách động cơ thỏa mãn</Text>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.selectContainer}>
          {engineList.length == 0 && (
            <Text style={styles.noDataWarn}>Không có động cơ thỏa mãn điều kiện!</Text>
          )}
          <FlatList
            data={engineList}
            keyExtractor={(item) => item.M_ID}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.selectItem} onPress={() => handleSelectEngine(item)}>
                <MaterialCommunityIcons name="engine" size={scale(50)} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectName}>{item.name}</Text>
                  <Text style={styles.selectDetails}>
                    Công suất:{" "}
                    <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>{item.power} kW</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Tốc độ vòng quay:{" "}
                    <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>{item.n_t} rpm</Text>{" "}
                  </Text>
                  <Text style={styles.selectDetails}>Hệ số công suất: {item.eng_effi} %</Text>
                  <Text style={styles.selectDetails}>Hiệu suất động cơ: {item.H}</Text>
                  <Text style={styles.selectDetails}>Hệ số momen khởi động: {item.T_k_T_dn} / T_dn</Text>
                  <Text style={styles.selectDetails}>Hệ số momen tối đa: {item.T_max_T_dn} / T_dn</Text>
                </View>
                {selectedEngine?.M_ID === item.M_ID && (
                  <FontAwesome5 name="check" size={24} color={Colors.text.success} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <CalcFooter onValidate={handleValidation} nextPage="/views/design/engine/PostEngineStatsView" />
    </View>
  );
}
