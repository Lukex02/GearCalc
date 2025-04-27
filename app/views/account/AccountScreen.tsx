import { View, Text, FlatList, Image, ScrollView, StyleSheet } from "react-native";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { useFocusEffect } from "@react-navigation/native";
import { useState, useCallback } from "react";
import { Button, IconButton, Portal, Snackbar, Modal, TouchableRipple } from "react-native-paper";
import DatabaseService from "@services/DatabaseService";
import LoadingScreen from "@views/common/LoadingScreen";
import styles from "@style/MainStyle";
import { Colors } from "@/src/style/Colors";
import CalcFooterStyle from "@/src/style/CalcFooterStyle";
import { FontAwesome5 } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import Reanimated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

export default function AccountScreen() {
  const [user, setUser] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalConfirmVisible] = useState(false);
  const [snackBarVisible, setsnackBarVisible] = useState(false);
  const [removeItemId, setRemoveItemId] = useState<number>(0);

  const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + scale(80) }],
      };
    });

    return (
      <Reanimated.View style={styleAnimation} pointerEvents="box-none">
        <TouchableRipple style={localStyles.swipeableDelete} onPress={() => handleRemove(removeItemId)}>
          <Text style={localStyles.swipeableDeleteTxt}>Xóa</Text>
        </TouchableRipple>
      </Reanimated.View>
    );
  };

  useFocusEffect(
    useCallback(() => {
      DatabaseService.getUser().then((user) => {
        if (user) {
          setUser(user);
          setLoading(false);
        }
      });
    }, [])
  );

  const handleRemoveAll = () => {
    DatabaseService.removeAllHistory().then((data) => {
      if (data) {
        setUser(data.user);
        setModalConfirmVisible(false);
        setsnackBarVisible(true);
      }
    });
  };

  const handleRemove = (historyId: any) => {
    DatabaseService.removeHistory(historyId).then((data) => {
      if (data) {
        setUser(data.user);
        setsnackBarVisible(true);
      }
    });
  };

  const handlePrint = (historyId: any) => {};

  return (
    <View style={styles.containerStart}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          style={styles.gridContainer}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.pageTitle}>Thông tin tài khoản</Text>
          <View style={{ ...styles.colContainer, width: "90%" }}>
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
              <Text style={styles.historyHeaderCell}>Xem</Text>
              <Text style={styles.historyHeaderCell}>In</Text>
            </View>

            {/* Body */}
            {user.user_metadata.history.length > 0 ? (
              <FlatList
                data={user.user_metadata.history} // Dùng cái này sau khi setup history
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Swipeable
                    renderRightActions={RightAction}
                    overshootRight={false}
                    friction={3}
                    onSwipeableOpen={(direction) => {
                      if (direction === "right") {
                        setRemoveItemId(item.id);
                      }
                    }}
                  >
                    <View style={styles.historyRow}>
                      <Text style={styles.historyCell}>{item.design._type}</Text>
                      <Text style={styles.historyCell}>{item.time}</Text>
                      <IconButton
                        icon="file-search"
                        iconColor={Colors.text.secondaryAccent}
                        size={20}
                        style={styles.utilBtnContainer}
                        onPress={() => console.log("IconButton Pressed")}
                      ></IconButton>

                      <IconButton
                        icon="printer"
                        size={20}
                        iconColor={Colors.text.success}
                        style={styles.utilBtnContainer}
                        onPress={() => console.log("IconButton Pressed")}
                      ></IconButton>
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
        </ScrollView>
      )}
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
    width: scale(80),
    backgroundColor: Colors.text.error,
    alignSelf: "center",
    justifyContent: "center",
    // width: "100%",
    // marginTop: scale(10),
  },
  swipeableDeleteTxt: {
    color: Colors.text.primary,
    fontWeight: "bold",
    fontSize: Math.round(scale(13)),
    textAlign: "center",
  },
});
