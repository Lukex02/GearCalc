import React from "react";
import { ScrollView, View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import styles from "../style/homestyle";

export default function GearCalc() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
      <View style={styles.optionContainer}>
        <View style={styles.card}>
          <Image source={require("../img/wrench.png")} style={styles.image} />
          <TouchableOpacity style={styles.button} onPress={() => router.push("/src/views/DesignSelectionScreen")}>
            <Text style={styles.buttonText}>Bắt đầu thiết kế</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Image
            source={{
              uri: "https://th.bing.com/th/id/OIP.jA5Zk2-jFSqUJan7b9E42gHaHF?rs=1&pid=ImgDetMain",
            }}
            style={styles.image}
          />
          <TouchableOpacity style={styles.button} onPress={() => router.push("/src/views/CatalogView")}>
            <Text style={styles.buttonText}>Tra cứu catalog</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
