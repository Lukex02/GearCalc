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

export default function TestPage() {
  // const [effi, setEffi] = useState<Efficiency | null>(null);
  // const [calcEngine, setCalcEngine] = useState<CalculatedEngine | null>(null);
  // const [seleEngine, setSeleEngine] = useState<SelectedEngine[] | []>([]);
  // const [transRatio, setTransRatio] = useState<TransRatio | null>(null);
  // const [shaftStats, setShaftStats] = useState<ShaftStats | null>(null);
  const [calcManager, setCalcManager] = useState<CalcManager>();
  const [gearBoxType, setGearBoxType] = useState("");
  const router = useRouter();
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
  };
  useEffect(() => {
    let F = 17000,
      v = 0.5,
      T1 = 1,
      t1 = 25,
      T2 = 0.5,
      t2 = 15,
      D = 550;
    if (calcManager) {
      calcManager.calcEngineBase(F, v, T1, t1, T2, t2, { D });
      // router.push({
      //   pathname: "/src/views/TestStep2",
      //   params: { mana: JSON.stringify(calcManager) },
      // });
      // console.log(calcManager);
    }
  }, [calcManager]);

  // const calculateEngine = async () => {
  //   calcManager.calcEngine();
  //   const newSeleEngine = await EngineController.getSelectedEngine(
  //     newCalcEngine.p_ct,
  //     newCalcEngine.n_sb,
  //     1
  //   );
  //   const newTransRatio = EngineController.getNewTransRatio(
  //     newCalcEngine,
  //     newSeleEngine[0],
  //     newRatio
  //   );
  //   const newShaftStats = EngineController.getShaftStats(
  //     newSeleEngine[0].n_t,
  //     newCalcEngine.p_td,
  //     newEfficieny,
  //     newRatio
  //   );
  //   setEffi(newEfficieny);
  //   setTransRatio(newTransRatio);
  //   setCalcEngine(newCalcEngine);
  //   setSeleEngine(newSeleEngine);
  //   setShaftStats(newShaftStats);
  // };

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
      <Button title="Tiếp theo" onPress={setCalcStrat} />
    </View>
  );
}
