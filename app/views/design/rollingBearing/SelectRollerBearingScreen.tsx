import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import styles from "@style/MainStyle";
import { Colors } from "@style/Colors";
import CalcController from "@controller/CalcController";
import CalcFooter from "@views/common/CalcFooter";
import LoadingScreen from "@views/common/LoadingScreen";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { scale } from "react-native-size-matters";
import Header from "@/views/common/Header";
import SaveComponent from "@/views/common/SaveComponent";
import CalculatedRollerBearing, { SelectedRollerBearing } from "@/src/models/RollerBearing";
import RollerBearingController from "@controller/RollerBearingController"; // Fixed controller import

export default function SelectRollerBearingScreen() {
  const calcController = CalcController.getInstance();
  const calcRollerBearing: CalculatedRollerBearing = calcController.getCalcMechDrive();
  const calcPower = calcRollerBearing;
  const [selectedRollerBearing, setSelectedRollerBearing] = useState<SelectedRollerBearing>(); // Fixed variable name
  const [rollerBearingList, setRollerBearingList] = useState<SelectedRollerBearing[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSelectRollerBearing = (bearing: SelectedRollerBearing) => {
    setSelectedRollerBearing(bearing);
  };

  const handleValidation = () => {
    if (selectedRollerBearing) {
      calcController.chooseMechDrive(selectedRollerBearing);
      return true;
    } else {
      alert("Vui lòng chọn thiết kế Ổ lăn.");
      return false;
    }
  };

  // Get roller bearings that meet requirements
  const getSelectedRollerBearing = () => {
    // Fixed controller and method call
    RollerBearingController.getSelectableRollerBearing(calcController.getCalcMechDrive().P_t)
      .then((bearings) => {
        setRollerBearingList(bearings); // Fixed state setting
        setLoading(false);
      });
  };

  useEffect(() => {
    getSelectedRollerBearing();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Kết quả tính Ổ lăn" rightIcon={<SaveComponent />} /> {/* Fixed title */}
      <View style={styles.resultContainer}>
        <Text style={styles.resultText}>
          Công suất tính toán:{" "}
          <Text style={{ color: Colors.text.success, fontWeight: "bold" }}>
            {calcPower.P_t.toFixed(3)} {/* Assuming P_t is the correct property */}
          </Text> kW
        </Text>
      </View>

      {/* Roller bearing list */}
      <Text style={styles.pageTitle}>Danh sách thiết kế ổ lăn thỏa mãn</Text> {/* Fixed title */}
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.selectContainer}>
          {rollerBearingList.length === 0 && (
            <Text style={styles.noDataWarn}>Không có thiết kế ổ lăn thỏa mãn điều kiện!</Text>
          )}
          <FlatList
            data={rollerBearingList}
            keyExtractor={(item) => item.symbol}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.selectItem} 
                onPress={() => handleSelectRollerBearing(item)}
              >
                <FontAwesome5 name="cog" size={scale(50)} color={Colors.primary} /> {/* More appropriate icon */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectName}>Loại {item.symbol}</Text>
                  <Text style={styles.selectDetails}>
                    Ký hiệu:{" "}
                    <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
                      {item.symbol}
                    </Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    d: <Text style={{ color: Colors.text.success }}>{item.d} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    D: <Text style={{ color: Colors.primary }}>{item.D} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    B: <Text style={{ color: Colors.primary }}>{item.B} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    r: <Text style={{ color: Colors.primary }}>{item.r} mm</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    C: <Text style={{ color: Colors.primary }}>{item.C} kN</Text>
                  </Text>
                  <Text style={styles.selectDetails}>
                    C0: <Text style={{ color: Colors.primary }}>{item.C_O} kN</Text>
                  </Text>
                </View>
                {selectedRollerBearing?.symbol === item.symbol && (
                  <FontAwesome5 name="check" size={24} color={Colors.text.success} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <CalcFooter 
        onValidate={handleValidation} 
        nextPage="/views/design/rolling bearing/PostRollerBearingStatsView" // Updated navigation path
      />
    </View>
  );
}