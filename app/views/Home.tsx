import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import {
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Button, IconButton } from "react-native-paper";
import { useRouter, Href } from "expo-router";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import styles from "@style/MainStyle";
import { Colors } from "@/src/style/Colors";
import { scale, verticalScale } from "react-native-size-matters";
import ExitOnBack from "@views/common/ExitOnBack";
import { useSharedValue } from "react-native-reanimated";
import LogOutComponent from "@/views/common/LogOutComponent";
import Header from "@views/common/Header";
import DatabaseService from "@/src/services/DatabaseService";
import LoadingScreen from "./common/LoadingScreen";

const carouselData: { id: number; title: string; btnLabel: string; icon: any; navigate: Href }[] = [
  {
    id: 0,
    title: "Thiết kế",
    btnLabel: "Bắt đầu thiết kế",
    icon: <FontAwesome6 name="screwdriver-wrench" size={scale(100)} color={Colors.text.primary} />,
    navigate: "/views/design/selection/DesignSelectionScreen",
  },
  {
    id: 1,
    title: "Catalog",
    btnLabel: "Tra Catalog",
    icon: <FontAwesome name="book" size={scale(100)} color={Colors.text.primary} />,
    navigate: "/(tabs)/catalog",
  },
];
const width = Dimensions.get("window").width;

export default function Home() {
  const router = useRouter();
  const progress = useSharedValue<number>(0);
  const [userHistoryStats, setUserHistoryStats] = useState<any>(null);

  useEffect(() => {
    DatabaseService.getUserHistoryStats().then((history) => setUserHistoryStats(history));
  }, []);

  return (
    <View style={styles.containerStart}>
      <ExitOnBack />
      <View style={{ paddingHorizontal: scale(25), width: "100%" }}>
        <Header title="Trang chủ" rightIcon={<LogOutComponent />} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        style={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={{ ...homeStyle.title, marginBottom: 0 }}>Chức năng ưa thích</Text>
          <Carousel
            autoPlayInterval={2000}
            data={carouselData}
            height={scale(240)}
            loop={true}
            pagingEnabled={true}
            snapEnabled={true}
            width={width}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            onProgressChange={progress}
            renderItem={({ item, index, animationValue }) => {
              return (
                <View style={styles.optionCard} pointerEvents="box-none">
                  {item.icon}
                  <Button
                    style={styles.mainBtn}
                    mode="contained"
                    compact={true}
                    onPress={() => router.push(item.navigate)}
                  >
                    <Text style={styles.mainBtnTxt}>{item.btnLabel}</Text>
                  </Button>
                </View>
              );
            }}
          />
          <Pagination.Basic
            progress={progress}
            data={carouselData}
            activeDotStyle={{ backgroundColor: Colors.border.accent, borderRadius: 50 }}
            dotStyle={{ backgroundColor: Colors.overlay, borderRadius: 50 }}
            containerStyle={{ gap: 5, marginTop: scale(5) }}
          />
        </View>
        <View style={homeStyle.container}>
          <Text style={homeStyle.title}>Thiết kế gần đây</Text>
          <View style={styles.homeCard}>
            {userHistoryStats ? (
              <View style={styles.homeCardCol}>
                <Text style={styles.homeCardTxt}>
                  {userHistoryStats.recentHistory
                    ? userHistoryStats.recentHistory.design._type
                    : "Bạn chưa có thiết kế nào"}
                </Text>
                <FontAwesome
                  name="gears"
                  size={scale(50)}
                  color={Colors.text.primary}
                  style={{ alignSelf: "center" }}
                />
                <Text style={{ ...styles.homeCardTxt, fontStyle: "italic" }}>
                  Thời gian: {userHistoryStats.recentHistory ? userHistoryStats.recentHistory.time : ""}
                </Text>
              </View>
            ) : (
              <LoadingScreen />
            )}
            <View style={{ ...styles.homeCardCol, marginLeft: scale(5) }}>
              <Button
                style={styles.utilBtnContainer}
                onPress={() => console.log("IconButton Pressed")}
                mode="contained"
                labelStyle={{
                  color: Colors.text.secondaryAccent,
                }}
                contentStyle={{ flexDirection: "row-reverse" }}
                icon="file-search"
              >
                Xem
              </Button>
              <Button
                style={styles.utilBtnContainer}
                onPress={() => console.log("IconButton Pressed")}
                mode="contained"
                labelStyle={{
                  color: Colors.text.success,
                }}
                contentStyle={{ flexDirection: "row-reverse" }}
                icon="printer"
              >
                In
              </Button>
              <Button
                style={styles.utilBtnContainer}
                onPress={() => console.log("IconButton Pressed")}
                mode="contained"
                labelStyle={{
                  color: Colors.text.accent,
                }}
                contentStyle={{ flexDirection: "row-reverse" }}
                icon="file-document-edit"
              >
                Sửa
              </Button>
            </View>
          </View>
        </View>
        <View style={homeStyle.container}>
          <Text style={homeStyle.title}>Thống kê</Text>
          <View style={styles.homeColContainer}>
            {/* Thiết kế đang làm */}
            <View style={styles.homeCard1x2}>
              {userHistoryStats ? (
                <View style={{ gap: verticalScale(12) }}>
                  {userHistoryStats.recentUnfinishHistory ? (
                    <MaterialCommunityIcons
                      name="cog-pause"
                      size={scale(50)}
                      color={Colors.text.warning}
                      style={{ alignSelf: "center", margin: scale(10) }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="book-cancel"
                      size={scale(50)}
                      color={Colors.text.success}
                      style={{ alignSelf: "center", margin: scale(10) }}
                    />
                  )}
                  <Text style={styles.homeCardMedTxt}>
                    {userHistoryStats.recentUnfinishHistory
                      ? userHistoryStats.recentUnfinishHistory.design._type +
                        " (" +
                        userHistoryStats.recentUnfinishHistory.time +
                        ")"
                      : "Hiện tại không có"}
                  </Text>
                  {userHistoryStats.recentUnfinishHistory && (
                    <Button
                      style={{ ...styles.utilBtnContainer, alignSelf: "center", width: "100%" }}
                      onPress={() => console.log("IconButton Pressed")}
                      mode="contained"
                      compact={true}
                      labelStyle={{
                        color: Colors.text.accent,
                      }}
                      contentStyle={{ flexDirection: "row-reverse" }}
                      icon="file-document-edit"
                    >
                      Tiếp tục
                    </Button>
                  )}
                </View>
              ) : (
                <View style={{ margin: "auto" }}>
                  <LoadingScreen />
                </View>
              )}
              <Text style={styles.homeCardTxt}>Thiết kế đang làm</Text>
            </View>

            <View style={styles.homeRowContainer}>
              {/* Thiết kế đã thực hiện */}
              <View style={styles.homeCard1x1}>
                <Ionicons
                  name="checkmark-done"
                  size={scale(35)}
                  color={Colors.text.primary}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.homeCardBigTxt}>
                  {userHistoryStats ? userHistoryStats.designedNum : 0}
                </Text>
                <Text style={styles.homeCardTxt}>Đã thực hiện</Text>
              </View>

              {/* Thiết kế in nhiều nhất */}
              <View style={styles.homeCard1x1}>
                <FontAwesome5
                  name="print"
                  size={scale(35)}
                  color={Colors.text.primary}
                  style={{ alignSelf: "center" }}
                />
                <Text style={styles.homeCardBigTxt}>
                  {userHistoryStats ? userHistoryStats.printedNum : 0}
                </Text>
                <Text style={styles.homeCardTxt}>Thiết kế đã in</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const homeStyle = StyleSheet.create({
  title: {
    fontSize: scale(14),
    color: Colors.text.primary,
    marginHorizontal: scale(20),
    marginBottom: verticalScale(10),
  },
  container: {
    width: "100%",
  },
});
