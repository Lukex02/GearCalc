import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "../style/loginstyle";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    console.log("Đăng nhập với:", { username, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG NHẬP</Text>

      <Text style={styles.label}>Tên đăng nhập</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Nhập tên đăng nhập"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/src/views/Register")}
        >
          <Text style={styles.buttonText}>ĐĂNG KÍ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/src/views/Home")}
        >
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
