import { useState } from "react";
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform } from "react-native";
<<<<<<< HEAD:app/src/views/InputChain.tsx
import styles from "../style/MainStyle";
import CalcFooter from "./CalcFooter";
import CalcController from "../controller/CalcController";
import ChainController from "../controller/ChainController";
import { Chip, Icon, List } from "react-native-paper";
=======
import styles from "@style/MainStyle";
import CalcFooter from "@views/common/CalcFooter";
import CalcController from "@controller/CalcController";
import { Icon, List } from "react-native-paper";
>>>>>>> back-dev:app/views/design/chain/InputChain.tsx

type KProps = {
  k_0: any;
  k_a: any;
  k_dc: any;
  k_d: any;
  k_c: any;
  k_bt: any;
};

const k_key: { key: keyof KProps; label: string }[] = [
  { key: "k_0", label: "Đường nối hai tâm đĩa xích so với đường nằm ngang" },
  { key: "k_a", label: "Khoảng cách trục a" },
  { key: "k_dc", label: "Vị trí trục được điều chỉnh bằng" },
  { key: "k_d", label: "Tải trọng" },
  { key: "k_c", label: "Số ca làm việc" },
  { key: "k_bt", label: "Môi trường làm việc và loại bôi trơn" },
];

const dummyShaft3Stats = {
  P: 7.088,
  u: 2.578,
  n: 80.561,
  T: 840232.2606,
};

export default function InputChain() {
  const calcController = CalcController.getInstance();
  const enginePostStats = calcController.getEnginePostStats();

  const [selectedValues, setSelectedValues] = useState<KProps>({
    k_0: 1,
    k_a: 1,
    k_dc: 1,
    k_d: 1.2,
    k_c: 1.25,
    k_bt: 1.3,
  });
  const k_opt: KProps = {
    k_0: [
      { label: "Đến 60 độ", value: 1 },
      { label: "Trên 60 độ", value: 1.25 },
    ],
    k_a: [
      { label: "a = (30 .. 50)p", value: 1 },
      { label: "a <= 25p", value: 1.25, disabled: true },
      { label: "a >=  (60 .. 80)p", value: 0.8, disabled: true },
    ],
    k_dc: [
      { label: "Một trong các đĩa xích", value: 1 },
      { label: "Đĩa căng hoặc con lăn căng xích", value: 1.1 },
      { label: "Vị trí trục không điều chỉnh được", value: 1.25 },
    ],
    k_d: [
      { label: "Tĩnh, làm việc êm", value: 1 },
      { label: "Va đập nhẹ", value: 1.2 },
      { label: "Va đập vừa", value: 1.5 },
      { label: "Va đập mạnh", value: 1.8 },
    ],
    k_c: [
      { label: "1 ca", value: 1 },
      { label: "2 ca", value: 1.25 },
      { label: "3 ca", value: 1.45 },
    ],
    k_bt: [
      { label: "Không bụi, loại I", value: 0.8 },
      { label: "Không bụi, loại II", value: 1.25 },
      { label: "Có bụi, loại II", value: 1.3 },
      { label: "Có bụi, loại III, v < 4 m/s", value: 1.8 },
      { label: "Loại III, có bụi, v < 7 m/s hoặc bẩn, v < 4 m/s", value: 3 },
      { label: "Bẩn, loại III, v < 7 m/s hoặc loại IV, v < 4 m/s", value: 6 },
    ],
  };

  const [open, setOpen] = useState({
    k_0: false,
    k_a: false,
    k_dc: false,
    k_d: false,
    k_c: false,
    k_bt: false,
  });

  const handleValueChange = (key: keyof KProps, value: any) => {
    setSelectedValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleOpenChange = (key: keyof KProps, isOpen: any) => {
    setOpen((prev) => {
      const newState = Object.keys(prev).reduce((acc, k) => {
        acc[k as keyof KProps] = false;
        return acc;
      }, {} as typeof prev);
      return { ...newState, [key]: isOpen };
    });
  };
  const handleValidation = () => {
    if (
      Object.values(selectedValues).some(
        (value) => value === null || value === undefined || value.value === 0,
      )
    ) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return false;
    } else {
      // Tính toán với các giá trị đã chọn
      if (enginePostStats) {
        calcController.calcMechDriveBase({
          P: enginePostStats.distShaft.p[3] ?? dummyShaft3Stats.P,
          u_x: enginePostStats.ratio[3].value ?? dummyShaft3Stats.u,
          n: enginePostStats.distShaft.n[3] ?? dummyShaft3Stats.n,
          k_0: selectedValues.k_0,
          k_a: selectedValues.k_a,
          k_dc: selectedValues.k_dc,
          k_bt: selectedValues.k_bt,
          k_d: selectedValues.k_d,
          k_c: selectedValues.k_c,
        });
        return true;
      }
      return false;
    }
  };
  const handleAccordionToggle = (key: keyof typeof open) => {
    setOpen((prev) => {
      const newState = { ...Object.fromEntries(Object.keys(prev).map((k) => [k, false])) } as typeof prev;
      newState[key] = !prev[key];
      return newState;
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Chọn điều kiện xích</Text>
      </View>

      <ScrollView
        style={styles.inputContainer}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {k_key.map(({ key, label }) => (
          <View key={key}>
            <Text style={styles.inputFieldLabel}>
              {label} (hệ số {key}:{" "}
              <Text style={{ color: "blue", fontWeight: "bold" }}>
                {selectedValues[key as keyof typeof selectedValues]}
              </Text>
              )
            </Text>
            <View style={{ borderRightWidth: 1 }}>
              <List.Accordion
                title={`Chọn điều kiện...`}
                expanded={open[key]}
                onPress={() => handleAccordionToggle(key)}
                titleStyle={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.47)" }}
                style={{ backgroundColor: "rgb(255, 255, 255)" }}
              >
                {k_opt[key as keyof typeof k_opt].map((item: any) => (
                  <List.Item
                    key={item.value}
                    title={() => (
                      <Text
                        style={{
                          fontWeight: "bold",
                          color:
                            selectedValues[key as keyof typeof selectedValues] === item.value
                              ? "blue"
                              : "black",
                        }}
                        numberOfLines={0} // Cho phép nhiều dòng
                      >
                        {item.label}
                      </Text>
                    )}
                    disabled={item.disabled}
                    titleStyle={{
                      fontWeight: "bold",
                      color:
                        selectedValues[key as keyof typeof selectedValues] === item.value ? "blue" : "black",
                    }}
                    right={() =>
                      selectedValues[key as keyof typeof selectedValues] === item.value ? (
                        <Icon source="check" color="blue" size={20} />
                      ) : null
                    }
                    onPress={() => {
                      handleValueChange(key as keyof typeof selectedValues, item.value);
                      // handleAccordionToggle(key as keyof typeof selectedValues); // đóng lại sau khi chọn
                    }}
                  />
                ))}
              </List.Accordion>
            </View>
          </View>
        ))}
      </ScrollView>

      <CalcFooter onValidate={handleValidation} nextPage="/views/design/chain/SelectChainScreen" />
    </KeyboardAvoidingView>
  );
}
