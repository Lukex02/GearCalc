import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider"; // Import Slider
import styles from "../style/MainStyle";
import Efficiency from "../models/Efficiency";
import CalcController from "../controller/CalcController";
import CalcFooter from "./CalcFooter";

export default function GearFastScreen() {
  const router = useRouter(); // Hook để lấy router
  const calcController = CalcController.getInstance();
  const { effi: baseEfficiency, ratio: baseRatio } = calcController.showEngineParam();
  baseEfficiency.n_parts_spec.forEach((effi) => {
    if (effi.type == "brt") {
      (effi.min = 0.96), (effi.max = 0.98), (effi.name = "bánh răng trụ");
    }
  });

  const [changeEffi, setChangeEffi] = useState(baseEfficiency);
  const [pCT, setPCT] = useState(calcController.getCalcEngine().p_ct);
  const [nSB, setNSB] = useState(calcController.getCalcEngine().n_sb);

  const handleSliderChangeEffi = (index: number, value: any) => {
    const newChangeEffi = [...changeEffi.n_parts_full];
    newChangeEffi[index][0].value = value;
    setChangeEffi(new Efficiency(newChangeEffi));
  };

  useEffect(() => {
    setPCT(calcController.getCalcEngine().p_ct);
    setNSB(calcController.getCalcEngine().n_sb);
  }, [changeEffi]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Điều chỉnh thông số</Text>
      </View>
      <View style={styles.colContainer}>
        {/* Hiệu suất */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>ĐỘ RẮN</Text>
          {changeEffi && (
            <FlatList
              data={changeEffi.n_parts_spec}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.parameterRow}>
                  <Text style={styles.paramType}>
                    n_{item.type}: {item.name}
                  </Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={Math.round(item.min ? item.min * 1000 : 1000) / 1000}
                    maximumValue={Math.round(item.max ? item.max * 1000 : 1000) / 1000}
                    step={
                      Math.round(((item.max ? item.max : 1 - (item.min ? item.min : 1)) / 6) * 1000) / 1000
                    }
                    value={item.value}
                    onSlidingComplete={(value) => handleSliderChangeEffi(index, value)}
                    disabled={item.type === "kn"}
                  />
                  <Text>{item.value.toFixed(3)}</Text>
                </View>
              )}
            />
          )}
        </View>
      </View>
      <Text style={styles.pageTitle}>Kết quả tính toán</Text>
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Công suất cần thiết: <Text style={{ color: "red", fontWeight: "bold" }}>{pCT.toFixed(3)}</Text> kW
        </Text>
        <Text style={styles.resultText}>
          Số vòng quay sơ bộ: <Text style={{ color: "red", fontWeight: "bold" }}>{nSB.toFixed(0)}</Text> rpm
        </Text>
      </View>
      <CalcFooter nextPage={"./src/views/GearLow"} />
    </View>
  );
}
