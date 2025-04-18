import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alert, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import styles from "../style/MainStyle";
import calcFooterStyle from "../style/CalcFooterStyle";
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
          alert("User đã đăng nhập");
          router.push("./Home");
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
        console.log("Error:", res.error);
      } else {
        alert("Đăng nhập thành công");
        router.push("./Home");
      }
    });
  };

  return (
    <View style={styles.containerCentered}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputFieldLabel}>Email</Text>
        <TextInput style={styles.inputField} value={email} onChangeText={setEmail} placeholder="Nhập Email" />

        <Text style={styles.inputFieldLabel}>Mật khẩu</Text>
        <TextInput
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />
      </View>

      <View style={calcFooterStyle.buttonFooter}>
        <TouchableOpacity style={styles.mainBtnMedium} onPress={() => router.push("/src/views/Register")}>
          <Text style={styles.mainBtnMediumTxt}>ĐĂNG KÍ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.mainBtnMedium} onPress={handleLogin}>
          <Text style={styles.mainBtnMediumTxt}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
