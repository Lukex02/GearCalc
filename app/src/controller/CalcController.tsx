import EngineController from "./EngineController";
import Efficiency, { IEfficiency } from "../models/Efficiency";
import { CalculatedEngine, SelectedEngine } from "../models/EngineModel";
import GearBox, { GearBoxBuilder } from "../models/GearBox";
import TransRatio, { TransRatioType1, TransRatioType2 } from "../models/GearRatio";
import ChainController from "./ChainController";
import GearController from "./GearController";
import CalculatedChain, { SelectedChain } from "../models/Chain";
import { Alert } from "react-native";
import GearSet from "../models/Gear";

type GearBox1GearSetInput = {
  sigma_b: [number, number];
  sigma_ch: [number, number];
  HB: [number, number];
  S_max: [number, number];
  shaftStats: {
    u: number;
    n: number;
    T: number;
  };
  K_qt: number;
};
type GearBox2GearSetInput = {
  a: number; // Random prop
};
type GearSetInput = GearBox1GearSetInput | GearBox2GearSetInput;

type GearBox1MechDriveInput = {
  P: number;
  u_x: number;
  n: number;
  k_0: number;
  k_a: number;
  k_dc: number;
  k_bt: number;
  k_d: number;
  k_c: number;
};
type GearBox2MechDriveInput = {
  a: number; // Random prop
};
type MechDriveInput = GearBox1MechDriveInput | GearBox2MechDriveInput;

interface DesignStrategy {
  _designInputStats: any;
  _designEngineStats: any;
  // _designMechDriveStats: any;
  // _designGearStats: any;

  storeDesignInput(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L: number,
    output: any
  ): void;
  designEngine(): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio };
  recalcEngine(efficiency: Efficiency, ratio: TransRatio): CalculatedEngine;
  designMechDrive(input: MechDriveInput): any;
  continueCalcMechDrive(calculated: CalculatedChain | any, selected: SelectedChain | any): void;
  designGear(input: GearSetInput): GearSet | any; // Sẽ chỉ làm 1 hàm tính bánh răng dùng chung
}

// Hộp giảm tốc 2 cấp khai triển (2 cặp bánh răng)
// Quay một chiều, làm việc 2 ca, tải va đập nhẹ: 1 năm làm việc 300 ngày, 1 ca làm việc 8 giờ.
class DesignGearBox1 implements DesignStrategy {
  _designInputStats: any;
  _designEngineStats: any;
  // _designMechDriveStats: any;
  // _designGearStats: any;

  storeDesignInput(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L: number,
    output: any
  ) {
    this._designInputStats = {
      F: F,
      v: v,
      T1: T1,
      t1: t1,
      T2: T2,
      t2: t2,
      L: L,
      output: output,
    };
  }

  designEngine(): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio } {
    // Design strategy 1 implementation
    let baseEfficiency = new Efficiency([
      [{ type: "ol", value: 0.992 }, 4],
      [{ type: "x", value: 0.96 }, 1],
      [{ type: "brt", value: 0.96 }, 2],
      [{ type: "kn", value: 1 }, 1],
    ]);
    let baseRatio = new TransRatioType1([
      { type: "x", value: 2.56 },
      { type: "h", value: 18 },
      { type: "kn", value: 1 },
    ]);
    this._designEngineStats = {
      F: this._designInputStats.F,
      v: this._designInputStats.v,
      T1: this._designInputStats.T1,
      t1: this._designInputStats.t1,
      T2: this._designInputStats.T2,
      t2: this._designInputStats.t2,
      drumPulley: {
        D: this._designInputStats.output.D,
      },
      efficiency: baseEfficiency,
      ratio: baseRatio,
    };
    return {
      engi: EngineController.generateCalculatedEngine(
        this._designEngineStats.F,
        this._designEngineStats.v,
        this._designEngineStats.drumPulley.D * Math.PI, // Chu vi của đĩa xích
        this._designEngineStats.T1,
        this._designEngineStats.t1,
        this._designEngineStats.T2,
        this._designEngineStats.t2,
        baseEfficiency,
        baseRatio
      ),
      base_effi: baseEfficiency,
      base_ratio: baseRatio,
    };
  }
  recalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    return EngineController.generateCalculatedEngine(
      this._designEngineStats.F,
      this._designEngineStats.v,
      this._designEngineStats.drumPulley.D * Math.PI, // Chu vi của trục tang trống
      this._designEngineStats.T1,
      this._designEngineStats.t1,
      this._designEngineStats.T2,
      this._designEngineStats.t2,
      (this._designEngineStats.efficiency = efficiency),
      (this._designEngineStats.ratio = ratio)
    );
  }

  designMechDrive(input: GearBox1MechDriveInput) {
    try {
      return ChainController.generateCalculatedChain(
        input.P,
        input.u_x,
        input.n,
        input.k_0,
        input.k_a,
        input.k_dc,
        input.k_bt,
        input.k_d,
        input.k_c
      );
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
        alert(error.message);
      }
    }
  }
  continueCalcMechDrive(calculatedChain: CalculatedChain, selectedChain: SelectedChain) {
    try {
      calculatedChain.calc_after_choose(selectedChain);
      calculatedChain.calcSprocket();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
        alert(error.message);
      }
    }
  }
  designGear(input: GearBox1GearSetInput): GearSet {
    // Design gears here
    return GearController.generateGearSet(
      input.sigma_b,
      input.sigma_ch,
      input.HB,
      input.S_max,
      input.shaftStats,
      {
        T1: this._designInputStats.T1,
        t1: this._designInputStats.t1,
        T2: this._designInputStats.T2,
        t2: this._designInputStats.t2,
        L_h: this._designInputStats.L,
      },
      input.K_qt
    );
  }
}

// Hộp giảm tốc bánh răng trục vít 1 cấp
class DesignGearBox2 implements DesignStrategy {
  _designInputStats: any;
  _designEngineStats: any;
  // _designMechDriveStats: any;
  // _designGearStats: any;

  storeDesignInput(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L: number,
    output: any
  ) {
    this._designInputStats = {
      F: F,
      v: v,
      T1: T1,
      t1: t1,
      T2: T2,
      t2: t2,
      L: L,
      output: output,
    };
  }

  designEngine(): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio } {
    // Design strategy 2 implementation
    let baseEfficiency = new Efficiency([
      [{ type: "ol", value: 0.99 }, 4],
      [{ type: "d", value: 0.94 }, 1],
      [{ type: "tv", value: 0.85 }, 1],
      [{ type: "brt", value: 0.96 }, 1],
      [{ type: "kn", value: 0.98 }, 1],
    ]);
    let baseRatio = new TransRatioType2([
      { type: "d", value: 3 },
      { type: "tv", value: 10 },
      { type: "brt", value: 3 },
      { type: "kn", value: 1 },
    ]);
    this._designEngineStats = {
      F: this._designInputStats.F,
      v: this._designInputStats.v,
      T1: this._designInputStats.T1,
      t1: this._designInputStats.t1,
      T2: this._designInputStats.T2,
      t2: this._designInputStats.t2,
      sprocket: {
        z: this._designInputStats.output.z,
        p: this._designInputStats.output.p,
      },
      efficiency: baseEfficiency,
      ratio: baseRatio,
    };
    return {
      engi: EngineController.generateCalculatedEngine(
        this._designEngineStats.F,
        this._designEngineStats.v,
        this._designEngineStats.sprocket.z * this._designEngineStats.sprocket.p, // Chu vi của đĩa xích
        this._designEngineStats.T1,
        this._designEngineStats.t1,
        this._designEngineStats.T2,
        this._designEngineStats.t2,
        baseEfficiency,
        baseRatio
      ),
      base_effi: baseEfficiency,
      base_ratio: baseRatio,
    };
  }
  recalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    return EngineController.generateCalculatedEngine(
      this._designEngineStats.F,
      this._designEngineStats.v,
      this._designEngineStats.sprocket.z * this._designEngineStats.sprocket.p, // Chu vi của đĩa xích
      this._designEngineStats.T1,
      this._designEngineStats.t1,
      this._designEngineStats.T2,
      this._designEngineStats.t2,
      (this._designEngineStats.efficiency = efficiency),
      (this._designEngineStats.ratio = ratio)
    );
  }

  designMechDrive(input: any) {
    // Should be belt here
  }
  continueCalcMechDrive(calculatedBelt: any, selectedBelt: any) {}
  designGear(input: any) {
    // Design gears here
  }
}

export default class CalcController {
  private _designStrategy: DesignStrategy;
  private _order: string[];
  private _effiency!: Efficiency;
  private _ratio!: TransRatio;
  private _calcEngine!: CalculatedEngine;
  private _calcEnginePostStats!: any;
  private _calcMechDrive!: CalculatedChain; // || CalculatedBelt; nếu có belt
  private _calcGearSet: GearSet[] | any[] = []; // any vì mỗi thiết kế lại có kiểu khác nhau
  // private _calcShaft: CalculatedShaft | null;
  private _gearBoxBuilder: GearBoxBuilder;

  // Implement semi-Singleton to store object state
  private static instance: CalcController;

  static getInstance(): CalcController {
    return CalcController.instance;
  }

  constructor(gearBoxType: string) {
    switch (gearBoxType) {
      case "GearBox1":
        this._designStrategy = new DesignGearBox1();
        this._order = ["kn", "brt_1", "brt_2", "x"];
        break;
      case "GearBox2":
        this._designStrategy = new DesignGearBox2();
        this._order = ["d", "tv", "brt", "kn"];
        break;
      default:
        throw new Error("Invalid gear box type");
    }
    CalcController.instance = this;
    this._gearBoxBuilder = new GearBoxBuilder();
  }

  initDesign(F: number, v: number, T1: number, t1: number, T2: number, t2: number, L: number, output: any) {
    this._designStrategy.storeDesignInput(F, v, T1, t1, T2, t2, L, output);
  }

  calcEngineBase() {
    let engiDes = this._designStrategy.designEngine();
    this._calcEngine = engiDes.engi;
    this._effiency = engiDes.base_effi;
    this._ratio = engiDes.base_ratio;
  }
  adjustCalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    if (this._calcEngine) {
      // Adjust engine parameters
      this._calcEngine = this._designStrategy.recalcEngine(efficiency, ratio);
    } else {
      throw new Error("Base engine calculation has not been performed");
    }
  }

  chooseEngine(selected: SelectedEngine) {
    this._gearBoxBuilder.setEngine(selected);
  }

  getEnginePostStats() {
    if (this._calcEnginePostStats) {
      return this._calcEnginePostStats;
    } else if (this._gearBoxBuilder && this._calcEngine) {
      try {
        const newTransRatio = EngineController.getNewTransRatio(
          this._calcEngine,
          this._gearBoxBuilder.getEngine(),
          this._ratio
        );
        if (newTransRatio) {
          const newEngineShaftStats = EngineController.getShaftStats(
            this._gearBoxBuilder.getEngine().n_t,
            this._calcEngine.p_lv,
            this._effiency,
            newTransRatio,
            this._order
          );
          let rearrangedRatio = this._order
            .map((ratio_type) => newTransRatio.ratio_spec.find((ratio) => ratio.type === ratio_type))
            .reverse();
          this._calcEnginePostStats = {
            rearrangedRatio,
            newEngineShaftStats,
          };
          return this._calcEnginePostStats;
        } else {
          return null;
        }
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Lỗi", error.message);
          alert(`Error while calculating engine stats: ${error.message}`);
        }
      }
    }
  }

  getCalcEngine(): CalculatedEngine {
    return this._calcEngine;
  }

  showEngineParam(): { effi: Efficiency; ratio: TransRatio } {
    return { effi: this._effiency, ratio: this._ratio };
  }

  calcMechDriveBase(input: MechDriveInput) {
    let mechDriveDes = this._designStrategy.designMechDrive(input);
    this._calcMechDrive = mechDriveDes;
  }

  chooseMechDrive(selected: SelectedChain | any) {
    // Selected Chain chỉ mang tính chất chọn thiết kế chuẩn để tính tiếp, nên sẽ dùng calcMechDrive để lưu state
    this._designStrategy.continueCalcMechDrive(this._calcMechDrive, selected);
    this._gearBoxBuilder.setMechDrive(this._calcMechDrive);
  }

  getCalcMechDrive(): CalculatedChain | any {
    return this._calcMechDrive;
  }

  calcGearSet(
    input: {
      sigma_b: [number, number];
      sigma_ch: [number, number];
      HB: [number, number];
      S_max: [number, number];
    },
    inputShaftNo: number = 1 | 2 | 3
  ) {
    try {
      this._calcGearSet.push(
        this._designStrategy.designGear({
          ...input,
          shaftStats: {
            u: this._calcEnginePostStats.rearrangedRatio[inputShaftNo].value,
            n: this._calcEnginePostStats.newEngineShaftStats.n[inputShaftNo],
            T: this._calcEnginePostStats.newEngineShaftStats.T[inputShaftNo],
          },
          K_qt: this._gearBoxBuilder.getEngine().T_max_T_dn,
        })
      );
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        Alert.alert("Lỗi", error.message);
        alert(`Lỗi khi tính toán bộ truyền: ${error.message}`);
      }
    }
  }
  getCalcGearSet(): any[] {
    return this._calcGearSet;
  }

  setGearAll() {
    this._gearBoxBuilder.setGearSet(this._calcGearSet);
  }
}
