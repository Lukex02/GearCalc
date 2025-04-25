import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { Slider } from "react-native-awesome-slider";
import styles, { sliderTheme } from "@style/MainStyle";
import Efficiency from "@models/Efficiency";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AdjustEngineParametersScreen() {
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
  const [isSliding, setIsSliding] = useState(false);
  const [changeEffi, setChangeEffi] = useState(baseEfficiency);
  const [changeRatio, setChangeRatio] = useState(baseRatio);
  const [pCT, setPCT] = useState(calcController.getCalcEngine().p_ct);
  const [nSB, setNSB] = useState(calcController.getCalcEngine().n_sb);
  const effiProgressValues = useRef(
    baseEfficiency.n_parts_spec.map((item) => useSharedValue(item.value))
  ).current;
  const effiMinValues = useRef(baseEfficiency.n_parts_spec.map((item) => useSharedValue(item.min!))).current;
  const effiMaxValues = useRef(baseEfficiency.n_parts_spec.map((item) => useSharedValue(item.max!))).current;

  const ratioProgressValues = useRef(baseRatio.ratio_spec.map((item) => useSharedValue(item.value))).current;
  const ratioMinValues = useRef(baseRatio.ratio_spec.map((item) => useSharedValue(item.min!))).current;
  const ratioMaxValues = useRef(baseRatio.ratio_spec.map((item) => useSharedValue(item.max!))).current;

  const handleSliderChangeEffi = (index: number, value: any) => {
    setIsSliding(false);
    const newChangeEffi = [...changeEffi.n_parts_full];
    newChangeEffi[index][0].value = value;
    setChangeEffi(new Efficiency(newChangeEffi));
  };

  const handleSliderChangeRatio = (index: number, value: any) => {
    setIsSliding(false);
    const newChangeRatio = [...changeRatio.ratio_spec];
    newChangeRatio[index].value = value;
    setChangeRatio(new (Object.getPrototypeOf(changeRatio).constructor)(newChangeRatio));
  };

  useEffect(() => {
    calcController.adjustCalcEngine(changeEffi, changeRatio);
    setPCT(calcController.getCalcEngine().p_ct);
    setNSB(calcController.getCalcEngine().n_sb);
  }, [changeEffi, changeRatio]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Thông số tính toán</Text>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Công suất cần thiết:{" "}
          <Text style={{ color: "#FF7D00", fontWeight: "bold" }}>{pCT.toFixed(3)} kW</Text>
        </Text>
        <Text style={styles.resultText}>
          Số vòng quay sơ bộ:{" "}
          <Text style={{ color: "#FF7D00", fontWeight: "bold" }}>{nSB.toFixed(0)} rpm</Text>
        </Text>
      </View>

      <Text style={styles.pageTitle}>Điều chỉnh thông số</Text>
      <View style={styles.colContainer}>
        {/* Hiệu suất */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Hiệu suất</Text>
          {changeEffi && (
            <FlatList
              data={changeEffi.n_parts_spec}
              scrollEnabled={!isSliding}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.parameterRow}>
                  <Text style={styles.paramType}>
                    n_{item.type}: {item.name}
                  </Text>
                  <Slider
                    theme={sliderTheme}
                    bubble={(value) => `${Math.round(value * 1000) / 1000}`}
                    renderThumb={() => <FontAwesome6 name="diamond" size={20} color="#FF7D00" />}
                    bubbleOffsetX={5}
                    style={styles.slider}
                    containerStyle={{ borderRadius: 40 }}
                    progress={effiProgressValues[index]}
                    minimumValue={effiMinValues[index]}
                    maximumValue={effiMaxValues[index]}
                    onSlidingStart={() => setIsSliding(true)}
                    onSlidingComplete={(value) => handleSliderChangeEffi(index, value)}
                  />
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
              scrollEnabled={!isSliding}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View style={styles.parameterRow}>
                  <Text style={styles.paramType}>
                    u_{item.type}: {item.name}
                  </Text>
                  <Slider
                    theme={sliderTheme}
                    bubble={(value) => `${Math.round(value * 10) / 10}`}
                    renderThumb={() => <FontAwesome6 name="diamond" size={20} color="#FF7D00" />}
                    bubbleOffsetX={5}
                    style={styles.slider}
                    containerStyle={{ borderRadius: 40 }}
                    progress={ratioProgressValues[index]}
                    minimumValue={ratioMinValues[index]}
                    maximumValue={ratioMaxValues[index]}
                    onSlidingStart={() => setIsSliding(true)}
                    onSlidingComplete={(value) => handleSliderChangeRatio(index, value)}
                  />
                </View>
              )}
            />
          )}
        </View>
      </View>

      <CalcFooter nextPage={"/views/design/engine/SelectEngineScreen"} />
    </View>
  );
}
