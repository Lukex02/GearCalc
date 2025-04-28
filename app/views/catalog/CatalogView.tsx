import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text, ScrollView } from "react-native";
import { IconButton, Menu } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";
import { Colors } from "@style/Colors";
import LoadingScreen from "@views/common/LoadingScreen";
import DatabaseService from "@services/DatabaseService";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { scale, verticalScale } from "react-native-size-matters";
import Header from "@views/common/Header";

const CatalogPage = () => {
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState<any[]>([]); // full catalog
  const [filteredCatalog, setFilteredCatalog] = useState<any[]>([]); // filtered catalog
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });
  const { open } = state;
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const hideDrawer = () => setVisible(false);

  const printChainType = (type: string) => {
    switch (type) {
      case "1_roller":
        return "Xích con lăn 1 dãy";
      case "2_roller":
        return "Xích con lăn 2 dãy";
      default:
        return "Không xác định";
    }
  };

  const filterByType = (type: string) => {
    if (!type || type === "all") {
      setFilteredCatalog(catalog);
    } else {
      const filtered = catalog.filter((item) => item.type === type);
      setFilteredCatalog(filtered);
    }
    hideDrawer();
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
    <View style={styles.containerStart}>
      <View style={{ paddingHorizontal: scale(25), width: "100%" }}>
        <Header
          title="Tra cứu Catalog"
          rightIcon={
            <Menu
              visible={visible}
              onDismiss={hideDrawer}
              contentStyle={{ backgroundColor: Colors.background }}
              anchor={
                <IconButton
                  icon="filter-variant"
                  size={30}
                  style={{ margin: 0 }}
                  iconColor={Colors.text.primary}
                  onPress={showDrawer}
                />
              }
            >
              <Menu.Item
                title="Tất cả"
                titleStyle={{ color: Colors.text.primary }}
                onPress={() => filterByType("all")}
                leadingIcon="select-all"
              />
              <Menu.Item
                title="Động cơ điện"
                titleStyle={{ color: Colors.text.primary }}
                onPress={() => filterByType("Engine")}
                leadingIcon="engine"
              />
              <Menu.Item
                title="Xích"
                titleStyle={{ color: Colors.text.primary }}
                onPress={() => filterByType("chain")}
                leadingIcon="link"
              />
              <Menu.Item
                title="Then"
                titleStyle={{ color: Colors.text.primary }}
                onPress={() => filterByType("key_flat")}
                leadingIcon="screwdriver"
              />
              <Menu.Item
                title="Ổ lăn"
                titleStyle={{ color: Colors.text.primary }}
                onPress={() => filterByType("roller")}
                leadingIcon="movie-roll"
              />
            </Menu>
          }
        />{" "}
      </View>

      {loading && <LoadingScreen />}

      {!loading && (
        <ScrollView style={styles.gridContainer} contentContainerStyle={styles.scrollContainer}>
          {filteredCatalog.map((item: any, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push({ pathname: "/views/catalog/ComponentView", params: item })}
              activeOpacity={0.7}
            >
              {item.type === "Engine" && (
                <View style={styles.gridItem}>
                  <MaterialCommunityIcons
                    name="engine"
                    size={scale(50)}
                    style={styles.gridImage}
                    color={Colors.primary}
                  />
                  <View style={styles.gridTextContainer}>
                    <Text style={styles.title}>Động cơ: {item.Motor_Type}</Text>
                    <Text style={styles.subtitle}>Công suất: {item.Power} kW</Text>
                    <Text style={styles.subtitle}>Tốc độ vòng quay: {item.Speed} vg/ph</Text>
                  </View>
                </View>
              )}

              {item.type === "chain" && (
                <View style={styles.gridItem}>
                  <FontAwesome
                    name="chain"
                    size={scale(50)}
                    style={styles.gridImage}
                    color={Colors.primary}
                  />
                  <View style={styles.gridTextContainer}>
                    <Text style={styles.title}>{printChainType(item.chain_type)}</Text>
                    <Text style={styles.title}>Bước Xích: {item.Step_p} (mm)</Text>
                    <Text style={styles.subtitle}>B min: {item.B_min} (mm)</Text>
                    <Text style={styles.subtitle}>Tải trọng phá hỏng Q: {item.Breaking_Load_Q} (kN)</Text>
                    <Text style={styles.subtitle}>Khối lượng 1 mét xích Q: {item.q_p} (kg)</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default CatalogPage;
