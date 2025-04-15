import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import styles from "./src/style/MainStyle";
import AccIcon from "./src/views/AccIcon";

export default function RootLayout() {
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
          headerRight: AccIcon,
          // headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "GEARCALC", headerRight: () => null }} // Ẩn header cho trang này
        />
        <Stack.Screen name="src/views/Home" options={{ title: "Trang chủ", headerLeft: () => null }} />
        <Stack.Screen name="src/views/Login" options={{ title: "Đăng nhập", headerRight: () => null }} />
        <Stack.Screen name="src/views/Register" options={{ title: "Đăng ký", headerRight: () => null }} />
        <Stack.Screen
          name="src/views/AccountScreen"
          options={{ title: "Account", headerRight: () => null }}
        />
        <Stack.Screen name="src/views/CatalogView" options={{ title: "Catalog" }} />
        <Stack.Screen name="src/views/ComponentView" options={{ title: "Chi tiết" }} />
        <Stack.Screen name="src/views/DesignSelectionScreen" options={{ title: "Thiết kế" }} />
        <Stack.Screen name="src/views/SelectEngineScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="src/views/InputDataScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="src/views/AdjustEngineParametersScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="src/views/PostEngineStatsView" options={{ title: "Động cơ" }} />
        <Stack.Screen name="src/views/InputChain" options={{ title: "Xích" }} />
        <Stack.Screen name="src/views/SelectChainScreen" options={{ title: "Xích" }} />
        <Stack.Screen name="src/views/PostChainStatsView" options={{ title: "Xích" }} />
        <Stack.Screen name="src/views/GearFast" options={{ title: "Bánh răng" }} />
        <Stack.Screen name="src/views/GearSlow" options={{ title: "Bánh răng" }} />
        <Stack.Screen name="src/views/GearResult" options={{ title: "Bánh răng" }} />
      </Stack>
    </PaperProvider>
  );
}
