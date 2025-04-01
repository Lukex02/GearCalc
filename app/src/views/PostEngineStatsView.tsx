import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import CalcController from "../controller/CalcController";
import EngineController from "../controller/EngineController";
import CalcFooter from "./CalcFooter";

export default function SelectEngineScreen() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const calcController = CalcController.getInstance();
  const postStats = calcController.getEnginePostStats();
  console.log(postStats);

  // return <CalcFooter />;
}
