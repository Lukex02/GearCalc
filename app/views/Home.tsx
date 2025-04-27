import React from "react";
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

  return (
    <View style={styles.containerStart}>
      <ExitOnBack />
      <Header title="Trang chủ" rightIcon={<LogOutComponent />} />
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
            <View style={styles.homeCardCol}>
              {/* <Text style={styles.homeCardTxt}>{recentDesign}</Text> */}
              <Text style={styles.homeCardTxt}>Hộp giảm tốc 2 cấp khai triển</Text>
              <FontAwesome
                name="gears"
                size={scale(50)}
                color={Colors.text.primary}
                style={{ alignSelf: "center" }}
              />
              <Text style={{ ...styles.homeCardTxt, fontStyle: "italic" }}>Thời gian: 10:10 12/7/2025</Text>
            </View>
            <View style={styles.homeCardCol}>
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
            </View>
          </View>
        </View>
        <View style={homeStyle.container}>
          <Text style={homeStyle.title}>Thống kê</Text>
          <View style={styles.homeColContainer}>
            {/* Thiết kế hiện tại */}
            <View style={styles.homeCard1x2}>
              <View>
                <MaterialCommunityIcons
                  name="book-cancel"
                  size={scale(50)}
                  color={Colors.text.primary}
                  style={{ alignSelf: "center", margin: scale(10) }}
                />
                {/* <BlinkingIcon /> */}
                <Text style={styles.homeCardBigTxt}>Hiện tại không có</Text>
              </View>
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
                {/* <Text style={styles.homeCardBigTxt}>{done}</Text> */}
                <Text style={styles.homeCardBigTxt}>10</Text>
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
                {/* <Text style={styles.homeCardBigTxt}>{printed}</Text> */}
                <Text style={styles.homeCardBigTxt}>5</Text>
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
