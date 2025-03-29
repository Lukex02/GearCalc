import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import styles from "../style/SelectEngineScreenStyle"; // Sử dụng style đã tạo
import calcFooter from "../style/calcFooter";
import CalcController from "../controller/CalcController";
import EngineController from "../controller/EngineController";

export default function SelectEngineScreen() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const calcController = CalcController.getInstance();
  const postStats = calcController.getEnginePostStats();
  console.log(postStats);

  const handleContinue = () => {};

  const handleBack = () => {
    router.back(); // Quay lại trang trước
  };

  return (
    <View style={styles.container}>
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
