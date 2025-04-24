import React, { useState, useEffect, useRef } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button } from "react-native-paper";
import { Slider } from "react-native-awesome-slider";
import styles, { sliderTheme } from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { scale, verticalScale } from "react-native-size-matters";
import CalcFooterStyle from "@style/CalcFooterStyle";
import { FontAwesome6 } from "@expo/vector-icons";
import { useSharedValue } from "react-native-reanimated";

// Bảng Data cứng khi chọn luôn vật liệu là Thép 40X - Tôi cải thiện
const materialStats = {
  small: { label: "Bánh nhỏ", sigma_b: 950, sigma_ch: 700, HB_min: 260, HB_max: 280, S_max: 60 },
  big: { label: "Bánh lớn", sigma_b: 850, sigma_ch: 550, HB_min: 230, HB_max: 260, S_max: 100 },
};
const label = {
  a_w: "Khoảng cách trục (mm)",
  m: "Modul pháp (mm)",
  b_w: "Chiều rộng vành răng (mm)",
  u_m: "Tỉ số truyền thực (mm)",
  beta: "Góc β (°)",
  z1: "Số răng bánh nhỏ (mm)",
  z2: "Số răng bánh lớn (mm)",
  d1: "Đường kính vòng chia đĩa bánh nhỏ (mm)",
  d2: "Đường kính vòng chia đĩa bánh lớn (mm)",
  da1: "Đường kính đỉnh bánh nhỏ (mm)",
  da2: "Đường kính đỉnh bánh lớn (mm)",
  df1: "Đường kính chân răng bánh nhỏ (mm)",
  df2: "Đường kính chân răng bánh lớn (mm)",
  dw1: "Đường kính lăn bánh nhỏ (mm)",
  dw2: "Đường kính lăn bánh lớn (mm)",
};

export default function GearSlowScreen() {
  const calcController = CalcController.getInstance();
  const [gearSetStats, setGearSetStats] = useState({});
  const selectMats: typeof materialStats = materialStats;
  const [HBColor, setHBColor] = useState("black");
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
      calcController.calcGearSet(
        { sigma_b: [950, 850], sigma_ch: [700, 550], HB: [HB.small.value, HB.big.value], S_max: [60, 100] },
        2
      );
      setGearSetStats(
        calcController
          .getCalcGearSet()
          .findLast((gear) => gear)
          .returnPostStats()
      );
      if (!verify) setModalVisible(true);
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
      setHBColor("rgb(20, 207, 3)");
    } else {
      setHBColor("red");
    }
    setVerify(false);
  }, [HB]);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Bộ truyền bánh răng cấp chậm</Text>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Chọn thông số vật liệu</Text>
      </View>
      <View style={styles.colContainer}>
        {/* Chọn độ rắn cho cặp bánh răng bộ truyền cấp chậm */}
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
                    theme={{ ...sliderTheme, minimumTrackTintColor: HBColor }}
                    bubble={(value) => `${Math.round(value)}`}
                    renderThumb={() => <FontAwesome6 name="diamond" size={20} color={HBColor} />}
                    bubbleOffsetX={5}
                    heartbeat={true}
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
                            : "black"
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
            <Text style={{ ...styles.tableTitle, color: "red" }}>
              HB bánh nhỏ - HB bánh lớn ≥ (10..15)HB !
            </Text>
          )}
        </View>
      </View>
      <View style={styles.resultContainer}>
        <Text style={{ fontStyle: "italic", color: "#FF7D00", fontWeight: "bold", fontSize: scale(16) }}>
          Loại vật liệu được chọn mặc định là Thép 40X - Tôi cải thiện
        </Text>
        <Text style={{ fontStyle: "italic", color: "green", fontSize: scale(12) }}>
          Bánh nhỏ - σb = 950, σch = 700, S ≤ 60 mm
        </Text>
        <Text style={{ fontStyle: "italic", color: "green", fontSize: scale(12) }}>
          Bánh lớn - σb = 850, σch = 550, S ≤ 100 mm
        </Text>
      </View>

      <CalcFooter onValidate={handleValidation} nextPage="/views/design/gear/GearResult" />
      <Modal
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        style={styles.overlay}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.pageTitle}>Thông số bộ truyền bánh răng cấp nhanh</Text>
            <View style={{ height: Math.floor(verticalScale(400)) }}>
              {/* Header */}
              <View style={styles.specHeaderRow}>
                <Text style={styles.specHeaderCell}>Thông số</Text>
                <Text style={styles.specHeaderCell}>Giá trị</Text>
              </View>
              <FlatList
                data={Object.keys(gearSetStats)}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View key={item} style={styles.specRow}>
                    <Text style={styles.specCellRow}>{label[item as keyof typeof label]}</Text>
                    <Text style={styles.specCellRow}>{gearSetStats[item as keyof typeof gearSetStats]}</Text>
                  </View>
                )}
              />
            </View>
            <View style={CalcFooterStyle.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...styles.mainBtnSmall, backgroundColor: "red" }}
                labelStyle={{ ...styles.mainBtnSmallTxt, color: "white" }}
                onPress={handleChange}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Thay đổi
              </Button>
              <Button
                mode="contained"
                style={styles.mainBtnSmall}
                labelStyle={styles.mainBtnSmallTxt}
                onPress={handleVerification}
              >
                Xác nhận
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
