import CalcFooter from "@/views/common/CalcFooter";
import SaveComponent from "@views/common/SaveComponent";
import styles from "@style/MainStyle";
import { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import Header from "@views/common/Header";
import Lubricant from "@models/Lubricant";
import CalcController from "@controller/CalcController";
import LubricantController from "@controller/LubricantController";
import LoadingScreen from "@views/common/LoadingScreen";
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/src/style/Colors";
import { scale, verticalScale } from "react-native-size-matters";

export default function LubricantSelect() {
  const calcController = CalcController.getInstance();
  const [lubricantList, setLubricantList] = useState<Lubricant[]>([]);
  const [selectedLub, setSelectedLub] = useState<Lubricant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LubricantController.generateLubricant().then((lubList) => {
      setLubricantList(lubList);
      setLoading(false);
    });
  }, []);

  const handleSelectLubricant = (lub: Lubricant) => {
    setSelectedLub(lub);
  };

  const handleValidation = () => {
    if (!selectedLub) {
      alert("Vui lòng chọn dầu bôi trơn.");
      return false;
    } else {
      calcController.chooseLubricant(selectedLub);
      return true;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Bôi trơn" rightIcon={<SaveComponent />} />
      {loading ? (
        <LoadingScreen />
      ) : (
        <View style={styles.inputContainer}>
          {lubricantList.length == 0 && (
            <Text style={styles.noDataWarn}>Không có dầu bôi trơn thỏa mãn điều kiện!</Text>
          )}
          <Text style={styles.tableTitle}>Chọn loại dầu bôi trơn</Text>
          <FlatList
            data={lubricantList}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ ...styles.selectItem, height: verticalScale(120) }}
                onPress={() => handleSelectLubricant(item)}
              >
                <MaterialCommunityIcons name="oil" size={scale(50)} color={Colors.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectName}>
                    {(item.centistoc_max == -1 || item.centistoc_max >= 80) && (
                      <FontAwesome name="star" size={20} color="yellow" />
                    )}{" "}
                    {item.name}
                  </Text>
                  <Text style={styles.selectDetails}>
                    Độ nhớt Centistoc ở 50°C: {item.centistoc_max < 0 && "≥"}
                    {item.centistoc_min} {`${!(item.centistoc_max < 0) ? "- " + item.centistoc_max : ""}`}
                  </Text>
                </View>
                {selectedLub?.name === item.name && (
                  <FontAwesome5 name="check" size={24} color={Colors.text.success} />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      <CalcFooter onValidate={handleValidation} finish={true} />
    </View>
  );
}
