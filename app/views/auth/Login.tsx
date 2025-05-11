import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";
import { Colors } from "@style/Colors";
import calcFooterStyle from "@style/CalcFooterStyle";
import LoadingScreen from "@views/common/LoadingScreen";
import DatabaseService from "@services/DatabaseService";
import Header from "@views/common/Header";

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
          // router.push("/(tabs)/home");
          console.log(authStatus);
        }
        setLoading(false);
      }
      restoreSession();
    }, [])
  );

  if (loading) return <LoadingScreen />;

  const handleLogin = () => {
    // Perform login logic here
    DatabaseService.logIn(email, password).then((res) => {
      if (res.error) {
        if (res.error.code === "invalid_credentials") {
          alert("Email hoặc mật khẩu không chính xác");
        } else {
          alert("Đăng nhập thất bại");
        }
      } else {
        alert("Đăng nhập thành công");
        router.push("/(tabs)/home");
      }
    });
  };

  return (
    <View style={styles.containerCentered}>
      <Header title="Đăng nhập" />
      <View style={styles.inputContainer}>
        <Text style={styles.inputFieldLabel}>Email</Text>
        <TextInput
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập Email"
          placeholderTextColor={Colors.text.placeholder}
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
        <TouchableOpacity style={styles.mainBtnMedium} onPress={() => router.push("/views/auth/Register")}>
          <Text style={styles.mainBtnMediumTxt}>ĐĂNG KÍ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainBtnMedium} onPress={handleLogin}>
          <Text style={styles.mainBtnMediumTxt}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
