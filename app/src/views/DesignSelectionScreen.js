    import React, { useState } from "react";
    import { View, Text, TouchableOpacity } from "react-native";
    import DropDownPicker from "react-native-dropdown-picker";
    import { useRouter } from "expo-router"; // Để sử dụng router
    import styles from "../style/DesignSelectionStyle"; // Sử dụng style đã tạo

    export default function DesignSelectionScreen() {
    const [gearBoxType, setGearBoxType] = useState("");
    const [open, setOpen] = useState(false);
    const gearBoxOptions = ["GearBox1", "GearBox2"];
    const [items, setItems] = useState(
        gearBoxOptions.map((option) => ({
        label: option,
        value: option,
        }))
    );

    const router = useRouter(); // Khởi tạo router để điều hướng

    const handleContinue = () => {
        if (!gearBoxType) {
        alert("Vui lòng chọn loại thiết kế");
        return;
        }

       // Kiểm tra giá trị của gearBoxType trước khi truyền
    if (gearBoxType) {
        // Nếu gearBoxType có giá trị, chuyển đến trang InputDataScreen với query string
        router.push(`/src/views/InputDataScreen?gearBoxType=${encodeURIComponent(gearBoxType)}`);
        } else {
    alert("Vui lòng chọn loại thiết kế");
  }
  
    };

    const handleBack = () => {
        router.back(); // Quay lại trang trước
    };

    return (
        <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Chọn loại thiết kế</Text>
        </View>

        <DropDownPicker
            open={open}
            value={gearBoxType}
            items={items}
            setOpen={setOpen}
            setValue={setGearBoxType}
            setItems={setItems}
            style={styles.dropdown}
        />

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Tiếp tục</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
            <Text style={styles.cancelButtonText}>Thoát</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
    }
