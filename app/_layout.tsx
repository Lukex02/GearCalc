import { Stack, useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { IconButton, PaperProvider } from "react-native-paper";
import styles from "./src/style/MainStyle";
import DatabaseService from "./src/services/DatabaseService";

export default function RootLayout() {
  const router = useRouter();

  return (
    <PaperProvider>
      {/* Ở đây mang tính chất hiển thị và đặt tên, không có link trang với nhau */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#9CF2D4" },
          headerTintColor: "Black", // Màu chữ tiêu đề
          headerTitleStyle: styles.navTitle, // Đậm tiêu đề
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerBackTitle: "Quay lại", // Tiêu đề nút back (iOS)
          headerRight: () => (
            <IconButton icon="account-circle" iconColor="black" onPress={() => DatabaseService.logOut()} size={24} />
          ),
          // headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "GEARCALC", headerRight: () => null }} // Ẩn header cho trang này
        />
        <Stack.Screen name="src/views/Home" options={{ title: "Trang chủ", headerLeft: () => null }} />
        <Stack.Screen name="src/views/login" options={{ title: "Đăng nhập" }} />
        <Stack.Screen name="src/views/Register" options={{ title: "Đăng ký" }} />
        <Stack.Screen name="src/views/CatalogView" options={{ title: "Catalog" }} />
        <Stack.Screen name="src/views/ComponentView" options={{ title: "Chi tiết" }} />
        <Stack.Screen name="src/views/DesignSelectionScreen" options={{ title: "Thiết kế" }} />
        <Stack.Screen name="src/views/SelectEngineScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="src/views/InputDataScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="src/views/AdjustEngineParametersScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="src/views/PostEngineStatsView" options={{ title: "Động cơ" }} />
      </Stack>
    </PaperProvider>
  );
}
