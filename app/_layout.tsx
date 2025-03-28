import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      {/* Ở đây mang tính chất hiển thị và đặt tên, không có link trang với nhau */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#E48C8C" }, // Màu nền header
          headerTintColor: "white", // Màu chữ tiêu đề
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerBackTitle: "Quay lại", // Tiêu đề nút back (iOS)
          // headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Trang chủ" }} />
        <Stack.Screen name="catalog" options={{ title: "Catalog" }} />
        <Stack.Screen name="component" options={{ title: "Chi tiết" }} />
      </Stack>
    </PaperProvider>
  );
}
