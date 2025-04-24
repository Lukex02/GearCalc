import React from "react";
import { View, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";
import { Button } from "react-native-paper";

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
      <Button
        style={styles.mainBtn}
        mode="contained"
        compact={true}
        // onPress={() => router.push("/views/Home")}
        onPress={() => router.push("/views/auth/Login")}
      >
        <Text style={styles.mainBtnTxt}>Bắt đầu</Text>
      </Button>
      {/* <Button
        style={styles.mainBtn}
        mode="contained"
        compact={true}
        onPress={() => router.push("/views/auth/Login")}
      >
        <Text style={styles.mainBtnTxt}>Đăng nhập</Text>
      </Button>
      <Button
        style={styles.mainBtn}
        mode="contained"
        compact={true}
        onPress={() => router.push("/views/auth/Register")}
      >
        <Text style={styles.mainBtnTxt}>Đăng ký</Text>
      </Button> */}
      <Button
        style={styles.mainBtn}
        mode="contained"
        compact={true}
        onPress={() => router.push("/views/TestDiagram")}
      >
        <Text style={styles.mainBtnTxt}>Diagram</Text>
      </Button>
    </View>
  );
};

export default FullscreenImageBackground;
