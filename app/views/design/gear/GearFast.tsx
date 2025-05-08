import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, ScrollView } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { Slider } from "react-native-awesome-slider";
import styles, { sliderTheme } from "@style/MainStyle";
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { scale, verticalScale } from "react-native-size-matters";
import CalcFooterStyle from "@style/CalcFooterStyle";
import { useSharedValue } from "react-native-reanimated";
import { FontAwesome6 } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import GearSet from "@/src/models/Gear";
import { gearSetLabel as label } from "@/views/common/Label";

// Bảng Data cứng khi chọn luôn vật liệu là Thép 40X - Tôi cải thiện
const materialStats = {
  small: { label: "Bánh nhỏ", sigma_b: 950, sigma_ch: 700, HB_min: 260, HB_max: 280, S_max: 60 },
  big: { label: "Bánh lớn", sigma_b: 850, sigma_ch: 550, HB_min: 230, HB_max: 260, S_max: 100 },
};

export default function GearFastScreen() {
  const calcController = CalcController.getInstance();
  const [gearSet, setGearSet] = useState<GearSet>();
  const selectMats: typeof materialStats = materialStats;
  const [HBColor, setHBColor] = useState(Colors.text.primary);
  const [modalVisible, setModalVisible] = useState(false);
  const [verify, setVerify] = useState(false);

  const [HB, setHB] = useState({
    small: { value: (materialStats.small.HB_max + materialStats.small.HB_min) / 2 },
    big: { value: (materialStats.big.HB_max + materialStats.big.HB_min) / 2 },
  });

  const handleSliderChangeHB = (item: string, value: any) => {
    setHB({ ...HB, [item]: { value: value } });
  };

  const HBProgressValues = useRef(
    Object.keys(selectMats).map((item) => useSharedValue(HB[item as keyof typeof materialStats].value))
  ).current;
  const HBMinValues = useRef(
    Object.keys(selectMats).map((item) =>
      useSharedValue(selectMats[item as keyof typeof materialStats].HB_min!)
    )
  ).current;
  const HBMaxValues = useRef(
    Object.keys(selectMats).map((item) =>
      useSharedValue(selectMats[item as keyof typeof materialStats].HB_max!)
    )
  ).current;

  const handleValidation = () => {
    if (HB.small.value - HB.big.value >= 10) {
      if (!verify) {
        const gearSet = calcController.calcGearSet(
          { sigma_b: [950, 850], sigma_ch: [700, 550], HB: [HB.small.value, HB.big.value], S_max: [60, 100] },
          1
        );
        setGearSet(gearSet);
        setModalVisible(true);
      } else {
        calcController.setGearSet(gearSet);
      }
      return verify;
    } else {
      alert("Bánh nhỏ và bánh lớn độ bền không phù hợp");
      return false;
    }
  };
  const handleChange = (): boolean => {
    setModalVisible(false);
    setVerify(false);
    return false;
  };

  const handleVerification = (): boolean => {
    setModalVisible(false);
    setVerify(true);
    return true;
  };

  useEffect(() => {
    if (HB.small.value - HB.big.value >= 10 && HB.small.value - HB.big.value < 15) {
      setHBColor("rgb(255, 217, 0)");
    } else if (HB.small.value - HB.big.value >= 15) {
      setHBColor(Colors.text.success);
    } else {
      setHBColor("red");
    }
    setVerify(false);
  }, [HB]);

  return (
    <View style={styles.container}>
      <Header title="Bộ bánh răng cấp nhanh" rightIcon={<SaveComponent />} />
      <Text style={styles.pageTitle}>Chọn thông số vật liệu </Text>

      <View style={styles.colContainer}>
        {/* Chọn độ rắn cho cặp bánh răng bộ truyền cấp nhanh */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>ĐỘ RẮN</Text>
          {selectMats && (
            <FlatList
              data={Object.keys(selectMats)}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View key={index} style={styles.parameterRow}>
                  <Text style={styles.paramType}>{selectMats[item as keyof typeof materialStats].label}</Text>
                  <Slider
                    theme={{ ...sliderTheme, minimumTrackTintColor: HBColor, bubbleBackgroundColor: HBColor }}
                    bubble={(value) => `${Math.round(value)}`}
                    renderThumb={() => <FontAwesome6 name="diamond" size={20} color={HBColor} />}
                    bubbleOffsetX={5}
                    style={styles.slider}
                    forceSnapToStep={true}
                    steps={
                      (selectMats[item as keyof typeof materialStats].HB_max -
                        selectMats[item as keyof typeof materialStats].HB_min) /
                      5
                    }
                    renderMark={({ index }) => (
                      <FontAwesome6
                        name="diamond"
                        size={10}
                        color={
                          selectMats[item as keyof typeof materialStats].HB_min + index * 5 <
                          HB[item as keyof typeof materialStats].value
                            ? HBColor
                            : Colors.unselected
                        }
                      />
                    )}
                    containerStyle={{ borderRadius: 40 }}
                    progress={HBProgressValues[index]}
                    minimumValue={HBMinValues[index]}
                    maximumValue={HBMaxValues[index]}
                    onSlidingComplete={(value) => handleSliderChangeHB(item, value)}
                  />

                  <Text style={{ color: HBColor, fontWeight: "bold" }}>
                    HB {HB[item as keyof typeof materialStats].value}
                  </Text>
                </View>
              )}
            />
          )}
          {HBColor == "rgb(255, 217, 0)" && (
            <Text style={{ ...styles.tableTitle, color: HBColor }}>
              Đề xuất: HB bánh nhỏ - HB bánh lớn ≥ 15
            </Text>
          )}
          {HBColor == "red" && (
            <Text style={{ ...styles.tableTitle, color: Colors.text.error }}>
              HB bánh nhỏ - HB bánh lớn ≥ (10..15)HB !
            </Text>
          )}
        </View>
      </View>

      <View style={styles.resultContainer}>
        <Text style={{ fontStyle: "italic", color: Colors.primary, fontWeight: "bold", fontSize: scale(16) }}>
          Loại vật liệu được chọn mặc định là Thép 40X - Tôi cải thiện
        </Text>
        <Text style={{ fontStyle: "italic", color: Colors.text.success, fontSize: scale(12) }}>
          Bánh nhỏ - σb = 950, σch = 700, S ≤ 60 mm
        </Text>
        <Text style={{ fontStyle: "italic", color: Colors.text.success, fontSize: scale(12) }}>
          Bánh lớn - σb = 850, σch = 550, S ≤ 100 mm
        </Text>
      </View>

      <CalcFooter onValidate={handleValidation} nextPage="/views/design/gear/GearSlow" />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.pageTitle}>Thông số bộ truyền bánh răng cấp nhanh</Text>
            <View style={{ height: Math.floor(verticalScale(400)) }}>
              <View style={styles.specHeaderRow}>
                <Text style={styles.specHeaderCell}>Thông số</Text>
                <Text style={styles.specHeaderCell}>Giá trị</Text>
              </View>
              {gearSet && (
                <FlatList
                  data={Object.keys(gearSet.returnPostStats())}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <View key={item} style={styles.specRow}>
                      <Text style={styles.specCellRow}>{label[item as keyof typeof label]}</Text>
                      <Text style={styles.specCellRow}>
                        {gearSet.returnPostStats()[item as keyof typeof label]}
                      </Text>
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
                Hủy
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
        </Modal>
      </Portal>
    </View>
  );
}
