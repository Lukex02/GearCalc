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
    // let newEfficieny = new Efficiency(0.99, 0.85, 0.96, 0.94, 0.98);
    // let newRatio = new TransRatio(3, 10, 3, 1);
    let newEfficieny = new Efficiency([
      [{ type: "n_ol", value: 0.99 }, 4],
      [{ type: "n_tv", value: 0.85 }, 1],
      [{ type: "n_brt", value: 0.96 }, 1],
      [{ type: "n_d", value: 0.94 }, 1],
      [{ type: "n_kn", value: 0.98 }, 1],
    ]);
    let newRatio = new TransRatio([
      { type: "u_d", value: 3 },
      { type: "u_tv", value: 10 },
      { type: "u_brt", value: 3 },
      { type: "u_kn", value: 1 },
    ]);

    const newCalcEngine = EngineController.generateCalculatedEngine(
      newEfficieny,
      newRatio
    );
    const newSeleEngine = await EngineController.getSelectedEngine(
      newCalcEngine.p_ct,
      newCalcEngine.n_sb,
      1
    );
    const newTransRatio = EngineController.getNewTransRatio(
      newCalcEngine,
      newSeleEngine[0],
      newRatio
    );
    // console.log(newTransRatio);
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
          <Text>Công suất cần thiết: {calcEngine.p_ct.toFixed(2)}</Text>
        </View>
      )}
      {transRatio &&
        transRatio.ratio_comp.map((ratio) => (
          <View>
            <Text>
              Tỷ số {ratio.type}: {ratio.value.toFixed(2)}
            </Text>
          </View>
        ))}
    </View>
  );
}
