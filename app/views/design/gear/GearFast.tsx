import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button } from "react-native-paper";
// import { useRouter } from "expo-router";
import Slider from "@react-native-community/slider"; // Import Slider
import styles from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { scale, verticalScale } from "react-native-size-matters";
import CalcFooterStyle from "@style/CalcFooterStyle";

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

export default function GearFastScreen() {
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

  const handleSliderChangeEffi = (item: string, value: any) => {
    setHB({ ...HB, [item]: { value: value } });
  };

  const handleValidation = () => {
    if (HB.small.value - HB.big.value >= 10) {
      calcController.calcGearSet(
        { sigma_b: [950, 850], sigma_ch: [700, 550], HB: [HB.small.value, HB.big.value], S_max: [60, 100] },
        1
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
      setHBColor("#ec942c");
    } else if (HB.small.value - HB.big.value >= 15) {
      setHBColor("green");
    } else {
      setHBColor("red");
    }
    setVerify(false);
  }, [HB]);

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Bộ truyền bánh răng cấp nhanh</Text>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Chọn thông số vật liệu</Text>
      </View>
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
                    style={styles.slider}
                    minimumValue={selectMats[item as keyof typeof materialStats].HB_min}
                    maximumValue={selectMats[item as keyof typeof materialStats].HB_max}
                    step={5}
                    value={HB[item as keyof typeof materialStats].value}
                    onSlidingComplete={(value) => handleSliderChangeEffi(item, value)}
                  />
                  <Text style={{ color: HBColor, fontWeight: "bold" }}>
                    HB {HB[item as keyof typeof materialStats].value}
                  </Text>
                </View>
              )}
            />
          )}
          {HBColor == "#ec942c" && (
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
        <Text style={{ fontStyle: "italic", color: "blue", fontWeight: "bold", fontSize: scale(16) }}>
          Loại vật liệu được chọn mặc định là Thép 40X - Tôi cải thiện
        </Text>
        <Text style={{ fontStyle: "italic", color: "green", fontSize: scale(12) }}>
          Bánh nhỏ - σb = 950, σch = 700, S ≤ 60 mm
        </Text>
        <Text style={{ fontStyle: "italic", color: "green", fontSize: scale(12) }}>
          Bánh lớn - σb = 850, σch = 550, S ≤ 100 mm
        </Text>
      </View>

      <CalcFooter onValidate={handleValidation} nextPage="/views/design/gear/GearSlow" />
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
                Hủy
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
