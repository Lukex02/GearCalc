import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, Text, Dimensions, Image } from "react-native";
import { Button, Portal, Modal } from "react-native-paper";
import { Slider } from "react-native-awesome-slider";
import styles, { sliderTheme } from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import Utils, { ForceOnShaftDataPoint } from "@services/Utils";
import { scale, verticalScale } from "react-native-size-matters";
import Colors from "@/src/style/Colors";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import { useSharedValue, SharedValue } from "react-native-reanimated";
import { FontAwesome6 } from "@expo/vector-icons";
import CalcFooterStyle from "@/src/style/CalcFooterStyle";
import Carousel, { Pagination } from "react-native-reanimated-carousel";

// Bảng Data cứng khi chọn luôn vật liệu là Thép 45 - Thường hóa chế tạo (Input)
const materialStats = {
  label: "Vật liệu chế tạo trục",
  sigma_b: 600,
  sigma_ch: 340,
  HB_min: 170,
  HB_max: 217,
  S_max: 60,
};
const width = Dimensions.get("window").width;

export default function Shaft1_2Screen() {
  const progress = useSharedValue<number>(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [shaftDiameter, setShaftDiameter] = useState<number[]>([]);
  const [shaftDataDiagram, setShaftDataDiagram] = useState<
    | {
        onShaft: string;
        diaName: string;
        data: { x: number; y: number }[];
      }[]
    | null
  >(null);
  const [selectedDiameter, setSelectedDiameter] = useState<number[]>([]);
  const ShaftDiaProgressValues = useRef([20, 20, 20].map((item) => useSharedValue(item))).current;

  const ShaftDiaMinValues = useSharedValue(20);
  const ShaftDiaMaxValues = useSharedValue(90);

  const calcController = CalcController.getInstance();

  // Gọi phương thức tính toán trục khi thay đổi đường kính
  const updateShaftData = () => {
    try {
      // const hubParam = {
      //   hub_d_x_brt: 1.5,  // Giá trị tùy chỉnh cho hub_d_x_brt
      //   hub_kn_tvdh: 2.3,   // Giá trị tùy chỉnh cho hub_kn_tvdh
      // };
      // Tính toán lại với đường kính mới
      const d_sb = calcController.getPreShaft({
        sigma_b: materialStats.sigma_b,
        sigma_ch: materialStats.sigma_ch,
        HB: (materialStats.HB_max + materialStats.HB_min) / 2, // Làm cứng luôn, vì về sau không quan trọng hay dùng tới
        k1: 10,
        k2: 7,
        k3: 16,
        h_n: 17,
      });
      setShaftDiameter(d_sb);
      return d_sb;
    } catch (error) {
      if (error instanceof Error) {
        alert(`Lỗi ở tính trục: ${error.message}`);
      }
    }
  };
  useEffect(() => {
    updateShaftData(); // Cập nhật số liệu khi load trang
    openShaftDiameterModal(); // Mở modal để chọn đường kính trục sau khi d sơ bộ được tính
  }, []);

  // Hàm mở modal để chọn đường kính trục
  const openShaftDiameterModal = () => {
    setModalVisible(true);
  };

  // Hàm đóng modal
  const closeShaftDiameterModal = () => {
    if (selectedDiameter.length === shaftDiameter.length) {
      // Lấy lại dữ liệu đồ thị sau khi tính toán
      calcController.chooseShaftDiamenter(selectedDiameter);
      calcController.calcShaft();
      // console.log("shaft in UI", calcController.getShaftDiagram());
      const shaftDiagram = calcController.getShaftDiagram();
      setShaftDataDiagram(
        Object.keys(shaftDiagram).flatMap((shaftNo) => {
          return Object.keys(shaftDiagram[shaftNo]).map((diaName) => {
            return { onShaft: shaftNo, diaName: diaName, data: shaftDiagram[shaftNo][diaName] };
          });
        })
      );
      setModalVisible(false);
    } else {
      alert("Vui lòng chọn đủ đường kính trục");
    }
  };

  // Hàm xử lý chọn đường kính trục và lưu vào state
  const handleShaftDiameterSelect = (index: number, value: number) => {
    const clone = [...selectedDiameter];
    clone[index] = value;
    setSelectedDiameter(clone);
  };

  // Hàm hiển thị các thông số vật liệu
  const renderMaterialStats = () => {
    return (
      <View style={{ ...styles.resultContainer, paddingVertical: verticalScale(10) }}>
        <Text style={styles.tableTitle}>{materialStats.label}</Text>
        <Text style={{ fontStyle: "italic", color: Colors.primary, fontWeight: "bold", fontSize: scale(12) }}>
          Thép 45 - Thường hóa chế tạo
        </Text>
        <Text style={{ fontStyle: "italic", color: Colors.text.success, fontSize: scale(11) }}>
          Độ rắn HB: {materialStats.HB_min} .. {materialStats.HB_max} mm
        </Text>
        <Text style={{ fontStyle: "italic", color: Colors.text.success, fontSize: scale(11) }}>
          σb = {materialStats.sigma_b} MPa, σch = {materialStats.sigma_ch} MPa, S ≤ {materialStats.S_max} mm
        </Text>
      </View>
    );
  };
  // đồ thị
  const renderShaftDiagram = () => {
    if (!shaftDataDiagram) return <Text style={styles.noDataWarn}>Đang tải đồ thị...</Text>;
    const shaftImg = {
      Shaft1: require("@img/GB1/Shaft1.png"),
      Shaft2: require("@img/GB1/Shaft2.png"),
      Shaft3: require("@img/GB1/Shaft3.png"),
    };
    return (
      <View>
        <Pagination.Basic
          progress={progress}
          data={shaftDataDiagram}
          activeDotStyle={{ backgroundColor: Colors.border.accent, borderRadius: 50 }}
          dotStyle={{ backgroundColor: Colors.overlay, borderRadius: 50 }}
          containerStyle={{ gap: 5 }}
        />
        <Carousel
          autoPlayInterval={2000}
          data={shaftDataDiagram}
          height={verticalScale(320)}
          loop={true}
          pagingEnabled={true}
          snapEnabled={true}
          width={width}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.9,
            parallaxScrollingOffset: 50,
          }}
          onProgressChange={progress}
          renderItem={({ item: diagramData, index, animationValue }) => {
            const data: ForceOnShaftDataPoint[] = diagramData.data.map(
              (point: { x: number; y: number }) => point
            );
            return (
              <View style={styles.optionCard} pointerEvents="box-none">
                <Text style={styles.tableTitle}>
                  Biểu đồ nội lực {diagramData.diaName} trên trục {diagramData.onShaft.slice(5)}
                </Text>
                <Image
                  source={shaftImg[diagramData.onShaft as keyof typeof shaftImg]}
                  style={styles.graphImg}
                  resizeMode="stretch"
                />
                <Utils.ForceOnShaftDiagram
                  xStroke={2}
                  yStroke={2}
                  labelSize={scale(10)}
                  borderColor={Colors.text.primary}
                  yUnit="N"
                  xUnit="mm"
                  diagramWidth={scale(290)}
                  diagramHeight={verticalScale(180)}
                  padding={scale(50)}
                  data={data}
                  fillColor={Colors.graph}
                  lineColor="transparent"
                />
              </View>
            );
          }}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Thông số trục" rightIcon={<SaveComponent />} />

      {/* Hiển thị các thông số vật liệu */}
      {renderMaterialStats()}

      {/* Hiển thị nút để chọn đường kính trục */}
      <Button
        mode="contained"
        compact={true}
        onPress={openShaftDiameterModal}
        style={{ ...styles.mainBtnSmall, width: "auto", paddingHorizontal: scale(10) }}
        labelStyle={styles.mainBtnSmallTxt}
      >
        Chọn đường kính trục
      </Button>

      {/* Hiển thị đồ thị trục nếu có */}
      {renderShaftDiagram()}

      {/* Modal để chọn đường kính trục */}
      <Portal>
        <Modal visible={isModalVisible} onDismiss={closeShaftDiameterModal} style={styles.overlay}>
          <View style={{ ...styles.modalView, width: "auto" }}>
            <Text style={styles.pageTitle}>Chọn đường kính trục</Text>
            <Text style={styles.resultText}>
              Đã chọn:{" "}
              <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>
                {selectedDiameter.join(", ")} mm
              </Text>
            </Text>
            {shaftDiameter &&
              shaftDiameter.map((diameter, index) => (
                <View style={{ width: "100%" }} key={index}>
                  <Slider
                    key={index}
                    theme={{
                      ...sliderTheme,
                      bubbleBackgroundColor: Colors.primary,
                    }}
                    bubble={(value) => `${Math.round(value)}`}
                    renderThumb={() => <FontAwesome6 name="diamond" size={20} color={Colors.primary} />}
                    bubbleOffsetX={5}
                    style={styles.slider}
                    forceSnapToStep={true}
                    steps={(90 - 20) / 5}
                    renderMark={({ index }) => <View></View>}
                    containerStyle={{ borderRadius: 40 }}
                    progress={ShaftDiaProgressValues[index]}
                    minimumValue={ShaftDiaMinValues}
                    maximumValue={ShaftDiaMaxValues}
                    onSlidingComplete={(value) => handleShaftDiameterSelect(index, value)}
                  />

                  <Text style={styles.modalSmallTxt}>
                    Trục {index + 1} sơ bộ: {shaftDiameter[index]} mm
                  </Text>
                </View>
              ))}

            <View>
              <Button
                mode="contained"
                onPress={closeShaftDiameterModal}
                style={{ ...styles.mainBtnSmall, backgroundColor: Colors.primary }}
                labelStyle={styles.mainBtnSmallTxt}
              >
                Xác nhận
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>

      <CalcFooter nextPage={"/views/design/shaft/Shaft3-4Screen"} />
    </View>
  );
}
