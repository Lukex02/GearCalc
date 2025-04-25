import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput } from "react-native";
import { useLocalSearchParams } from "expo-router";
// import TextInput from "react-native-numeric-input";
import styles from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import { parse } from "@babel/core";

export default function InputDataScreen() {
  const { gearBoxType } = useLocalSearchParams();
  const calcController = new CalcController(Array.isArray(gearBoxType) ? gearBoxType[0] : gearBoxType);

  // Các state cho giá trị nhập liệu
  const [F, setF] = useState("0"); // Lực vòng
  const [v, setV] = useState("0"); // Vận tốc
  const [T1, setT1] = useState("0"); // Momen xoắn T1
  const [t1, setT1Duration] = useState("0"); // Thời gian tải 1
  const [T2, setT2] = useState("0"); // Momen xoắn T2
  const [t2, setT2Duration] = useState("0"); // Thời gian tải 2
  const [p, setP] = useState("0"); // Bước xích
  const [z, setZ] = useState("0"); // Số răng xích
  const [D, setD] = useState("0"); // Đường kính tang
  const [L, setL] = useState("0"); // Thời gian phục vụ

  // Dữ liệu mặc định cho GearBox1 và GearBox2
  useEffect(() => {
    if (gearBoxType === "GearBox1") {
      setF("7500");
      setV("0.9");
      setT1("1");
      setT1Duration("36");
      setT2("0.5");
      setT2Duration("15");
      setD("550");
      setL("9");
    } else if (gearBoxType === "GearBox2") {
      setF("17000");
      setV("0.5");
      setT1("1");
      setT1Duration("25");
      setT2("0.5");
      setT2Duration("15");
      setP("120");
      setZ("15");
      setL("9");
    }
  }, [gearBoxType]);

  const handleValidation = () => {
    if (!F || !v || !T1 || !t1 || !T2 || !t2 || !L || (gearBoxType === "GearBox2" && (!p || !z))) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return false;
    } else {
      if (gearBoxType === "GearBox1")
        calcController.initDesign(
          Number(F),
          Number(v),
          Number(T1),
          Number(t1),
          Number(T2),
          Number(t2),
          Number(L),
          { D: Number(D) }
        );
      if (gearBoxType === "GearBox2")
        calcController.initDesign(
          Number(F),
          Number(v),
          Number(T1),
          Number(t1),
          Number(T2),
          Number(t2),
          Number(L),
          { z: Number(z), p: Number(p) }
        );
      calcController.calcEngineBase();
      return true;
    }
  };

  const handleInput = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, "");
    const parts = cleanedText.split(".");
    if (parts.length > 2) {
      return cleanedText.slice(0, cleanedText.length - 1); // Không cho phép nhiều hơn một dấu chấm
    }
    return cleanedText;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Số liệu thiết kế</Text>
      </View>
      <ScrollView style={styles.inputContainer}>
        <Text style={styles.inputFieldLabel}>Lực vòng F (N):</Text>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          // value={F.toString()}
          value={F}
          onChangeText={(text) => setF(handleInput(text))}
          // onChangeText={(text) => setFtext(handleInput(text))}
        />

        <Text style={styles.inputFieldLabel}>Vận tốc V (m/s):</Text>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          value={v.toString()}
          onChangeText={(text) => setV(handleInput(text))}
        />

        <Text style={styles.inputFieldLabel}>Momen xoắn T1 (N.m):</Text>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          value={T1.toString()}
          onChangeText={(text) => setT1(handleInput(text))}
        />

        <Text style={styles.inputFieldLabel}>Thời gian tải t1 (giờ):</Text>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          value={t1.toString()}
          onChangeText={(text) => setT1Duration(handleInput(text))}
        />

        <Text style={styles.inputFieldLabel}>Momen xoắn T2 (N.m):</Text>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          value={T2.toString()}
          onChangeText={(text) => setT2(handleInput(text))}
        />

        <Text style={styles.inputFieldLabel}>Thời gian tải t2 (giờ):</Text>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          value={t2.toString()}
          onChangeText={(text) => setT2Duration(handleInput(text))}
        />

        <Text style={styles.inputFieldLabel}>Thời gian phục vụ L (năm):</Text>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          value={L.toString()}
          onChangeText={(text) => setL(handleInput(text))}
        />

        {/* Hiển thị trường P và Z nếu chọn GearBox2 */}
        {gearBoxType === "GearBox2" && (
          <>
            <Text style={styles.inputFieldLabel}>Công suất P (N):</Text>
            <TextInput
              style={styles.inputField}
              keyboardType="numeric"
              value={p.toString()}
              onChangeText={(text) => setP(handleInput(text))}
            />

            <Text style={styles.inputFieldLabel}>Số răng đĩa xích Z:</Text>
            <TextInput
              style={styles.inputField}
              keyboardType="numeric"
              value={z.toString()}
              onChangeText={(text) => setZ(handleInput(text))}
            />
          </>
        )}

        {/* Hiển thị trường D nếu chọn GearBox1 */}
        {gearBoxType === "GearBox1" && (
          <>
            <Text style={styles.inputFieldLabel}>Đường kính D (mm):</Text>
            <TextInput
              style={styles.inputField}
              keyboardType="numeric"
              value={D.toString()}
              onChangeText={(text) => setD(handleInput(text))}
            />
          </>
        )}
      </ScrollView>
      <CalcFooter
        nextPage={"/views/design/engine/AdjustEngineParametersScreen"}
        onValidate={handleValidation}
      />
    </View>
  );
}
