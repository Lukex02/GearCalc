import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import styles from "../style/MainStyle";
// import DatabaseService from "../services/DatabaseService";

export default function GearCalc() {
  const router = useRouter();

  const handleGoToDesign = () => {
    router.push("/src/views/DesignSelectionScreen");
    // DatabaseService.checkAuth().then((authStatus) => {
    //   if (authStatus) {
    //     router.push("/src/views/DesignSelectionScreen");
    //   } else {
    //     Alert.alert("Thông báo", "Bạn cần phải đăng nhập để dùng tính năng này");
    //     router.push("./login");
    //   }
    // });
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.rowContainer}> */}
      <View style={styles.optionCard}>
        <Image source={require("../img/wrench.png")} style={styles.optionCardImg} resizeMode="contain" />
        <TouchableOpacity style={styles.mainBtn} onPress={handleGoToDesign}>
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
        <TouchableOpacity style={styles.mainBtn} onPress={() => router.push("/src/views/CatalogView")}>
          <Text style={styles.mainBtnTxt}>Tra cứu catalog</Text>
        </TouchableOpacity>
      </View>
      {/* </View> */}
    </View>
  );
}
