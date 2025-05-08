import React, { useState, useRef } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { Slider } from "react-native-awesome-slider";
import styles, { sliderTheme } from "@style/MainStyle";
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";

// Giả lập keyData
const keyData = [
  { shaft: 1, point: "A", d: 10 },
  { shaft: 1, point: "C", d: 10 },
  { shaft: 2, point: "B", d: 10 },
  { shaft: 2, point: "C", d: 10 },
  { shaft: 3, point: "A", d: 10 },
  { shaft: 3, point: "C", d: 10 },
];

export default function SelectDiamShaftScreen() {
  const [selectedDiameters, setSelectedDiameters] = useState<
    Record<string, number>
  >({});
  const calcController = CalcController.getInstance();
  const isSliding = useRef(false);
  const navigation = useNavigation();
  // Sử dụng useRef để lưu trữ SharedValue
  const progressValues = useRef(
    keyData.map((item) => useSharedValue(item.d))
  ).current;

  const minimumValue = useSharedValue(5); // Giá trị tối thiểu
  const maximumValue = useSharedValue(50); // Giá trị tối đa

  const handleSelection = (
    shaft: number,
    point: string,
    value: number,
    index: number
  ) => {
    setSelectedDiameters((prev) => ({
      ...prev,
      [`${shaft}-${point}`]: value,
    }));
    progressValues[index].value = value; // Cập nhật SharedValue
  };

  const handleCalculation = async () => {
    const shaftSelections: Record<number, { point: string; value: number }[]> =
      {};

    Object.keys(selectedDiameters).forEach((key) => {
      const [shaft, point] = key.split("-");
      const shaftNo = parseInt(shaft, 10);

      if (!shaftSelections[shaftNo]) {
        shaftSelections[shaftNo] = [];
      }

      shaftSelections[shaftNo].push({ point, value: selectedDiameters[key] });
    });

    for (const [shaftNo, d_choose] of Object.entries(shaftSelections)) {
      await calcController.chooseIndiShaftDiameter(
        parseInt(shaftNo, 10) as 1 | 2 | 3,
        d_choose
      );
    }

    const result = await calcController.calcKey();
    console.log("Kết quả tính toán:", result);
  };

  return (
    <View style={styles.container}>
      <Header title="Chọn đường kính trục" />
      <View style={styles.tableContainer}>
        <FlatList
          data={keyData}
          keyExtractor={(item) => `${item.shaft}-${item.point}`}
          renderItem={({ item, index }) => (
            <View style={localStyles.itemContainer}>
              <Text
                style={styles.paramType}
              >{`Trục ${item.shaft} - Điểm ${item.point}`}</Text>
              <Slider
                theme={sliderTheme}
                bubble={(value) => `${value} mm`}
                renderThumb={() => (
                  <FontAwesome6
                    name="diamond"
                    size={20}
                    color={Colors.primary}
                  />
                )}
                bubbleOffsetX={5}
                style={styles.slider}
                containerStyle={{ borderRadius: 40 }}
                progress={progressValues[index]} // Sử dụng SharedValue
                minimumValue={minimumValue} // Sử dụng SharedValue
                maximumValue={maximumValue} // Sử dụng SharedValue
                step={1}
                onSlidingStart={() => (isSliding.current = true)}
                onSlidingComplete={(value) => {
                  isSliding.current = false;
                  handleSelection(item.shaft, item.point, value, index);
                }}
              />
              <Text style={styles.resultText}>
                Đường kính:{" "}
                <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
                  {(
                    selectedDiameters[`${item.shaft}-${item.point}`] || item.d
                  ).toFixed(5)}{" "}
                  mm
                </Text>
              </Text>
            </View>
          )}
        />
        <Button
          mode="contained"
          onPress={handleCalculation}
          style={styles.mainBtn}
        >
          Tính toán
        </Button>
        <CalcFooter nextPage={"/views/design/shaft/Shaft5Screen"} />
      </View>
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
