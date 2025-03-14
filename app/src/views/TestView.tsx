import React, { useState } from "react";
import { View, Text, Button } from "react-native";
// import { Appbar, IconButton, Menu } from "react-native-paper";
import styles from "../style/MainStyle";
import EngineController from "../controller/EngineController";
import {
  CalculatedEngine,
  Efficiency,
  SelectedEngine,
  TransRatio,
} from "../models/EngineModel";

export default function TestPage() {
  const [effi, setEffi] = useState<Efficiency | null>(null);
  const [calcEngine, setCalcEngine] = useState<CalculatedEngine | null>(null);
  const [seleEngine, setSeleEngine] = useState<SelectedEngine[] | []>([]);
  const [transRatio, setTransRatio] = useState<TransRatio | null>(null);

  const calculateEngine = async () => {
    let newEfficieny = new Efficiency(0.99, 0.85, 0.96, 0.94, 0.98);
    let newRatio = new TransRatio(3, 10, 3, 1);

    const newCalcEngine = EngineController.generateCalculatedEngine(
      newEfficieny,
      newRatio
    );
    const newSeleEngine = await EngineController.getSelectedEngine(
      newCalcEngine.get_p_ct(),
      newCalcEngine.get_n_sb(),
      1
    );
    const newTransRatio = EngineController.getNewTransRatio(
      newCalcEngine,
      newSeleEngine[0],
      newRatio
    );
    setEffi(newEfficieny);
    setTransRatio(newTransRatio);
    setCalcEngine(newCalcEngine);
    setSeleEngine(newSeleEngine);
  };

  return (
    <View style={styles.container}>
      <Button title="Tính Công Suất" onPress={calculateEngine} />

      {calcEngine && (
        <View>
          <Text>Công suất cần thiết: {calcEngine.get_p_ct().toFixed(2)}</Text>
        </View>
      )}
      {transRatio && (
        <View>
          <Text>Tỷ số bộ truyền đai: {transRatio.u_d.toFixed(2)}</Text>
          <Text>Tỷ số bánh răng trụ thẳng: {transRatio.u_brt.toFixed(2)}</Text>
          <Text>Tỷ số truyền trục vít : {transRatio.u_tv.toFixed(2)}</Text>
        </View>
      )}
    </View>
  );
}
