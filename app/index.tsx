import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "./src/style/MainStyle";

const { width, height } = Dimensions.get("window");

const FullscreenImageBackground: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/background.png")} style={styles.indexBackground} resizeMode="contain"></Image>
      <Text style={styles.overlay}>Chào mừng tới GEARCALC</Text>
      {/* <View style={styles.rowContainer}> */}
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/src/views/Home")}>
        <Text style={styles.mainBtnTxt}>Bắt đầu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/src/views/login")}>
        <Text style={styles.mainBtnTxt}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/src/views/Register")}>
        <Text style={styles.mainBtnTxt}>Tạo tài khoản</Text>
      </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

export default FullscreenImageBackground;
