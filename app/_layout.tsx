import { Stack, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import styles from "@style/MainStyle";
import AccIcon from "@views/common/AccIcon";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#9CF2D4" },
          headerTintColor: "Black",
          headerTitleStyle: styles.navTitle,
          headerTitleAlign: "center",
          headerBackTitle: "Quay lại",
          headerRight: AccIcon,
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="index" options={{ title: "GEARCALC", headerRight: () => null }} />
        <Stack.Screen name="views/auth/Login" options={{ title: "Đăng nhập", headerRight: () => null }} />
        <Stack.Screen name="views/auth/Register" options={{ title: "Đăng ký", headerRight: () => null }} />

        {/* Main Flow */}
        <Stack.Screen name="views/Home" options={{ title: "Trang chủ", headerLeft: () => null }} />
        <Stack.Screen
          name="views/account/AccountScreen"
          options={{ title: "Tài khoản", headerRight: () => null }}
        />
        <Stack.Screen name="views/catalog/CatalogView" options={{ title: "Danh mục" }} />
        <Stack.Screen name="views/catalog/ComponentView" options={{ title: "Chi tiết" }} />

        {/* Design Flow */}
        <Stack.Screen
          name="views/design/selection/DesignSelectionScreen"
          options={{ title: "Chọn thiết kế" }}
        />

        {/* Engine Flow */}
        <Stack.Screen name="views/design/engine/SelectEngineScreen" options={{ title: "Chọn động cơ" }} />
        <Stack.Screen name="views/design/engine/InputDataScreen" options={{ title: "Nhập thông số" }} />
        <Stack.Screen
          name="views/design/engine/AdjustEngineParametersScreen"
          options={{ title: "Điều chỉnh" }}
        />
        <Stack.Screen name="views/design/engine/PostEngineStatsView" options={{ title: "Kết quả động cơ" }} />

        {/* Chain Flow */}
        <Stack.Screen name="views/design/chain/InputChain" options={{ title: "Nhập thông số xích" }} />
        <Stack.Screen name="views/design/chain/SelectChainScreen" options={{ title: "Chọn xích" }} />
        <Stack.Screen name="views/design/chain/PostChainStatsView" options={{ title: "Kết quả xích" }} />

        {/* Gear Flow */}
        <Stack.Screen name="views/design/gear/GearFast" options={{ title: "Bánh răng nhanh" }} />
        <Stack.Screen name="views/design/gear/GearSlow" options={{ title: "Bánh răng chậm" }} />
        <Stack.Screen name="views/design/gear/GearResult" options={{ title: "Kết quả bánh răng" }} />
      </Stack>
    </PaperProvider>
  );
}
