import { useState } from "react";
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
import styles from "@style/MainStyle";
import CalcFooter from "@views/common/CalcFooter";
import CalcController from "@controller/CalcController";
import { Icon, List } from "react-native-paper";
import { scale } from "react-native-size-matters";
import { Colors } from "@/src/style/Colors";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import { kron } from "mathjs";

type RollerBearingProps = {
  symbol: string;
  d: number;
  D: number;
  B: number;
  r: number;
  C: number;
  Co: number;
  b: number;
  rl: number;
};

const rollerBearingFields: { key: keyof RollerBearingProps; label: string; unit: string }[] = [
  { key: "symbol", label: "Ký hiệu ổ lăn", unit: "" },
  { key: "d", label: "Đường kính trong (d)", unit: "mm" },
  { key: "D", label: "Đường kính ngoài (D)", unit: "mm" },
  { key: "B", label: "Chiều rộng ổ (B)", unit: "mm" },
  { key: "r", label: "Bán kính góc (r)", unit: "mm" },
  { key: "C", label: "Khả năng tải động (C)", unit: "kN" },
  { key: "Co", label: "Khả năng tải tĩnh (Co)", unit: "kN" },
  { key: "b", label: "Chiều rộng con lăn (b)", unit: "mm" },
  { key: "rl", label: "Bán kính con lăn (rl)", unit: "mm" },
];

const dummyRollerBearingStats = {
  P: 7.088,
  n: 80.561,
  T: 840232.2606,
};

export default function InputRollerBearing() {
  const calcController = CalcController.getInstance();
  
  const [selectedValues, setSelectedValues] = useState<RollerBearingProps>({
    symbol: "",
    d: 0,
    D: 0,
    B: 0,
    r: 0,
    C: 0,
    Co: 0,
    b: 0,
    rl: 0,
  });

  const bearingOptions = {
    symbol: [
      { label: "6000", value: "6000" },
      { label: "6200", value: "6200" },
      { label: "6300", value: "6300" },
    ],
    d: [
      { label: "10 mm", value: 10 },
      { label: "12 mm", value: 12 },
      { label: "15 mm", value: 15 },
    ],
    // Thêm các options cho các trường khác tương tự
  };

  const [open, setOpen] = useState<Record<keyof RollerBearingProps, boolean>>({
    symbol: false,
    d: false,
    D: false,
    B: false,
    r: false,
    C: false,
    Co: false,
    b: false,
    rl: false,
  });

  const handleValueChange = (key: keyof RollerBearingProps, value: any) => {
    setSelectedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleValidation = () => {
    if (Object.values(selectedValues).some(value => !value)) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông số kỹ thuật ổ lăn");
      return false;
    }
    
    calcController.calcRollerBearing({
      ...selectedValues,
      P: dummyRollerBearingStats.P,
      n: dummyRollerBearingStats.n,
    });
    return true;
  };

  const handleAccordionToggle = (key: keyof RollerBearingProps) => {
    setOpen(prev => ({
      ...Object.fromEntries(Object.keys(prev).map(k => [k, false])),
      [key]: !prev[key]
    }) as typeof open);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Header title="Nhập thông số ổ lăn" rightIcon={<SaveComponent />} />

      <ScrollView
        style={styles.inputContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {rollerBearingFields.map(({ key, label, unit }) => (
          <View key={key}>
            <Text style={styles.inputFieldLabel}>
              {label} {unit && `(${unit})`}
            </Text>
            
            <View style={{ borderRightWidth: 2, borderColor: Colors.text.accent, marginVertical: scale(10) }}>
              <List.Accordion
                title={selectedValues[key] ? `${selectedValues[key]} ${unit}` : "Chọn giá trị..."}
                expanded={open[key]}
                onPress={() => handleAccordionToggle(key)}
                titleStyle={{ fontWeight: "bold", color: Colors.text.placeholder }}
                style={{ backgroundColor: "#151c2b" }}
              >
                {bearingOptions[key]?.map((item: any) => (
                  <List.Item
                    key={item.value}
                    title={`${item.label}`}
                    onPress={() => handleValueChange(key, item.value)}
                    titleStyle={{
                      color: selectedValues[key] === item.value 
                        ? Colors.text.accent 
                        : Colors.text.placeholder
                    }}
                    right={() => selectedValues[key] === item.value && (
                      <Icon source="check" color={Colors.text.accent} size={20} />
                    )}
                  />
                ))}
              </List.Accordion>
            </View>
          </View>
        ))}
      </ScrollView>

      <CalcFooter 
        onValidate={handleValidation} 
        nextPage="/views/design/rolling bearing/SelectRollerBearingScreen"
      />
    </KeyboardAvoidingView>
  );
}