import { Stack, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import styles from "@style/MainStyle";
import AccIcon from "@views/AccIcon";

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
          headerRight: AccIcon,
          // headerShown: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: "GEARCALC", headerRight: () => null }} // Ẩn header cho trang này
        />
        <Stack.Screen name="views/Home" options={{ title: "Trang chủ", headerLeft: () => null }} />
        <Stack.Screen name="views/Login" options={{ title: "Đăng nhập", headerRight: () => null }} />
        <Stack.Screen name="views/Register" options={{ title: "Đăng ký", headerRight: () => null }} />
        <Stack.Screen name="views/AccountScreen" options={{ title: "Account", headerRight: () => null }} />
        <Stack.Screen name="views/CatalogView" options={{ title: "Catalog" }} />
        <Stack.Screen name="views/ComponentView" options={{ title: "Chi tiết" }} />
        <Stack.Screen name="views/DesignSelectionScreen" options={{ title: "Thiết kế" }} />
        <Stack.Screen name="views/SelectEngineScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="views/InputDataScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="views/AdjustEngineParametersScreen" options={{ title: "Động cơ" }} />
        <Stack.Screen name="views/PostEngineStatsView" options={{ title: "Động cơ" }} />
        <Stack.Screen name="views/InputChain" options={{ title: "Xích" }} />
        <Stack.Screen name="views/SelectChainScreen" options={{ title: "Xích" }} />
        <Stack.Screen name="views/PostChainStatsView" options={{ title: "Xích" }} />
        <Stack.Screen name="views/GearFast" options={{ title: "Bánh răng" }} />
        <Stack.Screen name="views/GearSlow" options={{ title: "Bánh răng" }} />
        <Stack.Screen name="views/GearResult" options={{ title: "Bánh răng" }} />
      </Stack>
    </PaperProvider>
  );
}
