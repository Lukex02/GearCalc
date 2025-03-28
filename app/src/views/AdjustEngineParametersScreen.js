import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Slider from '@react-native-community/slider'; // Import Slider 
import { useNavigation } from '@react-navigation/native'; // Hook navigation
import styles from "../style/AdjustParametersStyle"; 

// Các lớp giả định cho Efficiency và TransRatioType
class Efficiency {
  constructor(parameters) {
    this.parameters = parameters;
  }
}

class TransRatioType1 {
  constructor(parameters) {
    this.parameters = parameters;
  }
}

export default function AdjustEngineParametersScreen() {
  const navigation = useNavigation(); // Hook để chuyển trang

  // Chọn mặc định là gearcalc1 ( chỉnh min max cho trường hợp gear calc2)
  //chỉnh min max sao cho phù hợp
  const [changeEffi, setChangeEffi] = useState(
    new Efficiency([
      [{ type: "ol", value: 0.992, min: 0.99, max: 0.995 }, 4],
      [{ type: "x", value: 0.96, min: 0.95, max: 0.97 }, 1],
      [{ type: "brt", value: 0.96, min: 0.96, max: 0.98 }, 2],
      [{ type: "kn", value: 1, min: 0, max: 1 }, 1],//tìm ko ra min max
    ])
  );

  const [changeRatio, setChangeRatio] = useState(
    new TransRatioType1([
      { type: "x", value: 2.56, min: 2, max: 5 },
      { type: "h", value: 18, min: 8, max: 40 },
      { type: "kn", value: 1, min: 0, max: 2 },//k tìm ra
    ])
  );
// trường hợp là gear calc 2 chưa tìm ra đc các kí hiệu vì tài liệu chỉ hướng dẫn th1 
//   (gearBoxType === "gearcalc2") {
//     setChangeEffi(
//       new Efficiency([
//         [{ type: "ol", value: 0.99, min: 0.99, max: 0.995 }, 4],
//         [{ type: "d", value: 0.94 }, 1],
//         [{ type: "tv", value: 0.85 }, 1],
//         [{ type: "brt", value: 0.96 }, 1],
//         [{ type: "kn", value: 0.98 }, 1],
//       ])
//     );
//     setChangeRatio(
//       new TransRatioType2([
//         { type: "d", value: 3 },
//         { type: "tv", value: 10 },
//         { type: "brt", value: 3 },
//         { type: "kn", value: 1 },
//       ])
//     );

  const requiredPower = "KW"; // Mặc định công suất
  const rpm = "Vòng quay";  // Mặc định số vòng quay

  const handleContinue = () => {
    // Chuyển giá trị sang trang tính toán tiếp theo
    const results = {
      efficiency: changeEffi.parameters,
      ratio: changeRatio.parameters,
    };

    router.push("/src/views/SelectEngineScreen");
  };

  const handleBack = () => {
    navigation.goBack(); // Quay lại trang trước
  };

  const handleSliderChangeEffi = (index, value) => {
    const newChangeEffi = [...changeEffi.parameters];
    newChangeEffi[index][0].value = value;
    setChangeEffi(new Efficiency(newChangeEffi));
  };

  const handleSliderChangeRatio = (index, value) => {
    const newChangeRatio = [...changeRatio.parameters];
    newChangeRatio[index].value = value;
    setChangeRatio(new TransRatioType1(newChangeRatio));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Động cơ</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Công suất cần thiết: {requiredPower}</Text>
        <Text style={styles.infoText}>Số vòng quay: {rpm}</Text>
      </View>

      <View style={styles.parameterAdjustment}>
        <Text style={styles.parameterTitle}>Điều chỉnh thông số</Text>

        {/* Hiệu suất */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Hiệu suất</Text>
          {changeEffi.parameters &&
            changeEffi.parameters.map((param, index) => (
              <View key={index} style={styles.parameterRow}>
                <Text style={styles.paramType}>{param[0].type}</Text>
                <Slider
                  style={{ width: "80%", height: 40 }}
                  minimumValue={param[0].min}
                  maximumValue={param[0].max}
                  step={0.001}
                  value={param[0].value}
                  onValueChange={(value) => handleSliderChangeEffi(index, value)}
                />
                <Text>{param[0].value.toFixed(3)}</Text>
              </View>
            ))}
        </View>

        {/* Tỷ số truyền */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Tỷ số truyền</Text>
          {changeRatio.parameters &&
            changeRatio.parameters.map((param, index) => (
              <View key={index} style={styles.parameterRow}>
                <Text style={styles.paramType}>{param.type}</Text>
                <Slider
                  style={{ width: "80%", height: 40 }}
                  minimumValue={param.min}
                  maximumValue={param.max}
                  step={0.1}
                  value={param.value}
                  onValueChange={(value) => handleSliderChangeRatio(index, value)}
                />
                <Text>{param.value.toFixed(1)}</Text>
              </View>
            ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelButtonText}>Thoát</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
