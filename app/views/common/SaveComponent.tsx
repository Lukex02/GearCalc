import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { Button, IconButton, Modal, Portal, Snackbar } from "react-native-paper";
import styles from "@style/MainStyle";
import CalcFooterStyle from "@/src/style/CalcFooterStyle";
import { Colors } from "@/src/style/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import CalcController from "@/src/controller/CalcController";
import DatabaseService from "@/src/services/DatabaseService";

export default function SaveComponent() {
  const [modalVisible, setModalConfirmVisible] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);

  const handleSave = () => {
    const calcController = CalcController.getInstance();
    DatabaseService.updateUserHistory(calcController.getGearBox(), new Date().toLocaleString()).then(() => {
      setModalConfirmVisible(false);
      setsnackBarVisible(true);
    });
  };

  return (
    <View>
      <IconButton
        icon="content-save-cog"
        iconColor={Colors.text.primary}
        onPress={() => setModalConfirmVisible(true)}
        style={{ margin: 0 }}
        size={30}
      />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalConfirmVisible(false)} style={styles.overlay}>
          <View style={styles.modalView}>
            <FontAwesome5 name="exclamation-triangle" size={scale(30)} color={Colors.primary} />
            <Text style={styles.modalMediumTxt}>Bạn có chắc chắn muốn lưu thiết kế hiện tại không?</Text>
            <View style={CalcFooterStyle.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...styles.mainBtnSmall, backgroundColor: "gray" }}
                labelStyle={{ ...styles.mainBtnSmallTxt, color: "white" }}
                onPress={() => setModalConfirmVisible(false)}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Đóng
              </Button>
              <Button
                mode="contained"
                style={styles.mainBtnSmall}
                labelStyle={styles.mainBtnSmallTxt}
                onPress={handleSave}
              >
                Đồng ý
              </Button>
            </View>
          </View>
        </Modal>
        <Snackbar
          visible={snackBarVisible}
          onDismiss={() => setsnackBarVisible(false)}
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
    </View>
  );
}
