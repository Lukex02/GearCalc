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
      <Link href="/src/views/CatalogView" style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Đi đến trang Tra cứu Catalog</Text>
      </Link>
      <Link href="/src/views/TestView" style={{ marginTop: 20 }}>
        <Text style={{ color: "blue" }}>Đi đến trang Test</Text>
      </Link>
    </View>
  );
}
