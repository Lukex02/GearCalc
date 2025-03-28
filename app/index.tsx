import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const FullscreenImageBackground: React.FC = () => {
  const router = useRouter();
  return (
    <View>
      <ImageBackground
        source={require("../assets/images/background.png")}
        style={styles.background}
      ></ImageBackground>
      <Text style={styles.overlay}>Welcome to GEAR CALC</Text>
      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={() => router.push("/home")}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FullscreenImageBackground;

const styles = StyleSheet.create({
  background: {
    marginTop: 40,
    width: width * 1,
    height: height * 0.55,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  overlay: {
    flex: 1,
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    fontFamily: "monospace",
    marginTop: 40,
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
    marginTop: 50,
    gap: 20,
  },
  buttonSmall: {
    backgroundColor: "#9CF2D4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 400, // Đặt chiều rộng nhỏ hơn cho nút
    alignSelf: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
});
