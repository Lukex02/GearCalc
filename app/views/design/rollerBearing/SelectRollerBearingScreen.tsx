import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  PanResponder,
  Dimensions,
  PanResponderInstance,
} from "react-native";
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
  const isInitialMount = React.useRef(true);
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

  const isVerticalScroll = React.useRef(false);
  const startY = React.useRef(0);

  const handleTouchStart = (event: any) => {
    startY.current = event.nativeEvent.pageY;
    isVerticalScroll.current = false;
  };
  const handleTouchMove = (event: any) => {
    const currentY = event.nativeEvent.pageY;
    const deltaY = Math.abs(currentY - startY.current);
    const deltaX = Math.abs(event.nativeEvent.pageX - /* vị trí X ban đầu */ 0); // Cần theo dõi cả X nếu cần

    // Nếu chuyển động dọc lớn hơn nhiều so với ngang, coi như là cuộn dọc
    if (deltaY > deltaX * 2) {
      isVerticalScroll.current = true;
    }
  };

  const calcRollerBearing = [
    calcController.calcRollerBearing(1),
    calcController.calcRollerBearing(2),
    calcController.calcRollerBearing(3),
  ];
  const handleSelectRollerBearing = (bearing: SelectedRollerBearing, shaftIdx: number) => {
    setSelectedRollerBearing({ ...selectedRollerBearing, [shaftIdx]: bearing });
  };
  const renderBearingDetails = React.useCallback((rb: SelectedRollerBearing) => {
    return Object.keys(rollerBearingLabel).map((key, index) => {
      if (key === "symbol") return null; // Skip the symbol key
      return (
        <Text key={index} style={styles.selectDetails}>
          {rollerBearingLabel[key as keyof typeof rollerBearingLabel]} :{" "}
          {key === "type"
            ? rollerBearingTypeLabel[rb[key as keyof typeof rb] as keyof typeof rollerBearingTypeLabel]
            : rb[key as keyof typeof rb]}
        </Text>
      );
    });
  }, []);
  const handleValidation = () => {
    if (selectedRollerBearing[1] && selectedRollerBearing[2] && selectedRollerBearing[3]) {
      try {
        calcController.chooseRollerBearing(selectedRollerBearing[1], 1);
        calcController.chooseRollerBearing(selectedRollerBearing[2], 2);
        calcController.chooseRollerBearing(selectedRollerBearing[3], 3);
        return true;
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
          return false;
        }
        return false;
      }
    } else {
      alert("Vui lòng chọn đủ ổ lăn.");
      return false;
    }
  };
  const getSelectedRollerBearing = async () => {
    try {
      const rb = await Promise.all(
        shaftDiameter.map(async (d, i) => {
          return await RollerBearingController.getSelectableRollerBearing(calcRollerBearing[i].type, d);
        })
      );
      setRollerBearingList(rb);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get roller bearings that meet requirements
    if (isInitialMount.current) {
      isInitialMount.current = false;
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
          {rollerBearingList.length === 0 ? (
            <Text style={styles.noDataWarn}>Không có thiết kế ổ lăn thỏa mãn điều kiện!</Text>
          ) : (
            <View>
              <Carousel
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
                    >
                      {rollerBearingList.length === 0 && (
                        <Text style={styles.noDataWarn}>Không có thiết kế ổ lăn thỏa mãn điều kiện!</Text>
                      )}
                      <View style={styles.specHeaderRow}>
                        <Text style={styles.pageTitle}>Ổ lăn cho trục {shaftIdx + 1}</Text>
                        <FontAwesome5 name="cogs" size={scale(30)} color={Colors.primary} />
                      </View>
                      <View>
                        {rbInEachShaft.map((rb, index) => (
                          <TouchableOpacity
                            style={styles.selectItem}
                            key={rb.symbol}
                            onPress={() => handleSelectRollerBearing(rb, shaftIdx + 1)}
                          >
                            <MaterialCommunityIcons
                              name="movie-roll"
                              size={scale(50)}
                              color={Colors.primary}
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.selectName}>Ký hiệu: {rb.symbol}</Text>
                              {renderBearingDetails(rb)}
                            </View>
                            {selectedRollerBearing[shaftIdx + 1]?.symbol === rb.symbol && (
                              <FontAwesome5 name="check" size={24} color={Colors.text.success} />
                            )}
                          </TouchableOpacity>
                        ))}
                      </View>
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
        </View>
      )}
      <CalcFooter onValidate={handleValidation} nextPage={"/views/design/box/SelectBox"} />
    </View>
  );
}
function useRef(arg0: PanResponderInstance) {
  throw new Error("Function not implemented.");
}
