import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
// import { Appbar, IconButton, Menu } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";

const ComponentPage = () => {
  const data = useLocalSearchParams();
  return (
    data.type === "Engine" && (
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
    )
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
