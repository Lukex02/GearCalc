import { View, TouchableOpacity, Text, Alert } from "react-native";
import styles from "@style/CalcFooterStyle";
import { Href, router } from "expo-router";
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
      <TouchableOpacity style={styles.cancelBtn} onPress={handleBackPress}>
        <Text style={styles.cancelBtnText}>{backTxt ? backTxt : "Quay lại"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinuePress}>
        <Text style={styles.continueBtnText}>{nextTxt ? nextTxt : "Tiếp tục"}</Text>
      </TouchableOpacity>
    </View>
  );
}
