import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, Modal, FlatList } from "react-native";
import styles from "../style/MainStyle";
import { useRouter } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";

// import EngineController from "../controller/EngineController";
import { CalculatedEngine, SelectedEngine } from "../models/EngineModel";
import Efficiency from "../models/Efficiency";
import TransRatio, { TransRatioType2 } from "../models/GearRatio";
import ShaftStats from "../models/Shaft";
import CalcController from "../controller/CalcController";
import { IconButton, Menu } from "react-native-paper";
import EngineController from "../controller/EngineController";

export default function TestPage() {
  const router = useRouter();
  // const [effi, setEffi] = useState<Efficiency>();
  // const [transRatio, setTransRatio] = useState<TransRatio>();
  const [displayCalcEngine, setDisplayCalcEngine] = useState<CalculatedEngine>();
  const [calcController, setCalcController] = useState<CalcController>();
  const [gearBoxType, setGearBoxType] = useState("");
  const [open, setOpen] = useState(false);
  const gearBoxOptions = ["GearBox1", "GearBox2"];
  const [items, setItems] = useState<any[]>(
    gearBoxOptions.map((option) => ({
      label: option,
      value: option,
    }))
  );

  const setCalcStrat = () => {
    setCalcController(new CalcController(gearBoxType));
    console.log("Đã chọn loại");
  };

  const getEngineFromDb = async () => {
    if (calcController) {
      const engineList = await EngineController.getSelectedEngine(
        calcController.getCalcEngine().p_ct,
        calcController.getCalcEngine().n_sb,
        1
      );
      return engineList[0];
    }
  };

  const renderEngine = () => {
    if (calcController) {
      getEngineFromDb().then((engine) => {
        if (engine) {
          calcController.chooseEngine(engine);
          // console.log(newSeleEngi[0]);
          let postStats = calcController.getEnginePostStats();
          console.log(postStats);
        }
      });
    }
  };

  const calcBaseEngine = () => {
    let F = 17000,
      v = 0.5,
      T1 = 1,
      t1 = 25,
      T2 = 0.5,
      t2 = 15,
      p = 120,
      z = 15;
    // let F = 7500,
    //   v = 0.9,
    //   T1 = 1,
    //   t1 = 36,
    //   T2 = 0.5,
    //   t2 = 15,
    //   D = 550;
    if (calcController) {
      calcController.calcEngineBase(F, v, T1, t1, T2, t2, { z, p });
      // CalcController.calcEngineBase(F, v, T1, t1, T2, t2, { D });
      // Get Engine adjustable Parameters here
      // console.log(CalcController.showEngineParam());
      setDisplayCalcEngine(calcController.getCalcEngine());
    }
  };

  // Adjust Engine Parameters here
  const changeParam = () => {
    if (calcController) {
      let changeEffi = new Efficiency([
        [{ type: "ol", value: 0.99 }, 4],
        [{ type: "d", value: 0.94 }, 1],
        [{ type: "tv", value: 0.85 }, 1],
        [{ type: "brt", value: 0.96 }, 1],
        [{ type: "kn", value: 0.98 }, 1],
      ]);
      let changeRatio = new TransRatioType2([
        { type: "d", value: 3 },
        { type: "tv", value: 10 },
        { type: "brt", value: 3 },
        { type: "kn", value: 1 },
      ]);
      calcController.adjustCalcEngine(changeEffi, changeRatio);
      setDisplayCalcEngine(calcController.getCalcEngine());
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
      <Button title="Chọn động cơ" onPress={renderEngine} />
    </View>
  );
}
