import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Image, Text, ScrollView } from "react-native";
import { FAB, Portal } from "react-native-paper";
import { useRouter } from "expo-router";
import styles from "@style/MainStyle";
import LoadingScreen from "./LoadingScreen";
import DatabaseService from "@services/DatabaseService";
const CatalogPage = () => {
  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState<any[]>([]); // full catalog
  const [filteredCatalog, setFilteredCatalog] = useState<any[]>([]); // filtered catalog
  const [state, setState] = useState({ open: false });
  const onStateChange = ({ open }: { open: boolean }) => setState({ open });
  const { open } = state;
  const router = useRouter();

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
    // closeMenu(); // always close menu on filter select
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
        <ScrollView style={styles.gridContainer} contentContainerStyle={{ alignItems: "center" }}>
          {filteredCatalog.map((item: any, index) => (
            <TouchableOpacity
              key={index}
              style={styles.gridItem}
              onPress={() => router.push({ pathname: "./ComponentView", params: item })}
            >
              <Image source={require("../img/wrench.png")} style={styles.gridImage} resizeMode="contain" />

              {item.type === "Engine" && (
                <View style={styles.gridTextContainer}>
                  <Text style={styles.title}>Động cơ: {item.Motor_Type}</Text>
                  <Text style={styles.subtitle}>Công suất: {item.Power} kW</Text>
                  <Text style={styles.subtitle}>Tốc độ vòng quay: {item.Speed} vg/ph</Text>
                </View>
              )}

              {item.type === "chain" && (
                <View style={styles.gridTextContainer}>
                  <Text style={styles.title}>Loại: {printChainType(item.chain_type)}</Text>
                  <Text style={styles.title}>Bước Xích: {item.Step_p} (mm)</Text>
                  <Text style={styles.subtitle}>B min: {item.B_min} (mm)</Text>
                  <Text style={styles.subtitle}>Tải trọng phá hỏng Q: {item.Breaking_Load_Q} (kN)</Text>
                  <Text style={styles.subtitle}>Khối lượng 1 mét xích Q: {item.q_p} (kg)</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {/* <View style={{ alignSelf: "flex-start" }}> */}
      <Portal>
        <FAB.Group
          open={open}
          visible
          fabStyle={{ backgroundColor: "black" }}
          color="#9CF2D4"
          icon={open ? "backup-restore" : "menu"}
          actions={[
            {
              icon: "cogs",
              label: "Ổ lăn",
              color: "black",
              style: { backgroundColor: "#9CF2D4" },
              onPress: () => {},
            },
            {
              icon: "cogs",
              label: "Then",
              color: "black",
              style: { backgroundColor: "#9CF2D4" },
              onPress: () => {},
            },
            {
              icon: "cogs",
              label: "Xích",
              color: "black",
              style: { backgroundColor: "#9CF2D4" },
              onPress: () => filterByType("chain"),
            },
            {
              icon: "engine",
              label: "Động cơ điện",
              color: "black",
              style: { backgroundColor: "#9CF2D4" },
              onPress: () => filterByType("Engine"),
            },
            {
              icon: "select-all",
              label: "Tất cả",
              color: "black",
              style: { backgroundColor: "#9CF2D4" },
              onPress: () => filterByType("all"),
            },
          ]}
          onStateChange={onStateChange}
        />
      </Portal>
    </View>
    // </View>
  );
};

export default CatalogPage;
