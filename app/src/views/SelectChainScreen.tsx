import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import styles from "../style/MainStyle"; // Sử dụng style đã tạo
// import calcFooter from "../style/calcFooter";
import CalcController from "../controller/CalcController";
import EngineController from "../controller/EngineController";
import { SelectedEngine } from "../models/EngineModel";
import CalcFooter from "./CalcFooter";
import LoadingScreen from "./LoadingScreen";

export default function SelectEngineScreen() {
  const router = useRouter(); // Khởi tạo router để điều hướng
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
      Alert.alert("Thông báo", "Vui lòng chọn động cơ.");
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
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Kết quả tính Xích</Text>
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Công suất cần thiết:{" "}
          <Text style={{ color: "green", fontWeight: "bold" }}>
            {requiredPower.toFixed(3)}
          </Text>{" "}
          kW
        </Text>
        <Text style={styles.resultText}>
          Tốc độ quay cần thiết:{" "}
          <Text style={{ color: "green", fontWeight: "bold" }}>
            {requiredSpeed.toFixed(0)}
          </Text>{" "}
          rpm
        </Text>
      </View>
      {/* Danh sách Xích */}
      <Text style={styles.pageTitle}>Danh sách Xích thỏa mãn</Text>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.engineContainer}>
          {engineList.length == 0 && (
            <Text style={styles.noDataWarn}>
              Không có Xích thỏa mãn điều kiện!
            </Text>
          )}
          <FlatList
            // contentContainerStyle={{ flex: 1 }}
            data={engineList}
            keyExtractor={(item) => item.M_ID}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.engineItem}
                onPress={() => handleSelectEngine(item)}
              >
                <Image
                  source={require("../img/wrench.png")}
                  style={styles.engineImage}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.engineName}>{item.name}</Text>
                  <Text style={styles.engineDetails}>
                    Công suất:{" "}
                    <Text style={{ color: "green", fontWeight: "bold" }}>
                      {item.power}
                    </Text>{" "}
                    kW
                  </Text>
                  <Text style={styles.engineDetails}>
                    Tốc độ vòng quay:{" "}
                    <Text style={{ color: "green", fontWeight: "bold" }}>
                      {item.n_t}
                    </Text>{" "}
                    rpm
                  </Text>
                  <Text style={styles.engineDetails}>
                    Hệ số công suất: {item.eng_effi} %
                  </Text>
                  <Text style={styles.engineDetails}>
                    Hiệu suất động cơ: {item.H}
                  </Text>
                  <Text style={styles.engineDetails}>
                    Hệ số momen khởi động: {item.T_k_T_dn} / T_dn
                  </Text>
                  <Text style={styles.engineDetails}>
                    Hệ số momen tối đa: {item.T_max_T_dn} / T_dn
                  </Text>
                </View>
                {selectedEngine?.M_ID === item.M_ID && (
                  <Image
                    source={require("../img/tick.jpg")}
                    style={styles.engineImage}
                    resizeMode="contain"
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <CalcFooter
        onValidate={handleValidation}
        nextPage={"/src/views/PostChainStatsView"}
      />
    </View>
  );
}
