import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";
import { scale } from "react-native-size-matters";
import ExitOnBack from "@views/common/ExitOnBack";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ExitOnBack />
      <View style={styles.optionCard}>
        <FontAwesome6 name="screwdriver-wrench" size={scale(100)} color="white" />
        <Button
          style={styles.mainBtn}
          mode="contained"
          compact={true}
          onPress={() => router.push("/views/design/selection/DesignSelectionScreen")}
        >
          <Text style={styles.mainBtnTxt}>Bắt đầu thiết kế</Text>
        </Button>
      </View>

      <View style={styles.optionCard}>
        <FontAwesome name="book" size={scale(100)} color="white" />
        <Button
          style={styles.mainBtn}
          mode="contained"
          compact={true}
          onPress={() => router.push("/views/catalog/CatalogView")}
        >
          <Text style={styles.mainBtnTxt}>Tra cứu catalog</Text>
        </Button>
      </View>
    </View>
  );
  // return (
  //   <View>
  //     <ExitOnBack />
  //     <BottomNav />
  //   </View>
  // );
}
