import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import styles from "../style/MainStyle";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

// import EngineController from "../controller/EngineController";
import { CalculatedEngine, SelectedEngine } from "../models/EngineModel";
import Efficiency from "../models/Efficiency";
import TransRatio from "../models/GearRatio";
import ShaftStats from "../models/Shaft";
import CalcManager from "../models/CalcManager";
import { IconButton, Menu } from "react-native-paper";
import EngineController from "../controller/EngineController";

export default function TestPage() {
  const router = useRouter();
  const [effi, setEffi] = useState<Efficiency | null>(null);
  const [displayCalcEngine, setDisplayCalcEngine] =
    useState<CalculatedEngine>();
  const [transRatio, setTransRatio] = useState<TransRatio | null>(null);
  const [calcManager, setCalcManager] = useState<CalcManager>();
  const [gearBoxType, setGearBoxType] = useState("");
  const [open, setOpen] = useState(false);
  const gearBoxOptions = ["GearBox2"];
  const [items, setItems] = useState<any[]>(
    gearBoxOptions.map((option) => ({
      label: option,
      value: option,
    }))
  );

  const setCalcStrat = () => {
    setCalcManager(new CalcManager(gearBoxType));
    console.log("Đã chọn loại");
  };

  const renderEngine = async (calcManager: CalcManager, T1: number) => {
    const newSeleEngi = await EngineController.getSelectedEngine(
      calcManager.getCalcEngine().p_ct,
      calcManager.getCalcEngine().n_sb,
      T1
    );
    calcManager.chooseEngine(newSeleEngi[0]);
    // console.log(newSeleEngi[0]);
    let postStats = calcManager.getEnginePostStats();
    console.log(postStats);
  };

  const calcBaseEngine = () => {
    let F = 17000,
      v = 0.5,
      T1 = 1,
      t1 = 25,
      T2 = 0.5,
      t2 = 15,
      z = 15,
      p = 120;
    // D = 550
    if (calcManager) {
      calcManager.calcEngineBase(F, v, T1, t1, T2, t2, { z, p });
      // Get Engine adjustable Parameters here
      // calcManager.showEngineParam();
      // console.log(calcManager.showEngineParam());
      setDisplayCalcEngine(calcManager.getCalcEngine());
    }
  };

  // Adjust Engine Parameters here
  const changeParam = () => {
    if (calcManager) {
      let changeEffi = new Efficiency([
        [{ type: "ol", value: 0.99 }, 4],
        [{ type: "d", value: 0.94 }, 1],
        [{ type: "tv", value: 0.85 }, 1],
        [{ type: "brt", value: 0.96 }, 1],
        [{ type: "kn", value: 0.98 }, 1],
      ]);
      let changeRatio = new TransRatio([
        { type: "d", value: 3 },
        { type: "tv", value: 10 },
        { type: "brt", value: 3 },
        { type: "kn", value: 1 },
      ]);
      calcManager.adjustCalcEngine(changeEffi, changeRatio);
      setDisplayCalcEngine(calcManager.getCalcEngine());
    }
  };
  return (
    <View style={styles.container}>
      <Text>Trang nhập số liệu thiết kế</Text>
      <DropDownPicker
        open={open}
        value={gearBoxType}
        items={items}
        setOpen={setOpen}
        setValue={setGearBoxType}
        setItems={setItems}
      />

      <Button title="Chọn loại" onPress={setCalcStrat} />
      {displayCalcEngine && (
        <View style={styles.container}>
          <Text>Công suất cần thiết P_ct: {displayCalcEngine.p_ct}</Text>
          <Text>Tốc độ quay n_sb: {displayCalcEngine.n_sb}</Text>
        </View>
      )}
      <Button
        title="Tính thông số động cơ ban đầu (Đúng thì cái này sẽ dẫn tới trang kế mà thay đổi param)"
        onPress={calcBaseEngine}
      />
      <Button title="Thay đổi param" onPress={changeParam} />
    </View>
  );
}
