import { Stack, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import styles from "@style/MainStyle";
import AccIcon from "@views/common/AccIcon";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#415A77" },
            headerTintColor: "white",
            headerTitleStyle: styles.navTitle,
            headerTitleAlign: "center",
            headerBackTitle: "Quay lại",
            headerRight: AccIcon,
            animation: "slide_from_right",
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen
            name="index"
            options={{
              title: "GEARCALC",
              headerRight: () => null,
              headerBackVisible: false,
              headerLeft: () => null,
            }}
          />
          <Stack.Screen name="views/auth/Login" options={{ title: "Đăng nhập", headerRight: () => null }} />
          <Stack.Screen name="views/auth/Register" options={{ title: "Đăng ký", headerRight: () => null }} />

          {/* Main Flow */}
          <Stack.Screen
            name="views/Home"
            options={{ title: "Trang chủ", headerBackVisible: false, headerLeft: () => null }}
          />
          <Stack.Screen
            name="views/account/AccountScreen"
            options={{ title: "Tài khoản", headerRight: () => null }}
          />
          <Stack.Screen name="views/catalog/CatalogView" options={{ title: "Catalog" }} />
          <Stack.Screen name="views/catalog/ComponentView" options={{ title: "Chi tiết" }} />

          {/* Design Flow */}
          <Stack.Screen
            name="views/design/selection/DesignSelectionScreen"
            options={{ title: "Chọn thiết kế" }}
          />

          {/* Engine Flow */}
          <Stack.Screen name="views/design/engine/SelectEngineScreen" options={{ title: "Động cơ" }} />
          <Stack.Screen name="views/design/engine/InputDataScreen" options={{ title: "Động cơ" }} />
          <Stack.Screen
            name="views/design/engine/AdjustEngineParametersScreen"
            options={{ title: "Động cơ" }}
          />
          <Stack.Screen name="views/design/engine/PostEngineStatsView" options={{ title: "Động cơ" }} />

          {/* Chain Flow */}
          <Stack.Screen name="views/design/chain/InputChain" options={{ title: "Xích" }} />
          <Stack.Screen name="views/design/chain/SelectChainScreen" options={{ title: "Xích" }} />
          <Stack.Screen name="views/design/chain/PostChainStatsView" options={{ title: "Xích" }} />

          {/* Gear Flow */}
          <Stack.Screen name="views/design/gear/GearFast" options={{ title: "Bánh răng" }} />
          <Stack.Screen name="views/design/gear/GearSlow" options={{ title: "Bánh răng" }} />
          <Stack.Screen name="views/design/gear/GearResult" options={{ title: "Bánh răng" }} />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
