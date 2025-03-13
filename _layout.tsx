import React from "react";
import { PaperProvider } from "react-native-paper";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PaperProvider>
      <Stack />
    </PaperProvider>
  );
}
