import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image } from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import styles from "@style/MainStyle";
import { Colors } from "@style/Colors";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import CalcFooter from "@/views/common/CalcFooter";
import { verticalScale, scale } from "react-native-size-matters";
import CalcFooterStyle from "@style/CalcFooterStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { boxLabel, shaftBearinglabel, transverseLabel, jointLabel, verticalLabel } from "@views/common/Label";
import CalcController from "@controller/CalcController";

const boxData = [
  {
    type: "transverse",
    name: "Mặt cắt ngang",
    image: require("@img/GB1/box_1.png"),
    specs: {},
  },
  {
    type: "joint",
    name: "Bề mặt ghép nắp và thân",
    image: require("@img/GB1/box_2.png"),
    specs: {},
  },
  {
    type: "vertical",
    name: "Mặt cắt dọc",
    image: require("@img/GB1/box_3.png"),
    specs: {},
  },
];

export default function SelectBoxScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  // const [boxData, setBoxData] = useState<any>({});
  const [selectedBox, setSelectedBox] = useState<any | null>(null);
  const calcController = CalcController.getInstance();

  const handleSelectBox = (box: any) => {
    setSelectedBox(box);
    setModalVisible(true);
  };

  useEffect(() => {
    const calcBox = calcController.calcBox();
    boxData.forEach((data) => {
      if (data.type === "transverse") {
        data.specs = calcBox.getTransverseData();
      } else if (data.type === "joint") {
        data.specs = calcBox.getJointData();
      } else if (data.type === "vertical") {
        data.specs = calcBox.getVerticalData();
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Thiết kế vỏ hộp" rightIcon={<SaveComponent />} />
      <View style={styles.inputContainer}>
        <View style={styles.tableContainer}>
          <Text style={styles.tableTitle}>Thông số các mặt</Text>
          <FlatList
            data={boxData}
            keyExtractor={(item) => item.type}
            renderItem={({ item }) => (
              <View style={localStyles.itemContainer}>
                <Text style={styles.paramType}>{item.name}</Text>
                <Button
                  mode="contained"
                  onPress={() => handleSelectBox(item)}
                  style={styles.mainBtnSmall}
                  labelStyle={styles.mainBtnSmallTxt}
                >
                  Xem
                  <MaterialCommunityIcons name="file-find" size={16} color="black" />
                </Button>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={localStyles.separator} />}
          />
        </View>
      </View>
      <CalcFooter nextPage={"/views/design/lubricant/LubricantSelect"} />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.overlay}>
          {selectedBox && (
            <View style={styles.modalView}>
              <Text style={styles.pageTitle}>Thông số</Text>
              <Image source={selectedBox.image} style={localStyles.modalImage} resizeMode="contain" />
              <View style={localStyles.specsContainer}>
                <FlatList
                  data={Object.entries(selectedBox.specs)}
                  keyExtractor={([key]) => key}
                  style={{ maxHeight: verticalScale(250) }}
                  renderItem={({ item }) => {
                    const [key, value] = item;
                    return (
                      <Text style={localStyles.specText}>
                        {"- "}
                        {selectedBox.type === "transverse"
                          ? transverseLabel[key as keyof typeof transverseLabel]
                          : selectedBox.type === "joint"
                          ? jointLabel[key as keyof typeof jointLabel]
                          : verticalLabel[key as keyof typeof verticalLabel]}
                        :{" "}
                        {key === "_shaftBearing"
                          ? selectedBox.specs[key as keyof typeof boxLabel].map(
                              (shaftBearing: any, index: number) => {
                                return (
                                  <View key={index} style={{ width: "100%" }}>
                                    <Text style={{ fontStyle: "italic" }}>* Trục {index + 1}</Text>
                                    {Object.keys(shaftBearinglabel).map((shaftBearingKey) => {
                                      return (
                                        <Text key={shaftBearingKey} style={styles.bottomSheetSmallTxt}>
                                          {"+ "}
                                          {
                                            shaftBearinglabel[
                                              shaftBearingKey as keyof typeof shaftBearinglabel
                                            ]
                                          }
                                          : {shaftBearing[shaftBearingKey as keyof typeof shaftBearinglabel]}
                                        </Text>
                                      );
                                    })}
                                  </View>
                                );
                              }
                            )
                          : selectedBox.specs[
                              key as keyof typeof transverseLabel & typeof jointLabel & typeof verticalLabel
                            ]}
                      </Text>
                    );
                  }}
                />
              </View>
              <Button
                mode="contained"
                style={{ ...styles.mainBtnSmall, backgroundColor: Colors.text.error }}
                labelStyle={{ ...styles.mainBtnSmallTxt, color: Colors.text.primary }}
                onPress={() => setModalVisible(false)}
              >
                Thoát
              </Button>
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
    width: "100%",
    maxHeight: verticalScale(250),
  },
  specsContainer: {
    flex: 1,
    width: "100%",
    maxHeight: verticalScale(300),
  },
  specText: {
    fontSize: verticalScale(11),
    lineHeight: verticalScale(25),
    color: Colors.text.primary,
    textAlign: "left",
  },
});
