import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router"; // Để sử dụng router
// import styles from "../style/DesignSelectionStyle"; // Sử dụng style đã tạo
import styles from "../style/MainStyle"; // Sử dụng style đã tạo
import CalcFooter from "./CalcFooter";

export default function DesignSelectionScreen() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const [gearBoxType, setGearBoxType] = useState<any>("");
  const [image, setImage] = useState(null); // Biến để lưu ảnh của hộp giảm tốc
  const [open, setOpen] = useState(false);
  const gearBoxOptions = [
    { label: "Hộp giảm tốc hai cấp khai triển", value: "GearBox1" },
    { label: "Hộp giảm tốc trục vít - bánh răng", value: "GearBox2" },
  ];
  const gearBoxImage = {
    GearBox1: require("../img/GearBox1Template.png"),
    GearBox2: require("../img/GearBox2Template.png"),
  };
  const [items, setItems] = useState(
    gearBoxOptions.map((option) => ({
      label: option.label,
      value: option.value,
    }))
  );

  useEffect(() => {
    setImage(gearBoxImage[gearBoxType as keyof typeof gearBoxImage]);
  }, [gearBoxType]);

  const handleValidation = () => {
    // Kiểm tra giá trị của gearBoxType trước khi truyền
    if (gearBoxType) {
      // Nếu gearBoxType có giá trị, chuyển đến trang InputDataScreen với query string
      if (gearBoxType == "GearBox2") {
        alert("Loại hộp giảm tốc này hiện tại chưa hỗ trợ!");
        Alert.alert("Thông báo", "Loại hộp giảm tốc này hiện tại chưa hỗ trợ!");
        return false;
      } else return true;
      // else router.push({ pathname: "/src/views/InputDataScreen", params: { gearBoxType: gearBoxType } });
    } else {
      alert("Vui lòng chọn loại thiết kế");
      Alert.alert("Thông báo", "Vui lòng chọn loại thiết kế");
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Thiết kế hộp giảm tốc</Text>
      </View>

      <DropDownPicker
        open={open}
        value={gearBoxType}
        items={items}
        setOpen={setOpen}
        setValue={setGearBoxType}
        setItems={setItems}
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        placeholder="Loại hộp giảm tốc"
      />
      <Text style={styles.pageTitle}>Bản vẽ thiết kế</Text>
      <Image style={styles.designImgPreview} source={image ? image : undefined} resizeMode="stretch" />

      <CalcFooter
        backTxt="Thoát"
        backPage="./Home"
        onValidate={handleValidation}
        nextPage={{ pathname: "/src/views/InputDataScreen", params: { gearBoxType: gearBoxType } }}
      />
    </View>
  );
}
