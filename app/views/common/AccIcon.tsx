import React, { useState, useEffect, Fragment } from "react";
import { router } from "expo-router";
import { View } from "react-native";
import { Menu, IconButton } from "react-native-paper";
import styles from "@style/MainStyle";
import DatabaseService from "@services/DatabaseService";

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
    router.push("/views/account/AccountScreen");
  };

  return (
    <Menu
      style={styles.menu}
      contentStyle={styles.menuContent}
      visible={menuVisible}
      onDismiss={closeMenu}
      anchorPosition="bottom"
      anchor={<IconButton icon="account-circle" iconColor="white" onPress={openMenu} size={30} />}
    >
      {login ? (
        <Fragment>
          <Menu.Item onPress={handleAccount} title="Tài khoản" titleStyle={styles.menuItem} />
          <Menu.Item
            onPress={() => {
              closeMenu();
              DatabaseService.logOut();
              setLogin(false);
              router.push("../../");
              alert("Đăng xuất thành công");
            }}
            title="Đăng xuất"
            titleStyle={styles.menuItem}
          />
        </Fragment>
      ) : (
        <Fragment>
          <Menu.Item
            onPress={() => {
              closeMenu();
              router.push("/views/auth/Login");
            }}
            title="Đăng nhập"
            titleStyle={styles.menuItem}
          />
          <Menu.Item
            onPress={() => {
              closeMenu();
              router.push("/views/auth/Register");
            }}
            title="Đăng ký"
            titleStyle={styles.menuItem}
          />
        </Fragment>
      )}
    </Menu>
  );
}
