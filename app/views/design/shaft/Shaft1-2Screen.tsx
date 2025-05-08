import React, { useState, useEffect } from "react";
import { View, Text, Modal } from "react-native";
import { Button } from "react-native-paper";
import Slider from "@react-native-community/slider";
import styles from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import Utils, { ForceOnShaftDataPoint } from "@services/Utils";

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
  const [isModalVisible, setModalVisible] = useState(false);
  const [shaftDiameter, setShaftDiameter] = useState<number[]>([30]);
  const [shaftData, setShaftData] = useState<any>(null);
  const [selectedDiameter, setSelectedDiameter] = useState<number>(30);

  // Gọi phương thức tính toán trục khi thay đổi đường kính
  const updateShaftData = () => {
    const calcController = CalcController.getInstance();

    if (calcController && typeof calcController.calcShaft === 'function') {
      const hubParam = {
        hub_d_x_brt: 1.5,  // Giá trị tùy chỉnh cho hub_d_x_brt
        hub_kn_tvdh: 2.3,   // Giá trị tùy chỉnh cho hub_kn_tvdh
      };

      // Tính toán lại với đường kính mới
      calcController.calcShaft({
        sigma_b: materialStats.sigma_b,
        sigma_ch: materialStats.sigma_ch,
        HB: materialStats.HB_min,
      });

      // Lấy lại dữ liệu đồ thị sau khi tính toán
      const shaftDiagram = calcController.getShaftDiagram();
      setShaftData(shaftDiagram);
    } else {
      console.error("calcShaft method is not available in calcController");
    }
  };

  // Gọi phương thức tính toán khi thay đổi đường kính trục
  useEffect(() => {
    updateShaftData(); // Cập nhật số liệu khi load trang
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
  const handleShaftDiameterSelect = () => {
    setShaftDiameter([selectedDiameter]);
    updateShaftData();
    closeShaftDiameterModal();
  };

  // Hàm hiển thị các thông số vật liệu
  const renderMaterialStats = () => {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>Sigma_b: {materialStats.sigma_b} MPa</Text>
        <Text style={styles.resultText}>Sigma_ch: {materialStats.sigma_ch} MPa</Text>
        <Text style={styles.resultText}>HB Min: {materialStats.HB_min}</Text>
        <Text style={styles.resultText}>HB Max: {materialStats.HB_max}</Text>
        <Text style={styles.resultText}>S_max: {materialStats.S_max} mm</Text>
      </View>
    );
  };
// đồ thị
  const renderShaftDiagram = () => {
    if (!shaftData) return <Text style={styles.noDataWarn}>Đang tải đồ thị...</Text>;

    const data: ForceOnShaftDataPoint[] = shaftData.Shaft1.Q1x.map((point: { x: number, y: number }) => ({
      x: point.x,
      y: point.y,
    }));

    return (
      <View style={styles.resultContainer}>
        <Text style={styles.tableTitle}>Biểu đồ lực tác dụng lên trục I</Text>
        <Utils.ForceOnShaftDiagram
          data={data}
          fillColor="rgba(0, 0, 255, 0.2)"
          lineColor="blue"
        />
      </View>
    );
  };

  return (
    <View style={styles.containerStart}>  
      <Text style={styles.componentTitle}>{materialStats.label}</Text>

      {/* Hiển thị các thông số vật liệu */}
      {renderMaterialStats()}

      {/* Hiển thị đường kính trục đã chọn */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Đường kính trục đã chọn: {shaftDiameter[0]} mm
        </Text>
      </View>

      {/* Hiển thị nút để chọn đường kính trục */}
      <Button 
        mode="contained" 
        onPress={openShaftDiameterModal} 
        style={styles.mainBtn}
        labelStyle={styles.mainBtnTxt}
      >
        Chọn đường kính trục
      </Button>

      {/* Hiển thị đồ thị trục nếu có */}
      {renderShaftDiagram()}

      {/* Modal để chọn đường kính trục */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={closeShaftDiameterModal}
        transparent={true}
      >
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalMediumTxt}>Chọn đường kính trục</Text>
            
            <Slider
              minimumValue={10}
              maximumValue={100}
              step={1}
              value={selectedDiameter}
              onValueChange={(value) => setSelectedDiameter(value)}
              style={styles.slider}
            />
            
            <Text style={styles.modalMediumTxt}>
              Đường kính trục: {selectedDiameter} mm
            </Text>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button 
                mode="contained" 
                onPress={handleShaftDiameterSelect} 
                style={styles.mainBtnMedium}
                labelStyle={styles.mainBtnMediumTxt}
              >
                Xác nhận
              </Button>

              <Button 
                mode="outlined" 
                onPress={closeShaftDiameterModal} 
                style={styles.mainBtnSmall}
                labelStyle={styles.mainBtnSmallTxt}
              >
                Hủy
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <CalcFooter nextPage={"/views/design/shaft/Shaft3-4Screen"} />
    </View>
  );
}
