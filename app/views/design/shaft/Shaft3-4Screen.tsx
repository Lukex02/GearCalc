import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button } from "react-native-paper";
import Slider from "@react-native-community/slider"; // Import Slider
import styles from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";

// Giả lập keyData
const keyData = [
  { shaft: 1, point: "A", d: 10, lm: 10, lt: 11, b: 10, h: 10, t1: 10, T: 57000, sigma_d: 1, tau_c: 1 },
  { shaft: 1, point: "C", d: 10, lm: 10, lt: 11, b: 10, h: 10, t1: 10, T: 57000, sigma_d: 1, tau_c: 1 },
  { shaft: 2, point: "B", d: 10, lm: 10, lt: 11, b: 10, h: 10, t1: 10, T: 57000, sigma_d: 1, tau_c: 1 },
  { shaft: 2, point: "C", d: 10, lm: 10, lt: 11, b: 10, h: 10, t1: 10, T: 57000, sigma_d: 1, tau_c: 1 },
  { shaft: 3, point: "A", d: 10, lm: 10, lt: 11, b: 10, h: 10, t1: 10, T: 57000, sigma_d: 1, tau_c: 1 },
  { shaft: 3, point: "C", d: 10, lm: 10, lt: 11, b: 10, h: 10, t1: 10, T: 57000, sigma_d: 1, tau_c: 1 },
];

export default function SelectDiamShaftScreen() {
  const calcController = CalcController.getInstance();
  // Bước 3 là chọn đường kính trục cho từng tiết diện của từng trục
  // Sẽ thực hiện gọi hàm ở dưới 3 * 4 = 12 lần (3 trục, 4 điểm)
  // calcController.chooseIndiShaftDiameter(1, [{ point: "A", value: 10 }]); // Ví dụ trục I tại điểm A có đường kính 10
  // *** Gọi luôn calcController.calcKey() ở đây nhưng mà phải sau khi chọn xong tất cả ở trên, và phải xử lý async
  // const keyData = calcController.calcKey() // Kết quả trả về sẽ là những then được chọn tự nhiên theo thiết kế của trục

  // In kết quả keyData ra
}
