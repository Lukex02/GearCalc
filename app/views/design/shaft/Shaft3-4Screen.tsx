import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { Slider } from "react-native-awesome-slider";
import styles, { sliderTheme } from "@style/MainStyle";
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import { scale, verticalScale } from "react-native-size-matters";
import CalcFooterStyle from "@/src/style/CalcFooterStyle";
import CalculatedKey from "@/src/models/Key";
import Label from "@/views/common/Label";
import LoadingScreen from "@/views/common/LoadingScreen";

const pointMapping = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
};

export default function SelectDiamShaftScreen() {
  const calcController = CalcController.getInstance();
  const [modalVisible, setModalVisible] = useState(false);
  const [verify, setVerify] = useState(false);
  const [dSb, setDSb] = useState<number[][]>(); // Giá trị đường kính trục sơ bộ
  const [selectedDiameters, setSelectedDiameters] = useState<
    Record<number, { point: string; value: number }[]>
  >({
    1: [],
    2: [],
    3: [],
  });
  const [keyList, setKeyList] = useState<CalculatedKey[]>([]); // Kết quả tính toán then
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
    for (let i = 0; i < (dSb?.length || 0); i++) {
      const d_sbList = dSb![i]; // dùng ! nếu chắc chắn không null

      const diameterList = selectedDiameters[i + 1];
      if (!diameterList) continue;

      for (let diaIndex = 0; diaIndex < diameterList.length; diaIndex++) {
        const item = diameterList[diaIndex];

        if (item.value < d_sbList[diaIndex]) {
          alert(
            `Vui lòng chọn đường kính tại trục ${i + 1} - ${
              pointMapping[diaIndex as keyof typeof pointMapping]
            } lớn hơn sơ bộ!`
          );
          return; // hoặc break nếu chỉ muốn thoát 1 vòng
        }
      }
    }

    setModalVisible(true);
    Object.keys(selectedDiameters).forEach((shaftNoEntries) => {
      const shaftNo = parseInt(shaftNoEntries, 10) as 1 | 2 | 3;
      calcController.chooseIndiShaftDiameter(shaftNo, selectedDiameters[shaftNo]);
    });
    try {
      const keyList = await calcController.calcKey();
      setKeyList(keyList);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleChange = () => {
    setModalVisible(false);
    setVerify(false);
  };

  const handleValidation = () => {
    if (!verify) {
      alert("Vui lòng xác nhận thông số then!");
    }
    return verify;
  };

  const handleVerification = () => {
    setModalVisible(false);
    setVerify(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Thiết kế trục" rightIcon={<SaveComponent />} />
      <View style={{ ...styles.inputContainer, height: verticalScale(450) }}>
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
                      handleSelection(Math.floor(index / 4) + 1, index % 4, value);
                    }}
                  />
                  <Text style={styles.resultText}>
                    Chọn:{" "}
                    <Text
                      style={{
                        color:
                          selectedDiameters[Math.floor(index / 4) + 1][index % 4]?.value < item
                            ? Colors.text.error
                            : Colors.text.success,
                        fontWeight: "bold",
                      }}
                    >
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
            style={{ ...styles.mainBtnMedium, marginTop: verticalScale(15), width: "100%" }}
            labelStyle={styles.mainBtnSmallTxt}
          >
            Tính toán then
          </Button>
        </View>
      </View>
      <CalcFooter onValidate={handleValidation} nextPage={"/views/design/shaft/Shaft5Screen"} />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.overlay}>
          {keyList && keyList.length > 0 ? (
            <View style={styles.modalView}>
              <Text style={styles.pageTitle}>Thông số then</Text>
              <Image source={require("@img/key_flat.png")} style={styles.keyImg} resizeMode="stretch" />
              <View style={{ height: Math.floor(verticalScale(300)) }}>
                {keyList && (
                  <FlatList
                    data={keyList}
                    keyExtractor={(item, index) => `${item.point}-${item.lt}`}
                    renderItem={({ item, index }) => (
                      <View key={index} style={{ width: scale(270) }}>
                        <Text style={{ ...styles.specHeaderCell, textAlign: "left" }}>
                          Tại trục {Math.floor(index / 2) + 1} - {item.point}
                        </Text>
                        {Object.keys(Label.keyLabel).map((key) => (
                          <Text
                            key={key}
                            style={{
                              ...styles.specCellRow,
                              textAlign: "left",
                              paddingVertical: verticalScale(6),
                            }}
                          >
                            - {Label.keyLabel[key as keyof typeof Label.keyLabel]}:{" "}
                            {item[key as keyof typeof Label.keyLabel]} mm
                          </Text>
                        ))}
                      </View>
                    )}
                  />
                )}
              </View>
              <View style={CalcFooterStyle.buttonFooter}>
                <Button
                  mode="contained"
                  style={{ ...styles.mainBtnSmall, backgroundColor: Colors.text.error }}
                  labelStyle={{ ...styles.mainBtnSmallTxt, color: Colors.text.primary }}
                  onPress={handleChange}
                  rippleColor={"rgba(0, 0, 0, 0.29)"}
                >
                  Thay đổi
                </Button>
                <Button
                  mode="contained"
                  style={{ ...styles.mainBtnSmall, backgroundColor: Colors.text.success }}
                  labelStyle={styles.mainBtnSmallTxt}
                  onPress={handleVerification}
                >
                  Xác nhận
                </Button>
              </View>
            </View>
          ) : (
            <LoadingScreen />
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  itemContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.primary,
  },
});
