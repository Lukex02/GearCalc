import { View, Text, FlatList, Image, ScrollView, StyleSheet, Dimensions } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { Button, IconButton, Portal, Snackbar, Modal, TouchableRipple } from "react-native-paper";
import DatabaseService from "@services/DatabaseService";
import LoadingScreen from "@views/common/LoadingScreen";
import styles from "@style/MainStyle";
import { Colors } from "@/src/style/Colors";
import CalcFooterStyle from "@/src/style/CalcFooterStyle";
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";
import Utils from "@services/Utils";

const { width } = Dimensions.get("window");

export default function AccountScreen() {
  const [user, setUser] = useState<any>();
  const [history, setHistory] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalConfirmVisible] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [selectItemId, setSelectItemId] = useState<number>(0);

  const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + width / 7 }],
      };
    });
    return (
      <Reanimated.View style={styleAnimation}>
        <TouchableRipple style={localStyles.swipeableDelete} onPress={() => handleRemove(selectItemId)}>
          <Text style={localStyles.swipeableTxt}>Xóa</Text>
        </TouchableRipple>
      </Reanimated.View>
    );
  };

  const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - (width / 7) * 3 }],
      };
    });
    return (
      <Reanimated.View style={styleAnimation}>
        <View style={localStyles.swipeableContainer}>
          <TouchableRipple style={localStyles.swipeableUtils} onPress={() => handlePrint(selectItemId)}>
            <MaterialCommunityIcons
              name="printer"
              color={Colors.text.success}
              style={localStyles.swipeableIcon}
            />
          </TouchableRipple>
          <TouchableRipple style={localStyles.swipeableUtils} onPress={() => handleView(selectItemId)}>
            <MaterialCommunityIcons
              name="file-search"
              color={Colors.text.secondaryAccent}
              style={localStyles.swipeableIcon}
            />
          </TouchableRipple>
          <TouchableRipple style={localStyles.swipeableUtils} onPress={() => handleEdit(selectItemId)}>
            <FontAwesome6 name="edit" color={Colors.text.accent} style={localStyles.swipeableIcon} />
          </TouchableRipple>
        </View>
      </Reanimated.View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      DatabaseService.getUser().then((user) => {
        if (user) {
          setUser(user);
          DatabaseService.getUserAllHistory().then((history) => {
            setHistory(history);
            setLoading(false);
          });
        }
      });
    }, [history])
  );

  const handleRemoveAll = () => {
    DatabaseService.removeAllHistory().then((data) => {
      if (data) {
        setHistory(data);
        setModalConfirmVisible(false);
        setsnackBarVisible(true);
      }
    });
  };

  const handleRemove = (historyId: any) => {
    DatabaseService.removeHistory(historyId).then((data) => {
      if (data) {
        setHistory(data);
        setsnackBarVisible(true);
      }
    });
  };

  const handlePrint = (historyId: any) => {
    Utils.printReportPDF(historyId);
  };

  const handleView = (historyId: any) => {
    alert("Chức năng chưa phát triển");
  };

  const handleEdit = (historyId: any) => {
    alert("Chức năng chưa phát triển");
  };

  return loading ? (
    <View style={styles.container}>
      <LoadingScreen />
    </View>
  ) : (
    <View style={{ ...styles.containerStart, justifyContent: "space-evenly", gap: 0, paddingTop: scale(10) }}>
      <Text style={styles.pageTitle}>Thông tin tài khoản</Text>
      <View style={{ ...styles.colContainer, width: "90%" }}>
        <Image
          style={styles.profileImg}
          source={require("@img/default-avatar.jpg")}
          resizeMode="contain"
        ></Image>
        <View style={styles.tableContainerPad10}>
          <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Tên: </Text>
            <Text style={{ color: "white" }}>{user.user_metadata.username}</Text>
          </View>
          <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Email: </Text>
            <Text style={{ color: "white" }}>{user.email}</Text>
          </View>
          <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
            <Text style={{ color: "white", fontWeight: "bold" }}>Thiết kế đã lưu: </Text>
            <Text style={{ color: "white" }}>{user.user_metadata.history.length}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.pageTitle}>Lịch sử tính toán</Text>
      <View style={styles.historyContainer}>
        {/* Header */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyHeaderCell}>Tên</Text>
          <Text style={styles.historyHeaderCell}>Thời gian</Text>
          <Text style={styles.historyHeaderCell}>Trạng thái</Text>
        </View>

        {/* Body */}
        {history && history.length > 0 ? (
          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Swipeable
                renderRightActions={RightAction}
                renderLeftActions={LeftAction}
                overshootRight={false}
                overshootLeft={false}
                friction={2}
                onSwipeableOpen={() => setSelectItemId(item.id)}
              >
                <View style={styles.historyRow}>
                  <Text style={styles.historyCell}>{item.type}</Text>
                  <Text style={styles.historyCell}>{new Date(item.time).toLocaleString()}</Text>
                  <View style={styles.historyCell}>
                    <Text
                      style={{
                        ...styles.historyStatusCell,
                        backgroundColor: item.isFinish ? Colors.text.success : Colors.text.warning,
                      }}
                    >
                      {item.isFinish ? "Đã xong" : "Chưa xong"}
                    </Text>
                  </View>
                </View>
              </Swipeable>
            )}
          />
        ) : (
          <View>
            <Text style={styles.noDataWarn}>Không có lịch sử tính toán</Text>
          </View>
        )}

        <Button
          mode="contained"
          style={styles.deleteBtn}
          labelStyle={styles.deleteBtnTxt}
          onPress={() => setModalConfirmVisible(true)}
        >
          Xóa tất cả
        </Button>
      </View>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalConfirmVisible(false)} style={styles.overlay}>
          <View style={styles.modalView}>
            <FontAwesome5 name="exclamation-triangle" size={scale(30)} color={Colors.primary} />
            <Text style={styles.modalMediumTxt}>
              Bạn có chắc chắn muốn xóa tất cả lịch sử tính toán không?
            </Text>
            <View style={CalcFooterStyle.buttonFooter}>
              <Button
                mode="contained"
                style={{ ...styles.mainBtnSmall, backgroundColor: "gray" }}
                labelStyle={{ ...styles.mainBtnSmallTxt, color: "white" }}
                onPress={() => setModalConfirmVisible(false)}
                rippleColor={"rgba(0, 0, 0, 0.29)"}
              >
                Đóng
              </Button>
              <Button
                mode="contained"
                style={styles.mainBtnSmall}
                labelStyle={styles.mainBtnSmallTxt}
                onPress={handleRemoveAll}
              >
                Đồng ý
              </Button>
            </View>
          </View>
        </Modal>
        <Snackbar
          visible={snackBarVisible}
          onDismiss={() => setsnackBarVisible(false)}
          duration={2000}
          style={{
            ...styles.overlay,
            backgroundColor: Colors.cardDark,
            borderRadius: 30,
          }}
        >
          <Text style={styles.modalMediumTxt}>Đã xóa thành công!</Text>
        </Snackbar>
      </Portal>
    </View>
  );
}

const localStyles = StyleSheet.create({
  swipeableDelete: {
    flex: 1,
    width: width / 7,
    backgroundColor: Colors.text.error,
    alignSelf: "center",
    justifyContent: "center",
  },
  swipeableUtils: {
    width: width / 7,
    height: "100%",
    backgroundColor: Colors.background,
    alignSelf: "center",
    justifyContent: "center",
  },
  swipeableTxt: {
    color: Colors.text.primary,
    fontWeight: "bold",
    fontSize: Math.round(scale(13)),
    textAlign: "center",
  },
  swipeableIcon: {
    fontSize: Math.round(scale(16)),
    textAlign: "center",
  },
  swipeableContainer: {
    flex: 1,
    width: scale(150),
    alignSelf: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
});
