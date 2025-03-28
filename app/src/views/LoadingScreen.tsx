import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, Text } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
