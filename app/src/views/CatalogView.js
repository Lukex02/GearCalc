import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Appbar, IconButton, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../style/MainStyle";

const CatalogPage = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {[...Array(6)].map((_, index) => (
          <TouchableOpacity key={index} style={styles.gridItem} onPress={() => router.push("/component")}>
            <Image source={require("../img/wrench.png")} style={styles.gridImage} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CatalogPage;
