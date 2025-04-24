import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";
import FooterNav from "@views/FooterNav"; // Đường dẫn đúng theo thư mục

export default function Home() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      {/* Nội dung chính */}
      <View style={[styles.container, { paddingBottom: 70 }]}>
        <View style={styles.optionCard}>
          <Image source={require("@img/wrench.png")} style={styles.optionCardImg} resizeMode="contain" />
          <TouchableOpacity
            style={styles.mainBtn}
            onPress={() => router.push("/views/design/selection/DesignSelectionScreen")}
          >
            <Text style={styles.mainBtnTxt}>Bắt đầu thiết kế</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.optionCard}>
          <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP.jA5Zk2-jFSqUJan7b9E42gHaHF?rs=1&pid=ImgDetMain",
            }}
            style={styles.optionCardImg}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/views/catalog/CatalogView")}>
            <Text style={styles.mainBtnTxt}>Tra cứu catalog</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer cố định ở dưới */}
      <FooterNav />
    </View>
  );
}
