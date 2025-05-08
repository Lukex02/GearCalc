import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import DatabaseService from "@services/DatabaseService";
import styles from "@style/MainStyle";
import LoadingScreen from "@views/common/LoadingScreen";
import { Colors } from "@/src/style/Colors";
import calcFooterStyle from "@/src/style/CalcFooterStyle";
import Header from "@views/common/Header";

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
          router.push("/(tabs)/home");
        }
        setLoading(false);
      }
      restoreSession();
    }, [])
  );
  if (loading) return <LoadingScreen />;

  const handleRegister = () => {
    if (username.length < 6 || email.length < 6 || password.length < 6) {
      alert("Vui lòng nhập tên người dùng, email và mật khẩu ít nhất 6 ký tự");
      return;
    }
    DatabaseService.signUp(username, email, password).then((res) => {
      if (res.error) {
        if (res.error.code === "email_exists") {
          alert("Email đã được sử dụng");
        } else if (res.error.code === "invalid_credentials") {
          alert("Tên người dùng, email và mật khẩu không sử dụng được");
        } else {
          alert("Đăng ký thất bại");
        }
      } else {
        router.push("/(tabs)/home");
      }
    });
  };

  return (
    <View style={styles.containerCentered}>
      <Header title="Đăng ký" />
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
      <View style={calcFooterStyle.buttonFooter}>
        <TouchableOpacity style={styles.mainBtnMedium} onPress={() => router.push("/views/auth/Login")}>
          <Text style={styles.mainBtnMediumTxt}>Về đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainBtnMedium} onPress={handleRegister}>
          <Text style={styles.mainBtnMediumTxt}>ĐĂNG KÍ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
