import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import styles from "@style/MainStyle"; // Sử dụng style đã tạo
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import LoadingScreen from "@views/common/LoadingScreen";
import CalculatedChain, { SelectedChain } from "@models/Chain";
import ChainController from "@controller/ChainController";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";

export default function SelectChainScreen() {
  const calcController = CalcController.getInstance();
  const calcChain: CalculatedChain = calcController.getCalcMechDrive();
  const calcPower = calcChain.P_t;
  const [selectedChain, setSelectedChain] = useState<SelectedChain>();
  const [chainList, setChainList] = useState<SelectedChain[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelectChain = (chain: SelectedChain) => {
    setSelectedChain(chain);
  };

  const handleValidation = () => {
    if (selectedChain) {
      calcController.chooseMechDrive(selectedChain);
      return true;
    } else {
      alert("Vui lòng chọn thiết kế xích.");
      return false;
    }
  };

  // Lọc xích thỏa mãn yêu cầu
  const getChainList = () => {
    ChainController.getSelectableChain(calcController.getCalcMechDrive().P_t).then((chainList) => {
      setChainList(chainList);
      // console.log(chainList);
      setLoading(false);
    });
  };

  useEffect(() => {
    getChainList();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Kết quả tính Xích" rightIcon={<SaveComponent />} />
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Công suất tính toán:{" "}
          <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>{calcPower.toFixed(3)}</Text> kW
        </Text>
      </View>
      {/* Danh sách thiết kế xích */}
      <Text style={styles.pageTitle}>Danh sách thiết kế xích thỏa mãn (con lăn 1 dãy)</Text>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.selectContainer}>
          {chainList.length == 0 && (
            <Text style={styles.noDataWarn}>Không có thiết kế xích thỏa mãn điều kiện!</Text>
          )}
          <FlatList
            data={chainList}
            keyExtractor={(item) => item.CHAIN_ID}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.selectItem} onPress={() => handleSelectChain(item)}>
                <FontAwesome name="chain" size={scale(50)} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectName}>Loại {index + 1}</Text>
                  <Text style={styles.selectDetails}>
                    Bước xích:{" "}
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>{item.Step_p} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Công suất cho phép [P]:{" "}
                    <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>{item.P_max} kW</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Đường kính chốt:{" "}
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>{item.d_c} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Chiều dài ống:{" "}
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>{item.B} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Tải trọng phá hỏng:{" "}
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>{item.Q} kN</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Khối lượng 1 mét xích q:{" "}
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>{item.q_p} kg</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Diện tích chiếu bản lề:{" "}
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>{item.A} mm2</Text>
                  </Text>
                </View>
                {selectedChain?.CHAIN_ID === item.CHAIN_ID && (
                  <FontAwesome5 name="check" size={24} color={Colors.text.success} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <CalcFooter onValidate={handleValidation} nextPage="/views/design/chain/PostChainStatsView" />
    </View>
  );
}
