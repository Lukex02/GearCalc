import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text, ScrollView } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "../style/MainStyle";
import LoadingScreen from "./LoadingScreen";
import DatabaseService from "../services/DatabaseService";
import { ScrollView } from "react-native-web";
const CatalogPage = () => {
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [catalog, setCatalog] = useState([]); // full catalog
  const [filteredCatalog, setFilteredCatalog] = useState([]); // filtered catalog
  const router = useRouter();

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const printChainType = (type) => {
    switch (type) {
      case "1_roller":
        return "Xích con lăn 1 dãy";
      case "2_roller":
        return "Xích con lăn 2 dãy";
      default:
        return "Không xác định";
    }
  };

  const filterByType = (type) => {
    closeMenu(); // always close menu on filter select
    if (!type || type === "all") {
      setFilteredCatalog(catalog);
    } else {
      const filtered = catalog.filter((item) => item.type === type);
      setFilteredCatalog(filtered);
    }
  };

  useEffect(() => {
    async function getCatalog() {
      const catalogFetch = await DatabaseService.getCatalogAll();
      setCatalog(catalogFetch);
      setFilteredCatalog(catalogFetch);
      setLoading(false);
    }
    getCatalog();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <LoadingScreen />}

      {!loading && (
        <ScrollView
          style={styles.gridContainer}
          contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}
        >
          {filteredCatalog.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => router.push({ pathname: "./ComponentView", params: item })}
            >
              <Image source={require("../img/wrench.png")} style={styles.gridImage} resizeMode="contain" />

              {item.type === "Engine" && (
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Động cơ: {item.Motor_Type}</Text>
                  <Text style={styles.subtitle}>Công suất: {item.Power}</Text>
                  <Text style={styles.subtitle}>Tốc độ vòng quay: {item.Speed}</Text>
                </View>
              )}

              {item.type === "chain" && (
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Loại: {printChainType(item.chain_type)}</Text>
                  <Text style={styles.title}>Bước Xích: {item.Step_p} (mm)</Text>
                  <Text style={styles.subtitle}>B min: {item.B_min}</Text>
                  <Text style={styles.subtitle}>Breaking Load Q: {item.Breaking_Load_Q}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <View>
        <Menu
          style={styles.menu}
          contentStyle={styles.menuContent}
          visible={menuVisible}
          onDismiss={closeMenu}
          anchorPosition="bottom"
          anchor={
            <IconButton icon="menu" iconColor="white" size={40} style={styles.menuBtn} onPress={openMenu} />
          }
        >
          <Menu.Item onPress={() => filterByType("Engine")} title="Động cơ điện" titleStyle={styles.menuItem} />
          <Menu.Item onPress={() => {}} title="Bánh răng trụ" titleStyle={styles.menuItem} />
          <Menu.Item onPress={() => filterByType("chain")} title="Xích" titleStyle={styles.menuItem} />
          <Menu.Item onPress={() => {}} title="Dây đai" titleStyle={styles.menuItem} />
          <Menu.Item onPress={() => {}} title="Ổ lăn" titleStyle={styles.menuItem} />
          <Menu.Item onPress={() => {}} title="Then" titleStyle={styles.menuItem} />
        </Menu>
      </View>
    </View>
  );
};

export default CatalogPage;
