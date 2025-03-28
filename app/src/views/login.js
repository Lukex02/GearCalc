import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "../style/loginstyle";
import LoadingScreen from "./LoadingScreen";
import DatabaseService from "../services/DatabaseService";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function restoreSession() {
        const authStatus = await DatabaseService.checkAuth();
        if (authStatus) {
          Alert.alert("Thông báo", "User đã đăng nhập");
          router.push("./Home");
        } else {
          console.log("Chưa đăng nhập");
        }
        setLoading(false);
      }
      restoreSession();
    }, [])
  );

  if (loading) return <LoadingScreen />;

  const handleLogin = () => {
    // Perform login logic here
    console.log("Login:", email, password);
    DatabaseService.logIn(email, password).then((res) => {
      if (res.error) {
        console.log("Error:", res.error);
      } else {
        Alert.alert("Thông báo", "Đăng nhập thành công");
        router.push("./Home");
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Nhập Email" />

      <Text style={styles.label}>Mật khẩu</Text>
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Nhập mật khẩu" secureTextEntry />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => router.push("/src/views/Register")}>
          <Text style={styles.buttonText}>ĐĂNG KÍ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
