import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
// import { Appbar, IconButton, Menu } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

const ComponentPage = () => {
  const data = useLocalSearchParams();
  // console.log(data);
  const printChainType = (type) => {
    switch (type) {
      case "1_roller":
        return "Xích con lăn 1 dãy";
      case "2_roller":
        return "Xích con lăn 2 dãy";
      default:
        return "Không xác định";
    }
  };
  return (
    (data.type === "Engine" && (
      <View style={styles.container}>
        <Text style={styles.title}>Động cơ điện</Text>
        <Text style={styles.title}>Mã: {data.Motor_Type}</Text>
        <Image source={require("../img/wrench.png")} style={styles.image} resizeMode="contain" />
        <Text style={styles.info}>Công suất: {data.Power} kW</Text>
        <Text style={styles.info}>Tốc độ vòng quay: {data.Speed} vòng/phút</Text>
        <Text style={styles.info}>Hệ số công suất: {data.Efficiency}%</Text>
        <Text style={styles.info}>Hiệu suất động cơ: {data.H}</Text>
        <Text style={styles.info}>Momen khởi động / Momen danh nghĩa: {data["Tk/Tdn"]}</Text>
        <Text style={styles.info}>Momen tối đa / Momen danh nghĩa: {data["Tmax/Tdn"]}</Text>
      </View>
    )) ||
    (data.type === "chain" && (
      <View style={styles.container}>
        <Text style={styles.title}>{printChainType(data.chain_type)}</Text>
        <Image source={require("../img/wrench.png")} style={styles.image} resizeMode="contain" />
        <Text style={styles.info}>Bước xích: {data.Step_p} (mm)</Text>
        <Text style={styles.info}>B nhỏ nhất: {data.Speed} (mm)</Text>
        <Text style={styles.info}>d_0: {data.d_0} (mm)</Text>
        <Text style={styles.info}>l: {data.l + " (mm)" || "Không có dữ liệu"}</Text>
        <Text style={styles.info}>h lớn nhất: {data.h_max} (mm)</Text>
        <Text style={styles.info}>b lớn nhất: {data.b_max} (mm)</Text>
        <Text style={styles.info}>Tải trọng phá hỏng Q: {data.b_max} (N)</Text>
        <Text style={styles.info}>Khối lượng 1 mét xích: {data.q_p} (kg)</Text>
      </View>
    ))
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#A5D8E5",
    padding: 20,
  },
  title: { fontSize: 46, fontWeight: "bold" },
  image: { width: 300, height: 300, marginVertical: 10 },
  info: { fontSize: 20, marginTop: 5 },
});

export default ComponentPage;
