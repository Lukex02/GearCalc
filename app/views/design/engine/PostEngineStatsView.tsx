import React, { useState, useEffect } from "react";
import { View, Text, Modal, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import Slider from "@react-native-community/slider"; // Import Slider
import styles from "@style/MainStyle"; // Import styles có sẵn
import CalcController from "@controller/CalcController"; // Import CalcController
import CalcFooter from "@views/common/CalcFooter"; // Import CalcFooter
import { ForceOnShaftDiagram } from "@services/Utils"; // Import ForceOnShaftDiagram từ Utils.tsx

// Bảng Data cứng khi chọn luôn vật liệu là Thép 45 - Thường hóa chế tạo (Input)
const materialStats = {
  label: "Vật liệu chế tạo trục",
  sigma_b: 600,
  sigma_ch: 340,
  HB_min: 170,
  HB_max: 217,
  S_max: 60,
};

export default function Shaft1_2Screen() {
  const calcController = CalcController.getInstance();

  // Trạng thái cho modal chọn đường kính trục
  const [isModalVisible, setModalVisible] = useState(false);
  const [shaftDiameter, setShaftDiameter] = useState<number[]>([30]);
  const [shaftData, setShaftData] = useState<any>(null);

  // Gọi phương thức tính toán trục
  useEffect(() => {
    calcController.calcShaft({
      sigma_b: materialStats.sigma_b,
      sigma_ch: materialStats.sigma_ch,
      HB: materialStats.HB_min,
    });

    // Lấy dữ liệu đồ thị trục
    const shaftDiagram = calcController.getShaftDiagram();
    setShaftData(shaftDiagram);
  }, []);

  // Hàm mở modal để chọn đường kính trục
  const openShaftDiameterModal = () => {
    setModalVisible(true);
  };

  // Hàm đóng modal
  const closeShaftDiameterModal = () => {
    setModalVisible(false);
  };

  // Hàm xử lý chọn đường kính trục và lưu vào state
  const handleShaftDiameterSelect = (selectedDiameter: number[]) => {
    setShaftDiameter(selectedDiameter);
    calcController.chooseShaftDiameter(selectedDiameter);
    closeShaftDiameterModal();
  };

  // Hàm hiển thị các thông số vật liệu
  const renderMaterialStats = () => {
    return (
      <View>
        <Text style={styles.infoText}>Sigma_b: {materialStats.sigma_b}</Text>
        <Text style={styles.infoText}>Sigma_ch: {materialStats.sigma_ch}</Text>
        <Text style={styles.infoText}>HB Min: {materialStats.HB_min}</Text>
        <Text style={styles.infoText}>HB Max: {materialStats.HB_max}</Text>
        <Text style={styles.infoText}>S_max: {materialStats.S_max}</Text>
      </View>
    );
  };

  // Hàm hiển thị đồ thị lực trục
  const renderShaftDiagram = () => {
    if (!shaftData) return <Text>Đang tải đồ thị...</Text>;

    return (
      <View style={styles.containerCentered}>
        <ForceOnShaftDiagram
          data={shaftData.Shaft1.Q1x} // Chọn dữ liệu trục cần vẽ
          fillColor="blue"
          lineColor="red"
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcomeTitle}>{materialStats.label}</Text>

      {/* Hiển thị các thông số vật liệu */}
      {renderMaterialStats()}

      {/* Hiển thị nút để chọn đường kính trục */}
      <Button mode="contained" onPress={openShaftDiameterModal} style={styles.mainBtn}>
        Chọn đường kính trục
      </Button>

      {/* Hiển thị đồ thị trục nếu có */}
      {renderShaftDiagram()}

      {/* Modal để chọn đường kính trục */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeShaftDiameterModal}
      >
        <View style={styles.modalContainer}>
          <Text>Chọn đường kính trục</Text>
          <Slider
            minimumValue={10}
            maximumValue={100}
            step={1}
            value={shaftDiameter[0]}
            onValueChange={(value) => setShaftDiameter([value])}
            style={styles.slider}
          />
          <Text>Đường kính trục: {shaftDiameter[0]} mm</Text>

          <Button mode="contained" onPress={() => handleShaftDiameterSelect(shaftDiameter)} style={styles.mainBtnMedium}>
            Xác nhận
          </Button>

          <Button mode="outlined" onPress={closeShaftDiameterModal} style={styles.mainBtnSmall}>
            Hủy
          </Button>
        </View>
      </Modal>

      {/* Footer */}
      <CalcFooter />
    </ScrollView>
  );
}
