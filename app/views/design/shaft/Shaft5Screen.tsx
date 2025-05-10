import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from "react-native";
import styles from "@style/MainStyle";
import CalcFooter from "@views/common/CalcFooter";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import CalcController from "@/src/controller/CalcController";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
import { scale, verticalScale } from "react-native-size-matters";
import { useSharedValue } from "react-native-reanimated";
import Colors from "@/src/style/Colors";
import { staticDuraLabel, fatigueDuraLabel } from "@/views/common/Label";

// Data giả lập result
const result = {
  fatigueDura: [
    {
      shaftIdx: 1,
      point: "C",
      W_j: 0.001,
      W_oj: 0.001,
      M_j: 0.001,
      epsi_sigma: 0.001,
      epsi_tau: 0.001,
      sigma_aj: 0.001,
      tau_aj: 0.001,
      tau_mj: 0.001,
      s_sigma: 0.001,
      s_tau: 0.001,
      s: 0.001,
    },
    {
      shaftIdx: 2,
      point: "C",
      W_j: 0.001,
      W_oj: 0.001,
      M_j: 0.001,
      epsi_sigma: 0.001,
      epsi_tau: 0.001,
      sigma_aj: 0.001,
      tau_aj: 0.001,
      tau_mj: 0.001,
      s_sigma: 0.001,
      s_tau: 0.001,
      s: 0.001,
    },
    {
      shaftIdx: 3,
      point: "B",
      W_j: 0.001,
      W_oj: 0.001,
      M_j: 0.001,
      epsi_sigma: 0.001,
      epsi_tau: 0.001,
      sigma_aj: 0.001,
      tau_aj: 0.001,
      tau_mj: 0.001,
      s_sigma: 0.001,
      s_tau: 0.001,
      s: 0.001,
    },
  ],
  staticDura: [
    {
      shaftIdx: 1,
      d_max: 0.001,
      M_max: 0.001,
      T_max: 0.001,
      sigma: 0.001,
      tau: 0.001,
      sigma_td: 0.001,
    },
    {
      shaftIdx: 2,
      d_max: 0.001,
      M_max: 0.001,
      T_max: 0.001,
      sigma: 0.001,
      tau: 0.001,
      sigma_td: 0.001,
    },
    {
      shaftIdx: 3,
      d_max: 0.001,
      M_max: 0.001,
      T_max: 0.001,
      sigma: 0.001,
      tau: 0.001,
      sigma_td: 0.001,
    },
  ],
};
const width = Dimensions.get("window").width;
export default function Shaft5Screen() {
  const progress = useSharedValue<number>(0);
  const calcController = CalcController.getInstance();
  const { fatigueDura, staticDura } = calcController.testShaft();
  const carouselData = [...fatigueDura, ...staticDura];
  return (
    <View style={styles.container}>
      <Header title="Thiết kế trục" rightIcon={<SaveComponent />} />
      <Carousel
        autoPlayInterval={2000}
        data={carouselData}
        height={verticalScale(500)}
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
        renderItem={({ item: durability, index, animationValue }) => {
          if (Math.floor(index / 3) === 1) {
            return (
              <View style={styles.optionCard} pointerEvents="box-none">
                <Text style={styles.tableTitle}>Kiểm nghiệm độ bền tĩnh</Text>
                <View style={{ ...styles.tableContainer, width: "90%" }} pointerEvents="box-none">
                  <View style={styles.specHeaderRow}>
                    <Text style={{ ...styles.specHeaderCell, fontSize: scale(20) }}>
                      Trục số {durability.shaftIdx}
                    </Text>
                  </View>
                  {Object.keys(staticDuraLabel).map((key) => (
                    <View key={key} style={styles.specRow}>
                      <Text style={styles.specCellRow}>
                        {staticDuraLabel[key as keyof typeof staticDuraLabel]}
                      </Text>
                      <Text style={styles.specCellRow}>
                        {durability[key as keyof typeof durability].toFixed(3)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          } else {
            return (
              <View style={styles.optionCard} pointerEvents="box-none">
                <Text style={styles.tableTitle}>Kiểm nghiệm độ bền mỏi</Text>
                <View style={{ ...styles.tableContainer, width: "90%" }} pointerEvents="box-none">
                  <View style={styles.specHeaderRow}>
                    <Text style={{ ...styles.specHeaderCell, fontSize: scale(20) }}>
                      Trục số {durability.shaftIdx}
                    </Text>
                  </View>
                  {Object.keys(fatigueDuraLabel).map((key) => (
                    <View key={key} style={styles.specRow}>
                      <Text style={{ ...styles.specCellRow, paddingVertical: verticalScale(10) }}>
                        {fatigueDuraLabel[key as keyof typeof fatigueDuraLabel]}
                      </Text>
                      <Text style={{ ...styles.specCellRow, paddingVertical: verticalScale(10) }}>
                        {typeof durability[key as keyof typeof durability] === "number"
                          ? durability[key as keyof typeof durability].toFixed(3)
                          : durability[key as keyof typeof durability]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          }
        }}
      />
      <Pagination.Basic
        progress={progress}
        data={carouselData}
        activeDotStyle={{ backgroundColor: Colors.border.accent, borderRadius: 50 }}
        dotStyle={{ backgroundColor: Colors.overlay, borderRadius: 50 }}
        containerStyle={{ gap: 5, marginTop: scale(5) }}
      />
      <CalcFooter nextPage={"/views/design/rollerBearing/SelectRollerBearing"} />
    </View>
  );
}
