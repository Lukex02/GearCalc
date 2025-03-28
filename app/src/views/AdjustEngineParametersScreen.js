import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Slider from "@react-native-community/slider"; // Import Slider
import { useNavigation } from "@react-navigation/native"; // Hook navigation
import styles from "../style/AdjustParametersStyle";
import Efficiency from "../models/Efficiency";
import CalcController from "../controller/CalcController";
import TransRatio, { TransRatioType1, TransRatioType2 } from "../models/GearRatio";
import calcFooter from "../style/calcFooter";

export default function AdjustEngineParametersScreen() {
  // const navigation = useNavigation(); // Hook để chuyển trang
  const router = useRouter(); // Hook để lấy router
  const calcController = CalcController.getInstance();
  const { effi: baseEfficiency, ratio: baseRatio } = calcController.showEngineParam();
  const [changeEffi, setChangeEffi] = useState(baseEfficiency);
  const [changeRatio, setChangeRatio] = useState(baseRatio);

  const handleContinue = () => {
    // Chuyển giá trị sang trang tính toán tiếp theo
    // const results = {
    //   efficiency: changeEffi.parameters,
    //   ratio: changeRatio.parameters,
    // };

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Động cơ</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Công suất cần thiết:{" "}
          <Text style={{ color: "red", fontWeight: "bold" }}>{calcController.getCalcEngine().p_ct.toFixed(3)}</Text> kW
        </Text>
        <Text style={styles.infoText}>
          Số vòng quay sơ bộ:{" "}
          <Text style={{ color: "red", fontWeight: "bold" }}>{calcController.getCalcEngine().n_sb.toFixed(0)}</Text> rpm
        </Text>
      </View>

      <Text style={styles.parameterTitle}>Điều chỉnh thông số</Text>
      <View style={styles.parameterAdjustment}>
        {/* Hiệu suất */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Hiệu suất</Text>
          {changeEffi &&
            changeEffi.n_parts_spec.map((param, index) => (
              <View key={index} style={styles.parameterRow}>
                <Text style={styles.paramType}>{param.type}</Text>
                <Slider
                  style={{ width: 130, height: 40 }}
                  minimumValue={param.min}
                  maximumValue={param.max}
                  step={0.01}
                  value={param.value}
                  onValueChange={(value) => handleSliderChangeEffi(index, value)}
                />
                <Text>{param.value.toFixed(3)}</Text>
              </View>
            ))}
        </View>

        {/* Tỷ số truyền */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Tỷ số truyền</Text>
          {changeRatio &&
            changeRatio.ratio_spec.map((param, index) => (
              <View key={index} style={styles.parameterRow}>
                <Text style={styles.paramType}>{param.type}</Text>
                <Slider
                  style={{ width: 130, height: 40 }}
                  minimumValue={param.min}
                  maximumValue={param.max}
                  step={1}
                  value={param.value}
                  onValueChange={(value) => handleSliderChangeRatio(index, value)}
                />
                <Text>{param.value.toFixed(1)}</Text>
              </View>
            ))}
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
