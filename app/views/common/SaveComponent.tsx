import React, { useState, useMemo, useRef, useCallback } from "react";
import { View, Text } from "react-native";
import { Button, IconButton, Modal, Portal, Snackbar } from "react-native-paper";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import styles from "@style/MainStyle";
import CalcFooterStyle from "@/src/style/CalcFooterStyle";
import { Colors } from "@/src/style/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import CalcController, { DesignGearBox1 } from "@/src/controller/CalcController";
import DatabaseService from "@/src/services/DatabaseService";
import Header from "./Header";
import LoadingScreen from "./LoadingScreen";
import * as Label from "@/views/common/Label";
import CalculatedChain from "@/src/models/Chain";
import GearSet from "@/src/models/Gear";
import CalculatedShaft from "@/src/models/Shaft";

export default function SaveComponent() {
  const [modalSaveVisible, setModalConfirmSaveVisible] = useState(false);
  const [snackBarSaveVisible, setSnackBarSaveVisible] = useState(false);

  const sheetRef = useRef<BottomSheet>(null);
  const data = useMemo(
    () => ["_type", "_design", "_calcEnginePostStats", "_engine", "_mechDrive", "_gearSet", "_shaft"], // ! Cần thêm điều kiện thiết kế trong _design.designStrategy._designInputStats
    []
  );

  const snapPoints = useMemo(() => ["20%", "88%"], []);

  const handleSnapPress = useCallback((index: number) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  const renderStats = useCallback((item: any, type: string, index?: number) => {
    // console.log(type, item);
    if (type === "_calcEnginePostStats") {
      return (
        <View>
          {/* Công suất trên các trục p */}
          <Text style={styles.bottomSheetSmallBoldTxt}>Công suất trên các trục P:</Text>
          {item.distShaft.p.map((P: any, index: number) => (
            <Text key={index} style={styles.bottomSheetSmallTxt}>
              -{" "}
              {index == 0
                ? "Trục động cơ"
                : index == item.distShaft.T.length - 1
                ? "Trục công tác"
                : `Trục ${index}`}
              : {P.toFixed(4)} (kW)
            </Text>
          ))}

          {/* Số vòng quay trên các trục n */}
          <Text style={styles.bottomSheetSmallBoldTxt}>Số vòng quay trên các trục n:</Text>
          {item.distShaft.n.map((n: any, index: number) => (
            <Text key={index} style={styles.bottomSheetSmallTxt}>
              {"- "}
              {index == 0
                ? "Trục động cơ"
                : index == item.distShaft.T.length - 1
                ? "Trục công tác"
                : `Trục ${index}`}
              : {n.toFixed(2)} (rpm)
            </Text>
          ))}

          {/* Momen xoắn T */}
          <Text style={styles.bottomSheetSmallBoldTxt}>Momen xoắn T:</Text>
          {item.distShaft.T.map((T: any, index: number) => (
            <Text key={index} style={styles.bottomSheetSmallTxt}>
              {"- "}
              {index == 0
                ? "Trục động cơ"
                : index == item.distShaft.T.length - 1
                ? "Trục công tác"
                : `Trục ${index}`}
              : {T.toFixed(4)} (N.mm)
            </Text>
          ))}

          {/* Tỷ số truyền u */}
          <Text style={styles.bottomSheetSmallBoldTxt}>Tỷ số truyền u:</Text>
          {item.ratio.map((u: any, index: number) => (
            <Text key={index} style={styles.bottomSheetSmallTxt}>
              {"- "}
              {u.type}: {u.value.toFixed(2)}
            </Text>
          ))}
        </View>
      );
    } else {
      const labels =
        Label[
          type === "_engine"
            ? ("engineLabel" as keyof typeof Label)
            : type === "_gearSet"
            ? ("gearSetLabel" as keyof typeof Label)
            : type === "_design"
            ? ("inputLabel" as keyof typeof Label)
            : type === "_shaft"
            ? ("shaftLabel" as keyof typeof Label)
            : ("chainLabel" as keyof typeof Label)
        ];
      const itemKeys = Object.keys(labels);
      // console.log(type === "_shaft" ? item : "ko phải shaft");
      return (
        <View key={index}>
          {index != null && (
            <Text style={styles.bottomSheetSmallBoldTxt}>Bộ truyền bánh răng {index + 1}: </Text>
          )}
          {itemKeys.map((key) => (
            <Text key={key} style={styles.bottomSheetSmallTxt}>
              {"- "}
              {labels[key as keyof typeof labels]}:{" "}
              {item instanceof CalculatedChain
                ? item.getChainPostStats()[key as keyof typeof labels] // CalculatedChain
                : item instanceof GearSet
                ? item.returnPostStats()[key as keyof typeof labels] // GearSet
                : item.designStrategy &&
                  item.designStrategy instanceof DesignGearBox1 &&
                  item.designStrategy._designInputStats
                ? typeof item.designStrategy._designInputStats[key as keyof typeof labels] === "object"
                  ? Object.keys(item.designStrategy._designInputStats[key as keyof typeof labels]).map(
                      (outputKey) => {
                        return (
                          <Text key={outputKey} style={styles.bottomSheetSmallTxt}>
                            {"\n+ "}
                            {
                              Label.outputInDesignLabel[outputKey as keyof typeof Label.outputInDesignLabel]
                            }: {item.designStrategy._designInputStats[key as keyof typeof labels][outputKey]}
                          </Text>
                        );
                      }
                    )
                  : item.designStrategy._designInputStats[key as keyof typeof labels] // DesignStrategy
                : Array.isArray(item[key])
                ? item[key].join(`, `)
                : item[key]}
            </Text>
          ))}
        </View>
      );
    }
  }, []);
  const renderItem = useCallback(({ item }: { item: string }) => {
    const calcController = CalcController.getInstance();
    const gearBox = calcController.getGearBox();
    const stats = gearBox[item as keyof typeof gearBox];
    // console.log(stats);
    return (
      <View key={item} style={styles.bottomSheetContent}>
        <Text style={styles.bottomSheetLargeTxt}>
          {Label.mainlabel[item as keyof typeof Label.mainlabel]}: {item === "_type" && stats}
        </Text>
        {(stats && !Array.isArray(stats)) || (Array.isArray(stats) && stats.length > 0) ? (
          <View>
            {Array.isArray(stats)
              ? stats.map((stat, index) => renderStats(stat, item, index))
              : item !== "_type" && renderStats(stats, item)}
          </View>
        ) : (
          <View>{item !== "_type" && <LoadingScreen size={20} />}</View>
        )}
      </View>
    );
  }, []);

  const handleSave = () => {
    const calcController = CalcController.getInstance();
    DatabaseService.updateUserHistory(calcController.getGearBox(), new Date().toLocaleString(), false).then(
      () => {
        setModalConfirmSaveVisible(false);
        setSnackBarSaveVisible(true);
      }
    );
  };

  return (
    <View>
      <IconButton
        icon="history"
        iconColor={Colors.text.primary}
        onPress={() => handleSnapPress(0)}
        style={{ margin: 0 }}
        size={30}
      />
      <Portal>
        <Modal
          visible={modalSaveVisible}
          onDismiss={() => setModalConfirmSaveVisible(false)}
          style={styles.overlay}
        >
          <View style={styles.modalView}>
            <FontAwesome5 name="save" size={scale(50)} color={Colors.text.secondaryAccent} />
            <Text style={styles.modalMediumTxt}>Bạn có chắc chắn muốn lưu thiết kế hiện tại không?</Text>
            <View style={CalcFooterStyle.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...styles.mainBtnSmall, backgroundColor: "gray" }}
                labelStyle={{ ...styles.mainBtnSmallTxt, color: "white" }}
                onPress={() => setModalConfirmSaveVisible(false)}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Đóng
              </Button>
              <Button
                mode="contained"
                style={{ ...styles.mainBtnSmall, backgroundColor: Colors.text.secondaryAccent }}
                labelStyle={styles.mainBtnSmallTxt}
                onPress={handleSave}
              >
                Đồng ý
              </Button>
            </View>
          </View>
        </Modal>
        <Snackbar
          visible={snackBarSaveVisible}
          onDismiss={() => setSnackBarSaveVisible(false)}
          duration={2000}
          style={{
            ...styles.overlay,
            backgroundColor: Colors.cardDark,
            borderRadius: 30,
          }}
        >
          <Text style={styles.modalMediumTxt}>Đã lưu thành công!</Text>
        </Snackbar>
      </Portal>
      <Portal>
        <BottomSheet
          index={-1}
          ref={sheetRef}
          snapPoints={snapPoints}
          enableDynamicSizing={false}
          enablePanDownToClose
          backgroundStyle={{ backgroundColor: Colors.cardDark }}
          handleIndicatorStyle={{ backgroundColor: Colors.primary }}
          handleStyle={{
            backgroundColor: "rgba(92, 92, 92, 0.4)",
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
          }}
        >
          <View style={{ padding: scale(10), backgroundColor: Colors.card }}>
            <Header
              title="Trạng thái"
              rightIcon={
                <IconButton
                  icon="content-save"
                  iconColor={Colors.text.secondaryAccent}
                  onPress={() => {
                    handleClosePress();
                    setModalConfirmSaveVisible(true);
                  }}
                  style={{ margin: 0 }}
                  size={30}
                />
              }
              leftIcon={
                <IconButton
                  icon="close"
                  iconColor={Colors.text.error}
                  onPress={() => handleClosePress()}
                  style={{ margin: 0 }}
                  size={30}
                />
              }
            />
          </View>
          <BottomSheetFlatList
            data={data}
            keyExtractor={(item: any) => item}
            renderItem={renderItem}
            contentContainerStyle={styles.bottomSheetFlatListContainer}
          />
        </BottomSheet>
      </Portal>
    </View>
  );
}
