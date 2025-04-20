import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from "react-native";
import styles from "@style/MainStyle"; // Sử dụng style đã tạo
import CalcController from "@controller/CalcController";
import CalcFooter from "./CalcFooter";
import LoadingScreen from "./LoadingScreen";
import CalculatedChain, { SelectedChain } from "@models/Chain";
import ChainController from "@controller/ChainController";
import { Avatar } from "react-native-paper";

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
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Kết quả tính Xích</Text>
      </View>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Công suất tính toán:{" "}
          <Text style={{ color: "green", fontWeight: "bold" }}>{calcPower.toFixed(3)}</Text> kW
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
            // contentContainerStyle={{ flex: 1 }}
            data={chainList}
            keyExtractor={(item) => item.CHAIN_ID}
            renderItem={({ item, index }) => (
              <TouchableOpacity style={styles.selectItem} onPress={() => handleSelectChain(item)}>
                <Image
                  source={require("../img/wrench.png")}
                  style={styles.selectImage}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectName}>Loại {index + 1}</Text>
                  <Text style={styles.selectDetails}>
                    Bước xích: <Text style={{ color: "blue", fontWeight: "bold" }}>{item.Step_p} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Công suất cho phép [P]:{" "}
                    <Text style={{ color: "green", fontWeight: "bold" }}>{item.P_max} kW</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Đường kính chốt: <Text style={{ color: "blue", fontWeight: "bold" }}>{item.d_c} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Chiều dài ống: <Text style={{ color: "blue", fontWeight: "bold" }}>{item.B} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Tải trọng phá hỏng: <Text style={{ color: "blue", fontWeight: "bold" }}>{item.Q} kN</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Khối lượng 1 mét xích q:{" "}
                    <Text style={{ color: "blue", fontWeight: "bold" }}>{item.q_p} kg</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    Diện tích chiếu bản lề:{" "}
                    <Text style={{ color: "blue", fontWeight: "bold" }}>{item.A} mm2</Text>
                  </Text>
                </View>
                {selectedChain?.CHAIN_ID === item.CHAIN_ID && (
                  <Avatar.Icon
                    icon="check-decagram"
                    size={60}
                    color="green"
                    style={{ backgroundColor: "white" }}
                  />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <CalcFooter onValidate={handleValidation} nextPage="/src/views/PostChainStatsView" />
    </View>
  );
}
