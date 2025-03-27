import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../style/homestyle";

export default function GearCalc() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="black"
          onPress={() => router.back()}
          style={styles.goBackButton}
        />
        <Text style={styles.title}>GEAR CALC</Text>
        <IconButton
          icon="account-circle"
          size={24}
          iconColor="black"
          onPress={() => router.push("/login")}
          style={styles.accountCircle}
        />
      </View>

      <View style={styles.optionContainer}>
        <View style={styles.card}>
          <Image
            source={{
              uri: "https://png.pngtree.com/png-clipart/20190517/original/pngtree-wrench-vector-icon-png-image_3746268.jpg",
            }}
            style={styles.image}
          />
          <TouchableOpacity style={styles.button}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/src/views/CatalogView")}
          >
            <Text style={styles.buttonText}>Tra cứu catalog</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
