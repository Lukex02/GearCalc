import React, { useState } from "react";
import { View, TouchableOpacity, Image } from "react-native";
import { Appbar, IconButton, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../style/MainStyle";

const ComponentPage = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <View style={styles.container}>
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
      {/* Grid Layout */}
      <View style={styles.gridContainer}>
        {[...Array(6)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={styles.gridItem}
            onPress={() => router.push("/component")}
          >
            <Image
              source={{
                uri: "",
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

export default ComponentPage;
