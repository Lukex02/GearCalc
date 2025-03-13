import React, { useState } from "react";
import { Text, View, Button } from "react-native";
import Engine, { Efficiency } from "./src/EngiCalc";

export default function Index() {
  const [engine, setEngine] = useState<Engine | null>(null);
  const [efficiency, setEfficiency] = useState<Efficiency | null>(null);

  const calculateEfficiency = () => {
    const newEfficiency = new Efficiency(0.99, 0.85, 0.96, 0.94, 0.98);
    setEfficiency(newEfficiency);
    return newEfficiency;
  };

  const calculatePower = () => {
    const newEngine = new Engine(
      17000,
      0.5,
      15,
      120,
      10,
      1,
      25,
      0.5,
      15,
      calculateEfficiency().get_effi_system()
    );
    setEngine(newEngine);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Button title="Tính Công Suất" onPress={calculatePower} />
      {efficiency && (
        <Text>
          Hiệu suất truyền động hệ thống:{" "}
          {efficiency.get_effi_system().toFixed(3)}
        </Text>
      )}
      {engine && (
        <Text>
          Công suất cần thiết: {engine.get_p_ct().toFixed(2)} {"\n"}
          Số vòng quay sơ bộ của động cơ: {engine.get_n_sb().toFixed(0)}
        </Text>
      )}
    </View>
  );
}
