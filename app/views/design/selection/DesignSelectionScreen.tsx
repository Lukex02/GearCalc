import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import styles from "@style/MainStyle";
import CalcFooter from "@views/common/CalcFooter";
import { FontAwesome } from "@expo/vector-icons";

export default function DesignSelectionScreen() {
  const [gearBoxType, setGearBoxType] = useState<any>("");
  const [image, setImage] = useState(null); // Biến để lưu ảnh của hộp giảm tốc
  const [open, setOpen] = useState(false);
  const gearBoxOptions = [
    { label: "Hộp giảm tốc hai cấp khai triển", value: "GearBox1" },
    { label: "Hộp giảm tốc trục vít - bánh răng", value: "GearBox2" },
  ];
  const gearBoxImage = {
    GearBox1: require("@img/GearBox1Template.png"),
    GearBox2: require("@img/GearBox2Template.png"),
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
        return false;
      } else return true;
      // else router.push({ pathname: "/src/views/InputDataScreen", params: { gearBoxType: gearBoxType } });
    } else {
      alert("Vui lòng chọn loại thiết kế");
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
        textStyle={{ color: "white" }}
        ArrowDownIconComponent={() => <FontAwesome name="chevron-down" size={15} color="gray" />}
        ArrowUpIconComponent={() => <FontAwesome name="chevron-up" size={15} color="gray" />}
      />
      <Text style={styles.pageTitle}>Bản vẽ thiết kế</Text>
      <Image style={styles.designImgPreview} source={image ? image : undefined} resizeMode="stretch" />

      <CalcFooter
        backTxt="Thoát"
        backPage="/views/Home"
        onValidate={handleValidation}
        nextPage={{ pathname: "/views/design/engine/InputDataScreen", params: { gearBoxType: gearBoxType } }}
      />
    </View>
  );
}
