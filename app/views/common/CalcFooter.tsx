import { View, Text } from "react-native";
import styles from "@style/CalcFooterStyle";
import MainStyle from "@/src/style/MainStyle";
import { Href, router } from "expo-router";
import { Button, IconButton, Portal, Modal } from "react-native-paper";
import Colors from "@/src/style/Colors";
import { FontAwesome5 } from "@expo/vector-icons";
import CalcFooterStyle from "@style/CalcFooterStyle";
import { scale } from "react-native-size-matters";
import { useState } from "react";
interface CalcFooterProp {
  backHome?: boolean;
  nextIcon?: string;
  backPage?: Href;
  nextPage?: Href;
  onValidate?: () => boolean;
}

export default function CalcFooter({ backHome, nextIcon, backPage, nextPage, onValidate }: CalcFooterProp) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleContinuePress = () => {
    if ((!onValidate || onValidate()) && nextPage) {
      router.push(nextPage);
    }
  };

  const handleBackHome = () => {
    router.back();
  };
  const handleBackPress = () => {
    if (backHome) {
      setModalVisible(true);
    } else if (backPage) router.push(backPage);
    else router.back(); // Quay lại trang trước
  };
  return (
    <View style={styles.buttonFooter}>
      <IconButton
        icon={backHome ? "home" : "arrow-left"}
        size={30}
        iconColor={backHome ? Colors.text.error : Colors.text.primary}
        style={{ backgroundColor: "transparent" }}
        onPress={handleBackPress}
      />
      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} style={MainStyle.overlay}>
          <View style={MainStyle.modalView}>
            <FontAwesome5 name="exclamation-triangle" size={scale(30)} color={Colors.primary} />
            <Text style={MainStyle.modalMediumTxt}>Bạn có chắc chắn muốn quay về trang chủ không?</Text>
            <Text style={{ ...MainStyle.modalMediumTxt, fontStyle: "italic" }}>(Mọi thay đổi sẽ bị mất)</Text>
            <View style={styles.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...MainStyle.mainBtnSmall, backgroundColor: "gray" }}
                labelStyle={{ ...MainStyle.mainBtnSmallTxt, color: "white" }}
                onPress={() => setModalVisible(false)}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Đóng
              </Button>
              <Button
                mode="contained"
                style={{ ...MainStyle.mainBtnSmall, backgroundColor: Colors.text.error }}
                labelStyle={{ ...MainStyle.mainBtnSmallTxt, color: "white" }}
                onPress={handleBackHome}
              >
                Đồng ý
              </Button>
            </View>
          </View>
        </Modal>
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
    </View>
  );
}
