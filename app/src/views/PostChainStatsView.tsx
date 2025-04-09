import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import CalcController from "../controller/CalcController";
import CalcFooter from "./CalcFooter";
import styles from "../style/MainStyle";

export default function PostChainStatsView() {
  const router = useRouter(); // Khởi tạo router để điều hướng
  const calcController = CalcController.getInstance();
  const [isValid, setIsValid] = useState(false);
  const postStats = calcController.getEnginePostStats();
  const [post_p, setPostP] = useState<number[]>([]);
  const [post_n, setPostN] = useState<number[]>([]);
  const [post_T, setPostT] = useState<number[]>([]);
  const [post_u, setPostU] = useState<any[]>([]);

  useEffect(() => {
    if (postStats) {
      setPostP(postStats.newEngineShaftStats.p);
      setPostN(postStats.newEngineShaftStats.n);
      setPostT(postStats.newEngineShaftStats.T);
      setPostU(postStats.rearrangedRatio);
      setIsValid(true);
    } else {
      alert("Xích không phù hợp, hãy chọn Xích khác");
      Alert.alert("Thông báo", "Xích không phù hợp, hãy chọn Xích khác");
      router.back();
    }
  }, []);

  if (isValid) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Thông số Xích</Text>
        </View>
        <View style={styles.specContainer}>
          {/* Header */}
          <View style={styles.specHeader}>
            <Text style={styles.specHeaderCell}>Thông số</Text>
            <Text style={styles.specHeaderCell}>Trục động cơ</Text>
            <Text style={styles.specHeaderCell}>Trục 1</Text>
            <Text style={styles.specHeaderCell}>Trục 2</Text>
            <Text style={styles.specHeaderCell}>Trục 3</Text>
            <Text style={styles.specHeaderCell}>Trục công tác</Text>
          </View>

          {/* Cột Công suất trên các trục p */}
          <View style={styles.specCol}>
            <Text style={styles.specHeaderCell}>P{"\n"}(kW)</Text>
            {/* {dummyP.map((p) => ( */}
            {post_p.map((p) => (
              <Text style={styles.specCell}>{p.toFixed(4)}</Text>
            ))}
          </View>

          {/* Cột Tốc độ quay trên các trục n */}
          <View style={styles.specCol}>
            <Text style={styles.specHeaderCell}>n{"\n"}(rpm)</Text>
            {/* {dummyN.map((n) => ( */}
            {post_n.map((n) => (
              <Text style={styles.specCell}>{n.toFixed(2)}</Text>
            ))}
          </View>

          {/* Cột Momen xoắn trên các trục T */}
          <View style={styles.specCol}>
            <Text style={styles.specHeaderCell}>T{"\n"}(N.mm)</Text>
            {/* {dummyT.map((T) => ( */}
            {post_T.map((T) => (
              <Text style={styles.specCell}>{T.toFixed(4)}</Text>
            ))}
          </View>

          {/* Cột Tỷ số truyền u */}
          <View style={styles.specCol}>
            <Text style={styles.specHeaderCell}>u{"\n"}</Text>
            {/* {dummyU.map((u) => ( */}
            {post_u.map((u) => (
              <Text style={styles.specCell}>{u.value.toFixed(2)}</Text>
            ))}
          </View>
        </View>

        {/* Truyền địa chỉ trang xích tiếp theo ở đây */}
        <CalcFooter nextPage="./src/views/GearFast" />
      </View>
    );
  }
}
