import { View, Text } from "react-native";
import styles from "@style/CalcFooterStyle";
import MainStyle from "@/src/style/MainStyle";
import { Href, router } from "expo-router";
import { Button, IconButton, Portal, Modal, Snackbar } from "react-native-paper";
import Colors from "@/src/style/Colors";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import { useState } from "react";
import DatabaseService from "@/src/services/DatabaseService";
import CalcController from "@/src/controller/CalcController";

interface CalcFooterProp {
  backHome?: boolean;
  nextIcon?: string;
  finish?: boolean;
  nextPage?: Href;
  isComponentPage?: boolean;
  onValidate?: () => boolean;
}

export default function CalcFooter({
  backHome,
  nextIcon,
  finish,
  nextPage,
  isComponentPage,
  onValidate,
}: CalcFooterProp) {
  const [modalHomeVisible, setModalHomeVisible] = useState(false);
  const [modalFinishVisible, setModalFinishVisible] = useState(false);
  const [snackBarSaveVisible, setSnackBarSaveVisible] = useState(false);

  const handleContinuePress = () => {
    if ((!onValidate || onValidate()) && nextPage) {
      router.push(nextPage);
    }
  };
  const handleBackPress = () => {
    router.back(); // Quay lại trang trước
  };

  const handleBackHome = () => {
    setModalHomeVisible(true);
  };
  const goBackHome = () => {
    setModalHomeVisible(false);
    router.push("/(tabs)/home");
  };

  const saveAndGoHome = () => {
    DatabaseService.updateUserHistory(
      CalcController.getInstance().getGearBox(),
      new Date().toLocaleString(),
      true
    ).then(() => {
      setModalFinishVisible(false);
      setSnackBarSaveVisible(true);
      router.push("/(tabs)/home");
    });
  };
  const handleFinishPress = () => {
    setModalFinishVisible(true);
  };
  return (
    <View style={styles.buttonFooter}>
      {!backHome && (
        <IconButton
          icon={"arrow-left"}
          size={30}
          iconColor={Colors.text.primary}
          style={{ backgroundColor: "transparent" }}
          onPress={handleBackPress}
        />
      )}
      {!isComponentPage && (
        <IconButton
          icon={"home"}
          size={30}
          iconColor={Colors.text.error}
          style={{ backgroundColor: "transparent" }}
          onPress={handleBackHome}
        />
      )}
      <Portal>
        <Modal
          visible={modalHomeVisible}
          onDismiss={() => setModalHomeVisible(false)}
          style={MainStyle.overlay}
        >
          <View style={MainStyle.modalView}>
            <FontAwesome5 name="exclamation-triangle" size={scale(30)} color={Colors.primary} />
            <Text style={MainStyle.modalMediumTxt}>Bạn có chắc chắn muốn quay về trang chủ không?</Text>
            <Text style={{ ...MainStyle.modalMediumTxt, fontStyle: "italic" }}>(Mọi thay đổi sẽ bị mất)</Text>
            <View style={styles.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...MainStyle.mainBtnSmall, backgroundColor: "gray" }}
                labelStyle={{ ...MainStyle.mainBtnSmallTxt, color: "white" }}
                onPress={() => setModalHomeVisible(false)}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Đóng
              </Button>
              <Button
                mode="contained"
                style={{ ...MainStyle.mainBtnSmall, backgroundColor: Colors.text.error }}
                labelStyle={{ ...MainStyle.mainBtnSmallTxt, color: "white" }}
                onPress={goBackHome}
              >
                Đồng ý
              </Button>
            </View>
          </View>
        </Modal>
        <Modal
          visible={modalFinishVisible}
          onDismiss={() => setModalFinishVisible(false)}
          style={MainStyle.overlay}
        >
          <View style={MainStyle.modalView}>
            <MaterialIcons name="cloud-done" size={scale(100)} color={Colors.text.success} />
            <Text style={MainStyle.modalMediumTxt}>
              Bạn có chắc chắn muốn hoàn tất thiết kế và lưu không?
            </Text>
            <View style={styles.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...MainStyle.mainBtnSmall, backgroundColor: "gray" }}
                labelStyle={{ ...MainStyle.mainBtnSmallTxt, color: "white" }}
                onPress={() => setModalFinishVisible(false)}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Đóng
              </Button>
              <Button
                mode="contained"
                style={{ ...MainStyle.mainBtnSmall, backgroundColor: Colors.text.success }}
                labelStyle={MainStyle.mainBtnSmallTxt}
                onPress={saveAndGoHome}
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
            ...MainStyle.overlay,
            backgroundColor: Colors.cardDark,
            borderRadius: 30,
          }}
        >
          <Text style={MainStyle.modalMediumTxt}>Đã lưu thành công!</Text>
        </Snackbar>
      </Portal>
      {nextPage && (
        <IconButton
          icon={nextIcon ? nextIcon : "arrow-right"}
          size={30}
          iconColor={Colors.text.accent}
          style={{ backgroundColor: "transparent" }}
          onPress={handleContinuePress}
        />
      )}
      {finish && (
        <IconButton
          icon="check-underline"
          size={30}
          iconColor={Colors.text.success}
          style={{ backgroundColor: "transparent" }}
          onPress={handleFinishPress}
        />
      )}
    </View>
  );
}
