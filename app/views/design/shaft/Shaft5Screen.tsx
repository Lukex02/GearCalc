import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import styles from "@style/MainStyle";
import CalcFooter from "@views/common/CalcFooter";
import Header from "@/views/common/Header";

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

export default function Shaft5Screen() {
  return (
    <View style={styles.container}>
      <Header title="Kết quả độ bền trục" />
      <ScrollView horizontal>
        <View style={localStyles.table}>
          {/* Header Row */}
          <View style={[localStyles.row, localStyles.headerRow]}>
            <Text style={[localStyles.cell, localStyles.headerCell]}>
              Thông số
            </Text>
            <Text style={[localStyles.cell, localStyles.headerCell]}>
              Trục 1
            </Text>
            <Text style={[localStyles.cell, localStyles.headerCell]}>
              Trục 2
            </Text>
            <Text style={[localStyles.cell, localStyles.headerCell]}>
              Trục 3
            </Text>
          </View>

          {/* W_j Row */}
          <View style={localStyles.row}>
            <Text style={localStyles.cell}>W_j</Text>
            {result.fatigueDura.map((item, index) => (
              <Text key={index} style={localStyles.cell}>
                {item.W_j.toFixed(4)}
              </Text>
            ))}
          </View>

          {/* M_j Row */}
          <View style={localStyles.row}>
            <Text style={localStyles.cell}>M_j</Text>
            {result.fatigueDura.map((item, index) => (
              <Text key={index} style={localStyles.cell}>
                {item.M_j.toFixed(4)}
              </Text>
            ))}
          </View>

          {/* Sigma_aj Row */}
          <View style={localStyles.row}>
            <Text style={localStyles.cell}>Sigma_aj</Text>
            {result.fatigueDura.map((item, index) => (
              <Text key={index} style={localStyles.cell}>
                {item.sigma_aj.toFixed(4)}
              </Text>
            ))}
          </View>

          {/* Tau_aj Row */}
          <View style={localStyles.row}>
            <Text style={localStyles.cell}>Tau_aj</Text>
            {result.fatigueDura.map((item, index) => (
              <Text key={index} style={localStyles.cell}>
                {item.tau_aj.toFixed(4)}
              </Text>
            ))}
          </View>

          {/* D_max Row */}
          <View style={localStyles.row}>
            <Text style={localStyles.cell}>D_max</Text>
            {result.staticDura.map((item, index) => (
              <Text key={index} style={localStyles.cell}>
                {item.d_max.toFixed(4)}
              </Text>
            ))}
          </View>

          {/* M_max Row */}
          <View style={localStyles.row}>
            <Text style={localStyles.cell}>M_max</Text>
            {result.staticDura.map((item, index) => (
              <Text key={index} style={localStyles.cell}>
                {item.M_max.toFixed(4)}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>
      <CalcFooter />
    </View>
  );
}

const localStyles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 10,
    backgroundColor: "#f0f0f0",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerRow: {
    backgroundColor: "#f0f0f0",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  headerCell: {
    fontWeight: "bold",
  },
});
