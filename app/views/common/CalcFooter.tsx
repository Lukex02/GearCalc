import { View, TouchableOpacity, Text, Alert } from "react-native";
import styles from "@style/CalcFooterStyle";
import { Href, router } from "expo-router";
import { Button } from "react-native-paper";
interface CalcFooterProp {
  backTxt?: string;
  nextTxt?: string;
  backPage?: Href;
  nextPage: Href;
  onValidate?: () => boolean;
}

export default function CalcFooter({ backTxt, nextTxt, backPage, nextPage, onValidate }: CalcFooterProp) {
  const handleContinuePress = () => {
    if (!onValidate || onValidate()) {
      router.push(nextPage);
    }
  };

  const handleBackPress = () => {
    if (backPage) router.push(backPage);
    else router.back(); // Quay lại trang trước
  };
  return (
    <View style={styles.buttonFooter}>
      <Button style={styles.cancelBtn} onPress={handleBackPress} mode="contained" compact={true}>
        <Text style={styles.cancelBtnText}>{backTxt ? backTxt : "Quay lại"}</Text>
      </Button>

      <Button style={styles.continueBtn} onPress={handleContinuePress} mode="contained" compact={true}>
        <Text style={styles.continueBtnText}>{nextTxt ? nextTxt : "Tiếp tục"}</Text>
      </Button>
    </View>
  );
}
