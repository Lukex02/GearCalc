import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { Text, TextInput, Button, Card } from "react-native-paper";
import styles from "../style/InputStyle"; 

const InputScreen = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    efficiency: [
      { id: 1, type: "n_ol", value: "0.99" },
      { id: 2, type: "n_tv", value: "0.85" },
      { id: 3, type: "n_brt", value: "0.96" },
      { id: 4, type: "n_d", value: "0.94" },
      { id: 5, type: "n_kn", value: "0.98" },
    ],
    ratios: [
      { id: 1, type: "u_d", value: "3" },
      { id: 2, type: "u_tv", value: "10" },
      { id: 3, type: "u_brt", value: "3" },
      { id: 4, type: "u_kn", value: "1" },
    ],
    parameters: [
      { id: 1, type: "F", value: "17000" },
      { id: 2, type: "v", value: "0.5" },
      { id: 3, type: "z", value: "15" },
      { id: 4, type: "p", value: "120" },
      { id: 5, type: "L", value: "10" },
      { id: 6, type: "T1", value: "1" },
      { id: 7, type: "t1", value: "25" },
      { id: 8, type: "T2", value: "0.5" },
      { id: 9, type: "t2", value: "15" },
    ],
  });

  const handleChange = (category, id, text) => {
    setFormData((prev) => ({
      ...prev,
      [category]: prev[category].map((item) =>
        item.id === id ? { ...item, value: text } : item
      ),
    }));
  };

  const handleCalculate = () => {
    router.push({
      pathname: "/calculation",
      params: {
        efficiency: JSON.stringify(formData.efficiency),
        ratios: JSON.stringify(formData.ratios),
        parameters: JSON.stringify(formData.parameters),
      },
    });
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer} 
    >
      <Text style={styles.title}>Nhập Thông Số Thiết Kế</Text>

      <Card style={[styles.card, { borderWidth: 0 }]}>
        <Text style={styles.cardTitle}>Efficiency</Text>
        {formData.efficiency.map((item) => (
          <TextInput
          key={item.id}
          label={item.type}
          value={item.value.toString()} 
          keyboardType="numeric"
          mode="flat"
          style={styles.input}
          onChangeText={(text) => handleChange("efficiency", item.id, text)}
          placeholderTextColor="#000" 
          theme={{
            colors: {
              text: "#000", 
              primary: "#000",
              placeholder: "#000", 
              onSurface: "#000",
            },
          }}
        />
        ))}
      </Card>

      <Card style={styles.card}>
      <Text style={styles.cardTitle}>Ratio</Text>
        {formData.ratios.map((item) => (
      <TextInput
        key={item.id}
        label={item.type}
        value={item.value.toString()} 
        keyboardType="numeric"
        mode="flat"
        style={styles.input}
        onChangeText={(text) => handleChange("ratios", item.id, text)}
        placeholderTextColor="#000"
        theme={{
          colors: { 
          text: "#000", 
          primary: "#000", 
          placeholder: "#000", 
          onSurface: "#000" 
          }
        }}
      />
    ))}
      </Card>

    <Card style={styles.card}> 
      <Text style={styles.cardTitle}>Thông Số Khác</Text>
        {formData.parameters.map((item) => (
      <TextInput
        key={item.id}
        label={item.type}
        value={item.value.toString()}
        keyboardType="numeric"
        mode="flat" 
        style={styles.input}
        onChangeText={(text) => handleChange("parameters", item.id, text)}
        placeholderTextColor="#000"
        theme={{
            colors: { 
            text: "#000", 
            primary: "#000", 
            placeholder: "#000", 
            onSurface: "#000" 
          }
        }}
      />
      ))}
    </Card>

      <View style={styles.buttonContainer}>
        <Button mode="contained" style={styles.button} onPress={handleCalculate}>
          📊 Tính Toán
        </Button>
      </View>
    </ScrollView>
  );
};

export default InputScreen;
