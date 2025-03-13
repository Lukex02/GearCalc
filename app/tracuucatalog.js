import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Appbar, IconButton, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "./style/tracuustyle";

const CatalogPage = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Menu
          style={styles.menu}
          contentStyle={styles.menuContent}
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="menu"
              iconColor="white"
              size={24}
              onPress={openMenu}
            />
          }
        >
          <Menu.Item
            onPress={() => {}}
            title="Trục vít"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {}}
            title="Bánh răng trụ"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {}}
            title="Bánh răng côn"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {}}
            title="Vật liệu bánh răng"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {}}
            title="Số cấp giảm tốc"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {}}
            title="Loại ổ trục"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {}}
            title="Kích thước và tiêu chuẩn lắp ghép"
            titleStyle={styles.menuItem}
          />
        </Menu>
        <Appbar.Content title="GEARBOX CALCULATOR" titleStyle={styles.title} />
        <IconButton
          icon="account-circle"
          style={styles.accountCircle}
          iconColor="white"
          size={24}
        />
      </Appbar.Header>

      <View style={styles.gridContainer}>
        {[...Array(6)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => router.push("/chitiet")}
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
