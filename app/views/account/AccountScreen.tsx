import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import styles from "@style/MainStyle";
import { useState, useEffect } from "react";
import DatabaseService from "@services/DatabaseService";
import LoadingScreen from "@views/common/LoadingScreen";
import { Button } from "react-native-paper";

// Mẫu user data, vì chưa có history để làm
const history_prop = [
  { id: 1, design: "Hộp giảm tốc 2 cấp khai triển", time: "10h10" },
  { id: 2, design: "Hộp giảm tốc trục vít bánh răng", time: "10h10" },
  { id: 3, design: "Hộp giảm tốc 2 cấp khai triển", time: "10h10" },
  { id: 4, design: "Hộp giảm tốc trục vít bánh răng", time: "10h10" },
];

export default function AccountScreen() {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    DatabaseService.getUser().then((user) => {
      // Uncomment and check log to see user data
      // console.log(user);
      setUser(user);
      setLoading(false);
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Thông tin tài khoản</Text>
          <View style={styles.colContainer}>
            <Image
              style={styles.profileImg}
              source={require("@img/default-avatar.jpg")}
              resizeMode="contain"
            ></Image>
            <View style={styles.tableContainerPad10}>
              <Text style={{ color: "white" }}>
                <Text style={{ fontWeight: "bold" }}>Tên: </Text>
                {user.user_metadata.username}
              </Text>
              <Text style={{ color: "white" }}>
                <Text style={{ fontWeight: "bold" }}>Email: </Text>
                {user.email}
              </Text>
              <Text style={{ color: "white" }}>
                <Text style={{ fontWeight: "bold" }}>Số điện thoại: </Text>
                {user.phone}
              </Text>
            </View>
          </View>
          <Text style={styles.pageTitle}>Lịch sử tính toán</Text>
          <View style={styles.historyContainer}>
            {/* Header */}
            <View style={styles.historyHeader}>
              <Text style={styles.historyHeaderCell}>Thiết kế</Text>
              <Text style={styles.historyHeaderCell}>Thời gian</Text>
              <Text style={styles.historyHeaderCell}>Thông số</Text>
              <Text style={styles.historyHeaderCell}>In</Text>
            </View>

            {/* Body */}
            <FlatList
              // data={user.user_metadata.history} // Dùng cái này sau khi setup history
              data={history_prop}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.historyRow}>
                  <Text style={styles.historyCell}>{item.design}</Text>
                  <Text style={styles.historyCell}>{item.time}</Text>
                  <Button
                    style={styles.historySpecBtn}
                    mode="contained"
                    onPress={() => console.log("Button Pressed")}
                  >
                    <Text>Hiện</Text>
                  </Button>
                  <Button
                    mode="contained"
                    style={styles.historyPrintBtn}
                    onPress={() => console.log("Button Pressed")}
                  >
                    <Text>In</Text>
                  </Button>
                </View>
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
}
