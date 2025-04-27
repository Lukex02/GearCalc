import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import DatabaseService from "@services/DatabaseService";
import styles from "@style/MainStyle";
import LoadingScreen from "@views/common/LoadingScreen";
import { Colors } from "@/src/style/Colors";

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
          router.push("/(tabs)/home");
        }
        setLoading(false);
      }
      restoreSession();
    }, [])
  );
  if (loading) return <LoadingScreen />;

  const handleRegister = () => {
    if (username.length < 3 || email.length < 3 || password.length < 6) {
      alert("Vui lòng nhập tên người dùng, email và mật khẩu ít nhất 3 ký tự");
      return;
    }
    console.log("Đăng ký với:", { username, email, password });
    DatabaseService.signUp(username, email, password).then((res) => {
      if (res.error) {
        console.log("Error:", res.error);
      } else {
        router.push("/(tabs)/home");
      }
    });
  };

  return (
    <View style={styles.containerCentered}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputFieldLabel}>Tên người dùng</Text>
        <TextInput
          style={styles.inputField}
          value={username}
          onChangeText={setUsername}
          placeholder="Nhập tên người dùng"
          placeholderTextColor={Colors.text.placeholder}
        />

        <Text style={styles.inputFieldLabel}>Email</Text>
        <TextInput
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          placeholderTextColor={Colors.text.placeholder}
          keyboardType="email-address"
        />

        <Text style={styles.inputFieldLabel}>Mật khẩu</Text>
        <TextInput
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          placeholderTextColor={Colors.text.placeholder}
          secureTextEntry
        />
      </View>
      <TouchableOpacity style={styles.mainBtn} onPress={handleRegister}>
        <Text style={styles.mainBtnTxt}>ĐĂNG KÍ</Text>
      </TouchableOpacity>
    </View>
  );
}
