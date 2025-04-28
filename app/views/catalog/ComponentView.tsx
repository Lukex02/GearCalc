import React from "react";
import { View, Image, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import styles from "@style/MainStyle";
import { Colors } from "@style/Colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import CalcFooter from "@views/common/CalcFooter";
import Header from "@views/common/Header";

const ComponentPage = () => {
  const data = useLocalSearchParams();

  const printChainType = (type: any) => {
    switch (type) {
      case "1_roller":
        return "Xích con lăn 1 dãy";
      case "2_roller":
        return "Xích con lăn 2 dãy";
      default:
        return "Không xác định";
    }
  };
  return (
    (data.type === "Engine" && (
      <View style={styles.container}>
        <Header title="Thông số kỹ thuật" />
        <MaterialCommunityIcons
          name="engine"
          size={scale(120)}
          style={styles.componentImg}
          color={Colors.primary}
        />
        <Text style={styles.componentTitle}>Động cơ điện {data.Motor_Type}</Text>
        <View style={styles.componentInfoContainer}>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Công suất:</Text> {data.Power} kW
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Tốc độ vòng quay:</Text> {data.Speed} vòng/phút
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Hệ số công suất:</Text> {data.Efficiency}%
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Hiệu suất động cơ:</Text> {data.H}
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Momen khởi động / Momen danh nghĩa:</Text> {data["Tk/Tdn"]}
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Momen tối đa / Momen danh nghĩa:</Text> {data["Tmax/Tdn"]}
          </Text>
        </View>
        <CalcFooter />
      </View>
    )) ||
    (data.type === "chain" && (
      <View style={styles.container}>
        <Header title="Thông số kỹ thuật" />
        <FontAwesome name="chain" size={scale(120)} style={styles.componentImg} color={Colors.primary} />
        <Text style={styles.componentTitle}>{printChainType(data.chain_type)}</Text>
        <View style={styles.componentInfoContainer}>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Bước xích:</Text> {data.Step_p} (mm)
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Công suất cho phép [P]:</Text> {data.Power_Allow_P} (kW)
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>B nhỏ nhất:</Text> {data.Speed} (mm)
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>d_0:</Text> {data.d_0} (mm)
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>l:</Text> {data.l + " (mm)" || "Không có dữ liệu"}
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>h lớn nhất:</Text> {data.h_max} (mm)
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>b lớn nhất:</Text> {data.b_max} (mm)
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Tải trọng phá hỏng Q:</Text> {data.Breaking_Load_Q} (N)
          </Text>
          <Text style={styles.componentInfo}>
            <Text style={styles.componentInfoName}>Khối lượng 1 mét xích:</Text> {data.q_p} (kg)
          </Text>
        </View>
        <CalcFooter />
      </View>
    ))
  );
};

export default ComponentPage;
