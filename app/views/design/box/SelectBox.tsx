import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import styles from "@style/MainStyle";
import { Colors } from "@style/Colors";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import CalcFooter from "@/views/common/CalcFooter";
import { verticalScale, scale } from "react-native-size-matters";

const boxData = [
  {
    id: "box1",
    name: "Hộp số loại A",
    image: require("../box/box_1.png"),
    specs: {
      thickness: 15,
      rib: 10,
      diameter: 150,
      flange: 80,
      bearingSize: 60,
      baseSize: 200,
      clearance: 2,
      boltCount: 6,
    },
  },
  {
    id: "box2",
    name: "Hộp số loại B",
    image: require("../box/box_2.png"),
    specs: {
      thickness: 18,
      rib: 12,
      diameter: 180,
      flange: 90,
      bearingSize: 70,
      baseSize: 220,
      clearance: 3,
      boltCount: 8,
    },
  },
  {
    id: "box3",
    name: "Hộp số loại C",
    image: require("../box/box_3.png"), 
    specs: {
      thickness: 20,
      rib: 15,
      diameter: 200,
      flange: 100,
      bearingSize: 80,
      baseSize: 250,
      clearance: 4,
      boltCount: 10,
    },
  },
];

const boxLabel = {
  thickness: "Chiều dày thành hộp",
  rib: "Gân tăng cứng",
  diameter: "Đường kính hộp",
  flange: "Mặt bích ghép nắp và thân",
  bearingSize: "Kích thước gối trục",
  baseSize: "Kích thước mặt đế",
  clearance: "Khe hở giữa các chi tiết",
  boltCount: "Số lượng bu lông nền (Z)",
};

export default function SelectBoxScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBox, setSelectedBox] = useState<typeof boxData[0] | null>(null);

  const handleSelectBox = (box: typeof boxData[0]) => {
    setSelectedBox(box);
    setModalVisible(true);
  };

  const handleChange = () => {
    setModalVisible(false);
    setSelectedBox(null);
  };

  const handleValidation = () => {
    if (!selectedBox) {
      alert("Vui lòng chọn một hộp số!");
      return false;
    }
    return true;
  };

  return (
    <View style={styles.container}>
      <Header title="Chọn hộp số" rightIcon={<SaveComponent />} />
      <View style={styles.inputContainer}>
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Chọn mẫu hộp số có sẵn</Text>
          <FlatList
            data={boxData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={localStyles.itemContainer}>
                <Text style={styles.paramType}>{item.name}</Text>
                <Button
                  mode="contained"
                  onPress={() => handleSelectBox(item)}
                  style={styles.mainBtnSmall}
                  labelStyle={styles.mainBtnSmallTxt}
                >
                  Chọn
                </Button>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={localStyles.separator} />}
          />
        </View>
      </View>
      <CalcFooter onValidate={handleValidation} nextPage={"/home"} />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.overlay}>
          {selectedBox && (
            <View style={styles.modalView}>
              <Text style={styles.pageTitle}>Thông số hộp số</Text>
              <Image 
                source={selectedBox.image} 
                style={localStyles.modalImage}
                resizeMode="contain"
              />
              <View style={localStyles.specsContainer}>
                <FlatList
                  data={Object.entries(selectedBox.specs)}
                  keyExtractor={([key]) => key}
                  renderItem={({ item }) => {
                    const [key, value] = item;
                    return (
                      <Text style={localStyles.specText}>
                        - {boxLabel[key as keyof typeof boxLabel]}: {value} {key === "boltCount" ? "cái" : "mm"}
                      </Text>
                    );
                  }}
                  contentContainerStyle={localStyles.specsList}
                />
              </View>
              <View style={localStyles.buttonFooter}>
                <Button
                  mode="contained"
                  style={{ ...styles.mainBtnSmall, backgroundColor: Colors.text.error }}
                  labelStyle={{ ...styles.mainBtnSmallTxt, color: Colors.text.primary }}
                  onPress={handleChange}
                >
                  Thay đổi
                </Button>
                <Button
                  mode="contained"
                  style={{ ...styles.mainBtnSmall, backgroundColor: Colors.text.success }}
                  labelStyle={styles.mainBtnSmallTxt}
                  onPress={() => setModalVisible(false)}
                >
                  Xác nhận
                </Button>
              </View>
            </View>
          )}
        </Modal>
      </Portal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  itemContainer: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(20),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  separator: {
    height: 1,
    backgroundColor: Colors.border.primary,
    marginVertical: verticalScale(8),
  },
  modalImage: {
    width: '100%',
    height: verticalScale(220),
    marginVertical: verticalScale(15),
  },
  specsContainer: {
    flex: 1,
    width: '100%',
    maxHeight: verticalScale(300),
  },
  specsList: {
    paddingBottom: verticalScale(20),
  },
  specText: {
    fontSize: verticalScale(12),
    lineHeight: verticalScale(18),
    paddingVertical: verticalScale(8),
    color: Colors.text.primary,
    textAlign: "left",
  },
  buttonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
    gap: scale(10),
  },
});