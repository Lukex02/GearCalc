import { Stack, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import Colors from "@style/Colors";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <PaperProvider>
        <StatusBar style="light" backgroundColor={Colors.background} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#415A77" },
            animation: "slide_from_right",
            headerShown: false,
          }}
        >
          {/* Auth Flow */}
          <Stack.Screen name="index" />
          <Stack.Screen name="views/auth/Login" />
          <Stack.Screen name="views/auth/Register" />

          {/* Main Flow */}
          <Stack.Screen name="views/catalog/ComponentView" />

          {/* Design Flow */}
          <Stack.Screen name="views/design/selection/DesignSelectionScreen" />

          {/* Engine Flow */}
          <Stack.Screen name="views/design/engine/SelectEngineScreen" />
          <Stack.Screen name="views/design/engine/InputDataScreen" />
          <Stack.Screen name="views/design/engine/AdjustEngineParametersScreen" />
          <Stack.Screen name="views/design/engine/PostEngineStatsView" />

          {/* Chain Flow */}
          <Stack.Screen name="views/design/chain/InputChain" />
          <Stack.Screen name="views/design/chain/SelectChainScreen" />
          <Stack.Screen name="views/design/chain/PostChainStatsView" />

          {/* Gear Flow */}
          <Stack.Screen name="views/design/gear/GearFast" />
          <Stack.Screen name="views/design/gear/GearSlow" />
          <Stack.Screen name="views/design/gear/GearResult" />

          {/* Shaft Flow */}
          <Stack.Screen name="views/design/shaft/Shaft1-2Screen" />
          <Stack.Screen name="views/design/shaft/Shaft3-4Screen" />
          <Stack.Screen name="views/design/shaft/Shaft5Screen" />

          {/* Roller Bearing Flow */}
          <Stack.Screen name="views/design/rollerBearing/SelectRollerBearingScreen" />

          {/* Lubricant Flow */}
          <Stack.Screen name="views/design/lubricant/LubricantSelect" />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
