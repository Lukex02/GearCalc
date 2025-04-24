import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import CalcController from "@controller/CalcController";
import CalcFooter from "@/views/common/CalcFooter";
import styles from "@style/MainStyle";

export default function SelectEngineScreen() {
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
      // console.log(postStats);
      setPostP(postStats.distShaft.p);
      setPostN(postStats.distShaft.n);
      setPostT(postStats.distShaft.T);
      setPostU(postStats.ratio);
      setIsValid(true);
    } else {
      alert("Động cơ không phù hợp, hãy chọn động cơ khác");
      router.back();
    }
  }, []);

  if (isValid) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Thông số động học</Text>
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
            {post_p.map((p, index) => (
              <Text key={index} style={{ ...styles.specHeaderCell, fontWeight: "normal", color: "white" }}>
                {p.toFixed(4)}
              </Text>
            ))}
          </View>

          {/* Cột Tốc độ quay trên các trục n */}
          <View style={styles.specCol}>
            <Text style={styles.specHeaderCell}>n{"\n"}(rpm)</Text>
            {post_n.map((n, index) => (
              <Text key={index} style={{ ...styles.specHeaderCell, fontWeight: "normal", color: "white" }}>
                {n.toFixed(2)}
              </Text>
            ))}
          </View>

          {/* Cột Momen xoắn trên các trục T */}
          <View style={styles.specCol}>
            <Text style={styles.specHeaderCell}>T{"\n"}(N.mm)</Text>
            {post_T.map((T, index) => (
              <Text key={index} style={{ ...styles.specHeaderCell, fontWeight: "normal", color: "white" }}>
                {T.toFixed(4)}
              </Text>
            ))}
          </View>

          {/* Cột Tỷ số truyền u */}
          <View style={styles.specCol}>
            <Text style={styles.specHeaderCell}>u{"\n"}</Text>
            {post_u.map((u, index) => (
              <Text key={index} style={styles.specCell}>
                {u.value.toFixed(2)}
              </Text>
            ))}
          </View>
        </View>

        {/* Truyền địa chỉ trang xích tiếp theo ở đây */}
        <CalcFooter nextPage="/views/design/chain/InputChain" />
      </View>
    );
  }
}
