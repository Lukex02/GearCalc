import React from "react";
import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Text, Card } from "react-native-paper";
import calculationStyles from "../style/CalculationStyle";

const CalculationScreen = () => {
  const { efficiency, ratios, parameters } = useLocalSearchParams();

  // Tạm thời đặt giá trị rỗng vì BE chưa có
  const systemEfficiency = "Đang tính toán...";
  const equivalentPower = "Đang tính toán...";
  const preliminaryEngineSpeed = "Đang tính toán...";

  return (
    <ScrollView 
      style={calculationStyles.container}
      contentContainerStyle={calculationStyles.contentContainer} // ✅ Fix lỗi ScrollView
    >
      <Text style={calculationStyles.title}>Kết Quả Tính Toán</Text>

      {/* Hiệu suất hệ thống */}
      <Card style={calculationStyles.card}>
        <Text style={calculationStyles.cardTitle}>Hiệu suất hệ thống</Text>
        <Text style={calculationStyles.resultText}>{systemEfficiency}</Text>
      </Card>

      {/* Công suất tương đương */}
      <Card style={calculationStyles.card}>
        <Text style={calculationStyles.cardTitle}>Công suất tương đương</Text>
        <Text style={calculationStyles.resultText}>{equivalentPower}</Text>
      </Card>

      {/* Số vòng quay sơ bộ của động cơ */}
      <Card style={calculationStyles.card}>
        <Text style={calculationStyles.cardTitle}>Số vòng quay sơ bộ của động cơ</Text>
        <Text style={calculationStyles.resultText}>{preliminaryEngineSpeed}</Text>
      </Card>
    </ScrollView>
  );
};

export default CalculationScreen;
