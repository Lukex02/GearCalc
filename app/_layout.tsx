import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { IconButton, PaperProvider } from "react-native-paper";
import DatabaseService from "./src/services/DatabaseService";
import LoadingScreen from "./src/views/LoadingScreen";

export default function RootLayout() {
  const router = useRouter();

  return (
    <PaperProvider>
      {/* Ở đây mang tính chất hiển thị và đặt tên, không có link trang với nhau */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#9FD8E6" },
          headerTintColor: "Black", // Màu chữ tiêu đề
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 30,
            fontFamily: "monospace",
          }, // Đậm tiêu đề
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerBackTitle: "Quay lại", // Tiêu đề nút back (iOS)
          headerRight: () => (
            // <IconButton icon="account-circle" iconColor="black" onPress={() => router.push("/src/views/login")} size={24} />
            // Redirect to User Account Info Page
            <IconButton icon="account-circle" iconColor="black" onPress={() => router.push("/src/views/login")} size={24} />
          ),
          // headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "GEARCALC", headerRight: () => null }} // Ẩn header cho trang này
        />
        <Stack.Screen name="src/views/Home" options={{ title: "Trang chủ", headerBackVisible: false }} />
        <Stack.Screen name="src/views/login" options={{ title: "Đăng nhập" }} />
        <Stack.Screen name="src/views/Register" options={{ title: "Đăng ký" }} />
        <Stack.Screen name="src/views/CatalogView" options={{ title: "Catalog" }} />
        <Stack.Screen name="src/views/ComponentView" options={{ title: "Chi tiết" }} />
        <Stack.Screen name="src/views/DesignSelectionScreen" options={{ title: "Gear Calc" }} />
        <Stack.Screen name="src/views/SelectEngineScreen" options={{ title: "Gear Calc" }} />
        <Stack.Screen name="src/views/InputDataScreen" options={{ title: "Gear Calc" }} />
        <Stack.Screen name="src/views/AdjustEngineParametersScreen" options={{ title: "Gear Calc" }} />
      </Stack>
    </PaperProvider>
  );
}
