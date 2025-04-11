import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { View, Alert } from "react-native";
import { Menu, IconButton } from "react-native-paper";
import styles from "../style/MainStyle";
import DatabaseService from "../services/DatabaseService";

export default function AccIcon() {
  const [login, setLogin] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await DatabaseService.checkAuth();
      if (authStatus) {
        setLogin(true);
      }
    };
    checkAuth();
  }, []);

  const handleAccount = () => {
    closeMenu();
    router.push("/src/views/AccountScreen"); // Chuyển đến trang AccountScreen
  };
  return (
    <Menu
      style={styles.menu}
      contentStyle={styles.menuContent}
      visible={menuVisible}
      onDismiss={closeMenu}
      anchorPosition="bottom"
      anchor={<IconButton icon="account-circle" iconColor="black" onPress={openMenu} size={30} />}
    >
      {login ? (
        <View>
          <Menu.Item onPress={handleAccount} title="Tài khoản" titleStyle={styles.menuItem} />
          <Menu.Item
            onPress={() => {
              closeMenu();
              DatabaseService.logOut();
              setLogin(false);
              alert("Đăng xuất thành công");
            }}
            title="Đăng xuất"
            titleStyle={styles.menuItem}
          />
        </View>
      ) : (
        <View>
          <Menu.Item
            onPress={() => {
              closeMenu();
              router.push("/src/views/Login");
            }}
            title="Đăng nhập"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              router.push("/src/views/Register");
            }}
            title="Đăng ký"
            titleStyle={styles.menuItem}
          />
        </View>
      )}
    </Menu>
  );
}
