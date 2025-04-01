import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import DatabaseService from "../services/DatabaseService";
import styles from "../style/MainStyle";
import LoadingScreen from "./LoadingScreen";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function restoreSession() {
        const authStatus = await DatabaseService.checkAuth();
        if (authStatus) {
          alert("User đã đăng nhập");
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

  const handleRegister = () => {
    console.log("Đăng ký với:", { username, email, password });
    DatabaseService.signUp(username, email, password).then((res) => {
      if (res.error) {
        console.log("Error:", res.error);
      } else {
        Alert.alert("Thông báo", "Đăng ký tài khoản thành công");
        router.push("./Home");
      }
    });
  };

  return (
    <View style={styles.containerCentered}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputFieldLabel}>Tên người dùng</Text>
        <TextInput style={styles.inputField} value={username} onChangeText={setUsername} placeholder="Nhập tên người dùng" />

        <Text style={styles.inputFieldLabel}>Email</Text>
        <TextInput
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          keyboardType="email-address"
        />

        <Text style={styles.inputFieldLabel}>Mật khẩu</Text>
        <TextInput
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.mainBtn} onPress={handleRegister}>
        <Text style={styles.mainBtnTxt}>ĐĂNG KÍ</Text>
      </TouchableOpacity>
    </View>
  );
}
