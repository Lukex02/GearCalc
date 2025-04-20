import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button } from "react-native-paper";
import Slider from "@react-native-community/slider"; // Import Slider
import styles from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";

// Data giả lập result
const result = {
  fatigueDura: [
    {
      shaftIdx: 1,
      point: "C",
      W_j: 0.001,
      W_oj: 0.001,
      M_j: 0.001,
      epsi_sigma: 0.001,
      epsi_tau: 0.001,
      sigma_aj: 0.001,
      tau_aj: 0.001,
      tau_mj: 0.001,
      s_sigma: 0.001,
      s_tau: 0.001,
      s: 0.001,
    },
    {
      shaftIdx: 2,
      point: "C",
      W_j: 0.001,
      W_oj: 0.001,
      M_j: 0.001,
      epsi_sigma: 0.001,
      epsi_tau: 0.001,
      sigma_aj: 0.001,
      tau_aj: 0.001,
      tau_mj: 0.001,
      s_sigma: 0.001,
      s_tau: 0.001,
      s: 0.001,
    },
    {
      shaftIdx: 3,
      point: "B",
      W_j: 0.001,
      W_oj: 0.001,
      M_j: 0.001,
      epsi_sigma: 0.001,
      epsi_tau: 0.001,
      sigma_aj: 0.001,
      tau_aj: 0.001,
      tau_mj: 0.001,
      s_sigma: 0.001,
      s_tau: 0.001,
      s: 0.001,
    },
  ],
  staticDura: [
    {
      shaftIdx: 1,
      d_max: 0.001,
      M_max: 0.001,
      T_max: 0.001,
      sigma: 0.001,
      tau: 0.001,
      sigma_td: 0.001,
    },
    {
      shaftIdx: 2,
      d_max: 0.001,
      M_max: 0.001,
      T_max: 0.001,
      sigma: 0.001,
      tau: 0.001,
      sigma_td: 0.001,
    },
    {
      shaftIdx: 3,
      d_max: 0.001,
      M_max: 0.001,
      T_max: 0.001,
      sigma: 0.001,
      tau: 0.001,
      sigma_td: 0.001,
    },
  ],
};

export default function SelectDiamShaftScreen() {
  const calcController = CalcController.getInstance();
  // Bước 5 là kiểm nghiệm trục và xuất kết quả kiểm nghiệm
  // const result = calcController.testDurability()

  // In result ra (lấy tạm mấy data result giả lập ở trên để design cũng được đề phòng có lỗi gì đó trong tính toán)
}
