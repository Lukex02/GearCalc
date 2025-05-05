import React, { useState } from "react";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { Button, IconButton, Modal, Portal } from "react-native-paper";
import styles from "@style/MainStyle";
import DatabaseService from "@services/DatabaseService";
import { FontAwesome5 } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import CalcFooterStyle from "@/src/style/CalcFooterStyle";
import { Colors } from "@/src/style/Colors";

export default function LogOutComponent() {
  const [modalVisible, setModalVisible] = useState(false);

  const logOut = () => {
    DatabaseService.logOut();
    router.push("../../");
    setModalVisible(false);
    alert("Đăng xuất thành công");
  };

  return (
    <View>
      <IconButton
        icon="logout"
        iconColor="white"
        onPress={() => setModalVisible(true)}
        style={{ margin: 0 }}
        size={30}
      />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={styles.overlay}>
          <View style={styles.modalView}>
            <FontAwesome5 name="exclamation-triangle" size={scale(30)} color={Colors.primary} />
            <Text style={styles.modalMediumTxt}>Bạn có chắc chắn muốn đăng xuất không?</Text>
            <View style={CalcFooterStyle.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...styles.mainBtnSmall, backgroundColor: "gray" }}
                labelStyle={{ ...styles.mainBtnSmallTxt, color: "white" }}
                onPress={() => setModalVisible(false)}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Đóng
              </Button>
              <Button
                mode="contained"
                style={styles.mainBtnSmall}
                labelStyle={styles.mainBtnSmallTxt}
                onPress={logOut}
              >
                Đồng ý
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
