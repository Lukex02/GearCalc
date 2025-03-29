import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider"; // Import Slider
import styles from "../style/AdjustParametersStyle";
import Efficiency from "../models/Efficiency";
import CalcController from "../controller/CalcController";
// import TransRatio, { TransRatioType1, TransRatioType2 } from "../models/GearRatio";
import calcFooter from "../style/calcFooter";

export default function AdjustEngineParametersScreen() {
  const router = useRouter(); // Hook để lấy router
  const calcController = CalcController.getInstance();
  const { effi: baseEfficiency, ratio: baseRatio } = calcController.showEngineParam();
  baseEfficiency.n_parts_spec.forEach((effi) => {
    if (effi.type == "brt") {
      (effi.min = 0.96), (effi.max = 0.98), (effi.name = "bánh răng trụ");
    }
    if (effi.type == "tv") {
      (effi.min = 0.83), (effi.max = 0.88), (effi.name = "trục vít");
    }
    if (effi.type == "x") {
      (effi.min = 0.95), (effi.max = 0.97), (effi.name = "xích");
    }
    if (effi.type == "d") {
      (effi.min = 0.95), (effi.max = 0.96), (effi.name = "đai");
    }
    if (effi.type == "ol") {
      (effi.min = 0.99), (effi.max = 0.995), (effi.name = "ổ lăn");
    }
    if (effi.type == "kn") {
      (effi.min = 1), (effi.max = 1), (effi.name = "khớp nối");
    }
  });
  baseRatio.ratio_spec.forEach((ratio) => {
    if (ratio.type == "x") {
      (ratio.min = 2), (ratio.max = 5), (ratio.name = "xích");
    }
    if (ratio.type == "h") {
      (ratio.min = 8), (ratio.max = 40), (ratio.name = "hộp");
    }
    if (ratio.type == "kn") {
      (ratio.min = 1), (ratio.max = 1), (ratio.name = "khớp nối");
    }
  });

  const [changeEffi, setChangeEffi] = useState(baseEfficiency);
  const [changeRatio, setChangeRatio] = useState(baseRatio);
  const [pCT, setPCT] = useState(calcController.getCalcEngine().p_ct);
  const [nSB, setNSB] = useState(calcController.getCalcEngine().n_sb);

  const handleContinue = () => {
    console.log(calcController.getCalcEngine());
    router.push("/src/views/SelectEngineScreen");
  };

  const handleBack = () => {
    router.back(); // Quay lại trang trước
  };

  const handleSliderChangeEffi = (index, value) => {
    const newChangeEffi = [...changeEffi.n_parts_full];
    newChangeEffi[index][0].value = value;
    setChangeEffi(new Efficiency(newChangeEffi));
  };

  const handleSliderChangeRatio = (index, value) => {
    const newChangeRatio = [...changeRatio.ratio_spec];
    newChangeRatio[index].value = value;
    setChangeRatio(new changeRatio.constructor(newChangeRatio));
  };

  useEffect(() => {
    calcController.adjustCalcEngine(changeEffi, changeRatio);
    setPCT(calcController.getCalcEngine().p_ct);
    setNSB(calcController.getCalcEngine().n_sb);
  }, [changeEffi, changeRatio]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Động cơ</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Công suất cần thiết: <Text style={{ color: "red", fontWeight: "bold" }}>{pCT.toFixed(3)}</Text> kW
        </Text>
        <Text style={styles.infoText}>
          Số vòng quay sơ bộ: <Text style={{ color: "red", fontWeight: "bold" }}>{nSB.toFixed(0)}</Text> rpm
        </Text>
      </View>

      <Text style={styles.parameterTitle}>Điều chỉnh thông số</Text>
      <View style={styles.parameterAdjustment}>
        {/* Hiệu suất */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Hiệu suất</Text>
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
                    style={{ width: 130, height: 40 }}
                    minimumValue={Math.round(item.min * 1000) / 1000}
                    maximumValue={Math.round(item.max * 1000) / 1000}
                    step={Math.round(((item.max - item.min) / 6) * 1000) / 1000}
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

        {/* Tỷ số truyền */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Tỷ số truyền</Text>
          {changeRatio && (
            <FlatList
              data={changeRatio.ratio_spec}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.parameterRow}>
                  <Text style={styles.paramType}>
                    u_{item.type}: {item.name}
                  </Text>
                  <Slider
                    style={{ width: 130, height: 40 }}
                    minimumValue={Math.round(item.min * 10) / 10}
                    maximumValue={Math.round(item.max * 10) / 10}
                    step={item.type === "h" ? 2 : Math.round(((item.max - item.min) / 6) * 10) / 10}
                    value={item.value}
                    onSlidingComplete={(value) => handleSliderChangeRatio(index, value)}
                    disabled={item.type === "kn"}
                  />
                  <Text>{item.value.toFixed(1)}</Text>
                </View>
              )}
            />
          )}
        </View>
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
