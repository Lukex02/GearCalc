import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Modal } from "react-native";
import { Button } from "react-native-paper";
import Slider from "@react-native-community/slider"; // Import Slider
import styles from "@style/MainStyle";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";

// Bảng Data cứng khi chọn luôn vật liệu là Thép 45 - Thường hóa chế tạo (Input)
const materialStats = {
  label: "Vật liệu chế tạo trục",
  sigma_b: 600,
  sigma_ch: 340,
  HB_min: 170,
  HB_max: 217,
  S_max: 60,
};

export default function GearFastScreen() {
  const calcController = CalcController.getInstance();
  calcController.calcShaft({
    sigma_b: materialStats.sigma_b,
    sigma_ch: materialStats.sigma_ch,
    HB: materialStats.HB_min,
  }); // Có thể truyền thêm mấy tham số hubParam dưới dạng { hub_d_x_brt, hub_kn_tvdh, hub_kn_tr, hub_bv, hub_brc }
  // Tuy nhiên với bài này thì nếu có tùy biến chỉ tùy biến --- hub_d_x_brt và hub_kn_tvdh ---

  // hub_d_x_brt?: number; // Hệ số tính chiều dài mayơ bánh đai, dĩa xích, bánh răng trụ
  // hub_kn_tvdh?: number; // Hệ số tính chiếu dài mayơ nửa khớp nối đối với trục vòng đàn hồi
  // hub_kn_tr?: number; // Hệ số tính chiều dài mayơ nửa khớp nối đối với trục răng, có thể sẽ define sau nếu có làm thiết kế liên quan
  // hub_bv?: number; // Hệ só tính chiều dài mayơ bánh vít
  // hub_brc?: number; // Hệ só tính chiều dài mayơ bánh răng côn

  // --- Sau khi gọi hàm tính toán trên có thể chạy hàm lấy những thông số của 3 cái đồ thị lực trên 3 trục
  // calcController.getShaftDiagram(); // Data trả về là 1 object với { Shaft1: { Q1x, Q1y, M1x, M1y, M1z }, Shaft2: { Q2x, Q2y, M2x, M2y, M2z }, Shaft3: { Q3x, Q3y, M3x, M3y, M3z } }
  // Có thể vẽ đồ thị dùng Util.ForceOnShaftDiagram(data, fillColor, lineColor) với data là truyền cái shaft cụ thể ở trên (Tham khảo ở TestDiagram.tsx)
  // ***Nên*** Mở lên 1 cái popup modal để chọn đường kính trục chung (Bước 2 trong CalcController)
  // calcController.chooseShaftDiameter(d_choose: number[]) // Dữ liệu được chọn sẽ được lưu trong state
  // !! Có thể thêm 1 trang riêng cho bước 2 nếu cần

  // Không có output (trừ diagram) mà chuyển sang trang tiếp theo (Shaft3-4Screen.tsx)
}
