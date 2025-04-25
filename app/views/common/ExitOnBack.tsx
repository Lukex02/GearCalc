import { useFocusEffect } from "expo-router";
import { BackHandler, Platform } from "react-native";
import { useCallback } from "react";

export default function ExitOnBack() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS === "android") {
          BackHandler.exitApp(); // ⬅️ Thoát app
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [])
  );

  return null;
}
