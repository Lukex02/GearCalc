import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "../style/RegisterStyle";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = () => {
    console.log("Đăng ký với:", { username, email, password });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ĐĂNG KÍ</Text>

      <Text style={styles.label}>Tên đăng nhập</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Nhập tên đăng nhập"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Nhập mật khẩu"
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/src/views/Home")}
      >
        <Text style={styles.buttonText}>ĐĂNG KÍ</Text>
      </TouchableOpacity>
    </View>
  );
}
