import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    <PaperProvider>
      {/* Ở đây mang tính chất hiển thị và đặt tên, không có link trang với nhau */}
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#9FD8E6" }, // Màu nền header
          headerTintColor: "Black", // Màu chữ tiêu đề
          headerTitleStyle: { fontWeight: "bold", fontSize: 30 }, // Đậm tiêu đề
          headerTitleAlign: "center", // Căn giữa tiêu đề
          headerBackTitle: "Quay lại", // Tiêu đề nút back (iOS)
          // headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ title: "Trang chủ" }} />
        <Stack.Screen name="src/views/TestView" options={{ title: "Test" }} />
        <Stack.Screen name="src/views/AuthTest" options={{ title: "AuthTest" }} />
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
