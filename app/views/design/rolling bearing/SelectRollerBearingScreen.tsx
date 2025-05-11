import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert, Dimensions } from "react-native";
import styles from "@style/MainStyle";
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import LoadingScreen from "@views/common/LoadingScreen";
import { AntDesign, FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { scale, verticalScale } from "react-native-size-matters";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import { SelectedRollerBearing } from "@models/RollerBearing";
import RollerBearingController from "@controller/RollerBearingController"; // Fixed controller import
import { useSharedValue } from "react-native-reanimated";
import { rollerBearingLabel, rollerBearingTypeLabel } from "@/views/common/Label";
import Carousel, { Pagination } from "react-native-reanimated-carousel";
const width = Dimensions.get("window").width;

export default function SelectRollerBearingScreen() {
  const calcController = CalcController.getInstance();
  const shaftDiameter = calcController
    .getShaft()
    .getAllIndividualShaft()
    .map((indiShaft) => indiShaft.d_forRB);
  const [selectedRollerBearing, setSelectedRollerBearing] = useState<Record<number, SelectedRollerBearing>>(
    {}
  ); // Fixed variable name
  const [rollerBearingList, setRollerBearingList] = useState<SelectedRollerBearing[][]>([]);
  const [loading, setLoading] = useState(true);
  const progress = useSharedValue<number>(0);
  const calcRollerBearing = [
    calcController.calcRollerBearing(1),
    calcController.calcRollerBearing(2),
    calcController.calcRollerBearing(3),
  ];
  const handleSelectRollerBearing = (bearing: SelectedRollerBearing, shaftIdx: number) => {
    setSelectedRollerBearing({ ...selectedRollerBearing, [shaftIdx]: bearing });
  };

  const handleValidation = () => {
    if (selectedRollerBearing[1] && selectedRollerBearing[2] && selectedRollerBearing[3]) {
      try {
        calcController.chooseRollerBearing(selectedRollerBearing[1], 1);
        calcController.chooseRollerBearing(selectedRollerBearing[2], 2);
        calcController.chooseRollerBearing(selectedRollerBearing[3], 3);
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          return false;
        }
      }
      return true;
    } else {
      alert("Vui lòng chọn đủ ổ lăn.");
      return false;
    }
  };
  const getSelectedRollerBearing = async () => {
    const rb = await Promise.all(
      shaftDiameter.map(async (d, i) => {
        return await RollerBearingController.getSelectableRollerBearing(calcRollerBearing[i].type, d);
      })
    );
    setRollerBearingList(rb);
  };

  useEffect(() => {
    // Get roller bearings that meet requirements
    if (rollerBearingList.length === 0) {
      getSelectedRollerBearing().then(() => {
        setLoading(false);
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Chọn ổ lăn" rightIcon={<SaveComponent />} />

      {/* Roller bearing list */}
      {loading ? (
        <LoadingScreen />
      ) : (
        <View>
          <Carousel
            autoPlayInterval={2000}
            data={rollerBearingList}
            height={verticalScale(480)}
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
            renderItem={({ item: rbInEachShaft, index: shaftIdx, animationValue }) => {
              return (
                <View
                  style={{
                    ...styles.selectContainer,
                    maxHeight: verticalScale(500),
                    padding: Math.round(scale(25)),
                  }}
                  pointerEvents="box-none"
                >
                  {rollerBearingList.length === 0 && (
                    <Text style={styles.noDataWarn}>Không có thiết kế ổ lăn thỏa mãn điều kiện!</Text>
                  )}
                  <View style={styles.specHeaderRow}>
                    <Text style={styles.pageTitle}>Ổ lăn cho trục {shaftIdx + 1}</Text>
                    <FontAwesome5 name="cogs" size={scale(30)} color={Colors.primary} />
                  </View>
                  <FlatList
                    data={rbInEachShaft}
                    keyExtractor={(item) => item.symbol.toString()}
                    renderItem={({ item: rb }) => (
                      <TouchableOpacity
                        key={rb.symbol}
                        style={styles.selectItem}
                        onPress={() => handleSelectRollerBearing(rb, shaftIdx + 1)}
                      >
                        <MaterialCommunityIcons name="movie-roll" size={scale(50)} color={Colors.primary} />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.selectName}>Ký hiệu: {rb.symbol}</Text>
                          {Object.keys(rollerBearingLabel).map((key, index) => {
                            if (key === "symbol") return null; // Skip the symbol key
                            return (
                              <Text key={index} style={styles.selectDetails}>
                                {rollerBearingLabel[key as keyof typeof rollerBearingLabel]} :{" "}
                                {key === "type"
                                  ? rollerBearingTypeLabel[
                                      rb[key as keyof typeof rb] as keyof typeof rollerBearingTypeLabel
                                    ]
                                  : rb[key as keyof typeof rb]}
                              </Text>
                            );
                          })}
                        </View>
                        {selectedRollerBearing[shaftIdx + 1]?.symbol === rb.symbol && (
                          <FontAwesome5 name="check" size={24} color={Colors.text.success} />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                  <View style={{ ...styles.specHeaderRow, borderBottomWidth: 0 }}>
                    {selectedRollerBearing[shaftIdx + 1] ? (
                      <AntDesign name="checksquare" size={35} color={Colors.text.success} />
                    ) : (
                      <AntDesign name="closesquare" size={35} color={Colors.text.error} />
                    )}
                  </View>
                </View>
              );
            }}
          />
          <Pagination.Basic
            progress={progress}
            data={rollerBearingList}
            activeDotStyle={{ backgroundColor: Colors.border.accent, borderRadius: 50 }}
            dotStyle={{ backgroundColor: Colors.overlay, borderRadius: 50 }}
            containerStyle={{ gap: 5, marginTop: scale(5) }}
          />
        </View>
      )}
      <CalcFooter onValidate={handleValidation} finish={true} />
    </View>
  );
}
