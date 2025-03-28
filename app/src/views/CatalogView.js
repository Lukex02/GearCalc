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
      <Appbar.Header style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor="black"
          onPress={() => router.back()}
          style={styles.goBackButton}
        />
        <Appbar.Content title="GEAR CALC" titleStyle={styles.title} />
        <IconButton
          icon="account-circle"
          style={styles.accountCircle}
          iconColor="black"
          size={24}
        />
      </Appbar.Header>

      <View style={styles.gridContainer}>
        {[...Array(6)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => router.push("/component")}
          >
            <Image
              source={{
                uri: "https://png.pngtree.com/png-clipart/20190517/original/pngtree-wrench-vector-icon-png-image_3746268.jpg",
              }}
              style={styles.gridImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default CatalogPage;
