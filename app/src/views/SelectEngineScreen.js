import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useRouter } from "expo-router"; // Khởi tạo router từ expo-router
import styles from "../style/SelectEngineScreenStyle"; // Sử dụng style đã tạo

// Mã giả định cho danh sách động cơ từ backend
const engines = [
  { id: 1, name: "Động cơ B", power: "30 KW", speed: "1500 rpm", image: "https://png.pngtree.com/png-clipart/20190517/original/pngtree-wrench-vector-icon-png-image_3746268.jpg" },
  { id: 2, name: "Động cơ C", power: "40 KW", speed: "2000 rpm", image: "https://png.pngtree.com/png-clipart/20190517/original/pngtree-wrench-vector-icon-png-image_3746268.jpg" },
  // Thêm các động cơ khác nếu cần
];

export default function SelectEngineScreen({ route }) {
  const router = useRouter(); // Khởi tạo router để điều hướng

  // Lấy công suất và tốc độ quay từ trang trước
  const { requiredPower, requiredSpeed } =  router.query;

  // State lưu động cơ đã chọn
  const [selectedEngine, setSelectedEngine] = useState(null);

  const handleSelectEngine = (engine) => {
    setSelectedEngine(engine); // Lưu động cơ đã chọn
  };

  const handleContinue = () => {
    if (selectedEngine) {
      // Điều hướng tới trang NextPage và truyền động cơ đã chọn
      router.push(`/src/views/NextPage?selectedEngine=${encodeURIComponent(JSON.stringify(selectedEngine))}`);
    } else {
      alert("Vui lòng chọn động cơ.");
    }
  };

  const handleBack = () => {
    router.back(); // Quay lại trang trước
  };

  // Lọc động cơ thỏa mãn các yêu cầu
  const filteredEngines = engines.filter(engine => {
    return parseFloat(engine.power) >= requiredPower && parseFloat(engine.speed) >= requiredSpeed;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>GEAR CALC</Text>
        <Text style={styles.subtitle}>Chọn động cơ</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Công suất cần thiết: {requiredPower} KW</Text>
        <Text style={styles.infoText}>Tốc độ quay cần thiết: {requiredSpeed} rpm</Text>
      </View>

      {/* Danh sách động cơ */}
      <View style={styles.parameterAdjustment}>
        <Text style={styles.parameterTitle}>Danh sách động cơ thỏa mãn</Text>
        <FlatList
          data={filteredEngines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.engineItem}
              onPress={() => handleSelectEngine(item)}
            >
              <Image source={{ uri: item.image }} style={styles.engineImage} />
              <Text style={styles.engineName}>{item.name}</Text>
              <Text style={styles.engineDetails}>Công suất: {item.power}</Text>
              <Text style={styles.engineDetails}>Tốc độ quay: {item.speed}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleBack}>
          <Text style={styles.cancelButtonText}>Thoát</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Tiếp tục</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
