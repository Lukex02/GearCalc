import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "../style/InputDataScreenStyle";
import CalcController from "../controller/CalcController";
import calcFooter from "../style/calcFooter";
import { ScrollView } from "react-native-web";

export default function InputDataScreen() {
  const { gearBoxType } = useLocalSearchParams();
  const router = useRouter();
  const calcController = new CalcController(gearBoxType);

  // Các state cho giá trị nhập liệu
  const [F, setF] = useState(0); // Lực vòng
  const [v, setV] = useState(0); // Vận tốc
  const [T1, setT1] = useState(0); // Momen xoắn T1
  const [t1, setT1Duration] = useState(0); // Thời gian tải 1
  const [T2, setT2] = useState(0); // Momen xoắn T2
  const [t2, setT2Duration] = useState(0); // Thời gian tải 2
  const [p, setP] = useState(0); // Bước xích
  const [z, setZ] = useState(0); // Số răng xích
  const [D, setD] = useState(0); // Đường kính tang

  // Dữ liệu mặc định cho GearBox1 và GearBox2
  useEffect(() => {
    if (gearBoxType === "GearBox1") {
      setF(7500);
      setV(0.9);
      setT1(1);
      setT1Duration(36);
      setT2(0.5);
      setT2Duration(15);
      setD(550);
    } else if (gearBoxType === "GearBox2") {
      setF(17000);
      setV(0.5);
      setT1(1);
      setT1Duration(25);
      setT2(0.5);
      setT2Duration(15);
      setP(120);
      setZ(15);
    }
  }, [gearBoxType]);

  const handleContinue = () => {
    if (!F || !v || !T1 || !t1 || !T2 || !t2 || (gearBoxType === "GearBox2" && (!p || !z))) {
      Alert.alert("Thiếu thông tin", "Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (gearBoxType === "GearBox1") calcController.calcEngineBase(F, v, T1, t1, T2, t2, { D });
    if (gearBoxType === "GearBox2") calcController.calcEngineBase(F, v, T1, t1, T2, t2, { z, p });
    // Chuyển đến trang tiếp theo (thực hiện các tính toán hoặc hiển thị kết quả)
    // router.push({
    //   pathname: "/src/views/AdjustEngineParametersScreen",
    //   params: { calcController: JSON.stringify(calcController) },
    // });
    router.push("/src/views/AdjustEngineParametersScreen");
  };

  const handleBack = () => {
    router.back(); // Quay lại trang trước
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Số liệu thiết kế</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text>Lực vòng F (N):</Text>
        <TextInput style={styles.inputField} keyboardType="numeric" value={F} onChangeText={setF} />

        <Text>Vận tốc V (m/s):</Text>
        <TextInput style={styles.inputField} keyboardType="numeric" value={v} onChangeText={setV} />

        <Text>Momen xoắn T1 (N.m):</Text>
        <TextInput style={styles.inputField} keyboardType="numeric" value={T1} onChangeText={setT1} />

        <Text>Thời gian tải t1 (giờ):</Text>
        <TextInput style={styles.inputField} keyboardType="numeric" value={t1} onChangeText={setT1Duration} />

        <Text>Momen xoắn T2 (N.m):</Text>
        <TextInput style={styles.inputField} keyboardType="numeric" value={T2} onChangeText={setT2} />

        <Text>Thời gian tải t2 (giờ):</Text>
        <TextInput style={styles.inputField} keyboardType="numeric" value={t2} onChangeText={setT2Duration} />

        {/* Hiển thị trường P và Z nếu chọn GearBox2 */}
        {gearBoxType === "GearBox2" && (
          <>
            <Text>Công suất P (N):</Text>
            <TextInput style={styles.inputField} keyboardType="numeric" value={p} onChangeText={setP} />

            <Text>Số răng đĩa xích Z:</Text>
            <TextInput style={styles.inputField} keyboardType="numeric" value={z} onChangeText={setZ} />
          </>
        )}

        {/* Hiển thị trường D nếu chọn GearBox1 */}
        {gearBoxType === "GearBox1" && (
          <>
            <Text>Đường kính D (mm):</Text>
            <TextInput style={styles.inputField} keyboardType="numeric" value={D} onChangeText={setD} />
          </>
        )}
      </View>

      <View style={calcFooter.buttonFooter}>
        <TouchableOpacity style={calcFooter.cancelButton} onPress={handleBack}>
          <Text style={calcFooter.cancelButtonText}>Quay lại</Text>
        </TouchableOpacity>

        <TouchableOpacity style={calcFooter.button} onPress={handleContinue}>
          <Text style={calcFooter.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
