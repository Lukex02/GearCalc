import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const FullscreenImageBackground: React.FC = () => {
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: "#9FD8E6" }}>
      <Image source={require("../assets/images/background.png")} style={styles.background} resizeMode="contain"></Image>
      <Text style={styles.overlay}>Chào mừng tới GEAR CALC</Text>
      <View style={styles.rowContainer}>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => router.push("/src/views/Home")}>
          <Text style={styles.buttonText}>Bắt đầu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => router.push("/src/views/login")}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmall} onPress={() => router.push("/src/views/Register")}>
          <Text style={styles.buttonText}>Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FullscreenImageBackground;

const styles = StyleSheet.create({
  background: {
    width: width * 0.9,
    height: height * 0.55,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
  },
  overlay: {
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: "monospace",
  },
  title: {
    fontSize: 28,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
  },
  content: {
    fontSize: 20,
    color: "blue",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  rowContainer: {
    flexDirection: "column", // Đặt các phần tử trong hàng ngang
    justifyContent: "space-around", // Căn đều khoảng cách giữa các phần tử
    marginTop: 20,
    marginBottom: 20,
    gap: 20,
  },
  buttonSmall: {
    backgroundColor: "#9CF2D4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 200, // Đặt chiều rộng nhỏ hơn cho nút
    alignSelf: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
