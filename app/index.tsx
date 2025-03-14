import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/catalog" style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Đi đến trang Tra cứu Catalog</Text>
      </Link>
    </View>
  );
}
