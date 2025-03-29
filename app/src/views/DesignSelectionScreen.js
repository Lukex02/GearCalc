import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router"; // Để sử dụng router
import styles from "../style/DesignSelectionStyle"; // Sử dụng style đã tạo
import calcFooter from "../style/calcFooter";

export default function DesignSelectionScreen() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const [gearBoxType, setGearBoxType] = useState("");
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
    setImage(gearBoxImage[gearBoxType]);
  }, [gearBoxType]);

  const handleContinue = () => {
    if (!gearBoxType) {
      alert("Vui lòng chọn loại thiết kế");
      return;
    }

    // Kiểm tra giá trị của gearBoxType trước khi truyền
    if (gearBoxType) {
      // Nếu gearBoxType có giá trị, chuyển đến trang InputDataScreen với query string
      if (gearBoxType == "GearBox2") Alert.alert("Loại hộp giảm tốc này hiện tại chưa hỗ trợ!");
      else router.push({ pathname: "/src/views/InputDataScreen", params: { gearBoxType: gearBoxType } });
    } else {
      Alert.alert("Vui lòng chọn loại thiết kế");
    }
  };

  const handleEscape = () => {
    router.push("./Home"); // Quay lại trang home
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thiết kế hộp giảm tốc</Text>
      </View>

      <DropDownPicker
        open={open}
        value={gearBoxType}
        items={items}
        setOpen={setOpen}
        setValue={setGearBoxType}
        setItems={setItems}
        style={styles.dropdown}
        placeholder="Loại hộp giảm tốc"
        dropDownContainerStyle={{ width: "90%", alignSelf: "center" }}
      />
      <Text style={styles.title}>Bản vẽ thiết kế</Text>
      <Image style={styles.imgPreview} source={image} resizeMode="stretch" />

      <View style={calcFooter.buttonFooter}>
        <TouchableOpacity style={calcFooter.cancelButton} onPress={handleEscape}>
          <Text style={calcFooter.cancelButtonText}>Thoát</Text>
        </TouchableOpacity>
        <TouchableOpacity style={calcFooter.button} onPress={handleContinue}>
          <Text style={calcFooter.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
