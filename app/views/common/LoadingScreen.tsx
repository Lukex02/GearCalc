import Colors from "@/src/style/Colors";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

export default function LoadingScreen({ size }: { size?: number }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size={size ? size : "large"} color={Colors.primary} />
    </View>
  );
}
