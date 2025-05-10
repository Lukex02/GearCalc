import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Slider } from "react-native-awesome-slider";
import styles, { sliderTheme } from "@style/MainStyle";
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import { verticalScale } from "react-native-size-matters";

const pointMapping = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
};

export default function SelectDiamShaftScreen() {
  const calcController = CalcController.getInstance();
  const [dSb, setDSb] = useState<number[][]>(); // Giá trị đường kính trục sơ bộ
  const [selectedDiameters, setSelectedDiameters] = useState<
    Record<number, { point: string; value: number }[]>
  >({
    1: [],
    2: [],
    3: [],
  });
  // Sử dụng useRef để lưu trữ SharedValue
  const progressValues = useRef(
    [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20].map((item) => useSharedValue(item))
  ).current; // Sử dụng SharedValue

  const minimumValue = useSharedValue(20); // Giá trị tối thiểu
  const maximumValue = useSharedValue(90); // Giá trị tối đa

  useEffect(() => {
    const dSbData = calcController
      .getShaft()
      .getAllIndividualShaft()
      .map((indiShaft, index) => {
        return indiShaft.getDSbAll();
      });
    setDSb(dSbData);
    // console.log("dSbData", dSbData.flat());
  }, []);

  const handleSelection = (shaft: number, point: number, newValue: number) => {
    const newSelected = {
      ...selectedDiameters,
      [shaft]: [...(selectedDiameters[shaft] || [])],
    };

    const existing = newSelected[shaft].find(
      (item) => item.point === pointMapping[point as keyof typeof pointMapping]
    );
    if (existing) {
      existing.value = newValue;
    } else {
      newSelected[shaft].push({
        point: pointMapping[point as keyof typeof pointMapping],
        value: newValue,
      });
    }
    setSelectedDiameters(newSelected);
  };

  const handleCalculation = async () => {
    if (
      !selectedDiameters ||
      selectedDiameters[1].length < 4 ||
      selectedDiameters[2].length < 4 ||
      selectedDiameters[3].length < 4
    )
      return alert("Vui lòng chọn đủ đường kính trục!");

    Object.keys(selectedDiameters).forEach((shaftNoEntries) => {
      const shaftNo = parseInt(shaftNoEntries, 10) as 1 | 2 | 3;
      calcController.chooseIndiShaftDiameter(shaftNo, selectedDiameters[shaftNo]);
    });
    try {
      const keyList = await calcController.calcKey();
      console.log("Kết quả tính toán then:", keyList);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Thiết kế trục" rightIcon={<SaveComponent />} />
      <View style={styles.inputContainer}>
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Chọn đường kính trục</Text>
          {dSb && (
            <FlatList
              data={dSb.flat()}
              keyExtractor={(item, index) => `item-${index}`}
              renderItem={({ item, index }) => (
                <View style={localStyles.itemContainer}>
                  <Text style={styles.paramType}>
                    Trục
                    <Text style={{ color: Colors.text.accent, fontWeight: "bold" }}>{` ${
                      Math.floor(index / 4) + 1
                    } tại ${pointMapping[(index % 4) as keyof typeof pointMapping]} `}</Text>
                    - Sơ bộ: <Text style={{ color: Colors.text.muted }}>{item.toFixed(2)} mm</Text>
                  </Text>
                  <Slider
                    theme={sliderTheme}
                    bubble={(value) => `${value} mm`}
                    renderThumb={() => <FontAwesome6 name="diamond" size={20} color={Colors.primary} />}
                    bubbleOffsetX={2}
                    style={styles.slider}
                    steps={(90 - 20) / 5}
                    forceSnapToStep={true}
                    renderMark={({ index }) => <View></View>}
                    containerStyle={{ borderRadius: 40 }}
                    progress={progressValues[index]} // Sử dụng SharedValue
                    minimumValue={minimumValue} // Sử dụng SharedValue
                    maximumValue={maximumValue} // Sử dụng SharedValue
                    onSlidingComplete={(value) => {
                      // isSliding.current = false;
                      handleSelection(Math.floor(index / 4) + 1, index % 4, value);
                    }}
                  />
                  <Text style={styles.resultText}>
                    Chọn:{" "}
                    <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>
                      {" "}
                      {selectedDiameters &&
                        selectedDiameters[Math.floor(index / 4) + 1][index % 4] &&
                        selectedDiameters[Math.floor(index / 4) + 1][index % 4].value}{" "}
                      mm
                    </Text>
                  </Text>
                </View>
              )}
            />
          )}
          <Button
            mode="contained"
            onPress={handleCalculation}
            style={{ ...styles.mainBtnMedium, marginTop: verticalScale(15) }}
            labelStyle={styles.mainBtnSmallTxt}
          >
            Tính toán then
          </Button>
        </View>
      </View>

      <CalcFooter nextPage={"/views/design/shaft/Shaft5Screen"} />
    </View>
  );
}

const localStyles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.primary,
  },
});
