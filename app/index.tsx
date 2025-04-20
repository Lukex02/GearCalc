import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";

const FullscreenImageBackground: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
        source={require("@img/background.png")}
        style={styles.indexBackground}
        resizeMode="contain"
      ></Image>
      <Text style={styles.welcomeTitle}>Chào mừng tới GEARCALC</Text>
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/views/Home")}>
        <Text style={styles.mainBtnTxt}>Bắt đầu</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/views/auth/Login")}>
        <Text style={styles.mainBtnTxt}>Đăng nhập</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/views/auth/Register")}>
        <Text style={styles.mainBtnTxt}>Tạo tài khoản</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/views/TestDiagram")}>
        <Text style={styles.mainBtnTxt}>Diagram</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FullscreenImageBackground;
