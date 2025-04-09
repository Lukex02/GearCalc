import EngineController from "./EngineController";
import Efficiency, { IEfficiency } from "../models/Efficiency";
import { CalculatedEngine, SelectedEngine } from "../models/EngineModel";
import GearBox, { GearBoxBuilder } from "../models/GearBox";
import TransRatio, { TransRatioType1, TransRatioType2 } from "../models/GearRatio";
import ChainController from "./ChainController";
import GearController from "./GearController";
import CalculatedChain, { SelectedChain } from "../models/Chain";
import { Alert } from "react-native";

type GearBox1GearSetInput = {
  sigma_b: number;
  sigma_ch: number;
  HB: number;
  S_max: number;
  shaftStats: {
    u: number;
    n: number;
    T: number;
  };
  desStats: {
    T1: number;
    t1: number;
    T2: number;
    t2: number;
    L_h: number;
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
  _designEngineStats: any;
  _designMechDriveStats: any;
  _designGearStats: any;

  designEngine(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)\
    output: any // Có thể là đĩa xích, trục tang, tùy thuộc sẽ thay đổi kiểu và số liệu
  ): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio };
  recalcEngine(efficiency: Efficiency, ratio: TransRatio): CalculatedEngine;
  designMechDrive(input: MechDriveInput): any;
  continueCalcMechDrive(calculated: CalculatedChain | any, selected: SelectedChain | any): void;
  designGear(input: GearSetInput): any; // Sẽ chỉ làm 1 hàm tính bánh răng dùng chung
}

// Hộp giảm tốc 2 cấp khai triển (2 cặp bánh răng)
// Quay một chiều, làm việc 2 ca, tải va đập nhẹ: 1 năm làm việc 300 ngày, 1 ca làm việc 8 giờ.
class DesignGearBox1 implements DesignStrategy {
  _designEngineStats: any;
  _designMechDriveStats: any;
  _designGearStats: any;

  designEngine(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)\
    drumPulley: {
      // Trục tang trống
      D: number; // Đường kính tang
    }
  ): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio } {
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
      F,
      v,
      T1,
      t1,
      T2,
      t2,
      drumPulley: {
        D: drumPulley.D,
      },
      efficiency: baseEfficiency,
      ratio: baseRatio,
    };
    return {
      engi: EngineController.generateCalculatedEngine(
        F,
        v,
        drumPulley.D * Math.PI, // Chu vi của đĩa xích
        T1,
        t1,
        T2,
        t2,
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
  designGear(input: GearBox1GearSetInput): any {
    // Design gears here
    GearController.generateGearSet(
      input.sigma_b,
      input.sigma_ch,
      input.HB,
      input.S_max,
      input.shaftStats,
      input.desStats,
      input.K_qt
    );
  }
}

// Hộp giảm tốc bánh răng trục vít 1 cấp
class DesignGearBox2 implements DesignStrategy {
  _designEngineStats: any;
  _designMechDriveStats: any;
  _designGearStats: any;

  designEngine(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)\
    sprocket: {
      // Đĩa xích
      z: number; // Số răng đĩa xích tải dẫn (răng) (đề)
      p: number; // Bước xích tải (mm) (đề)
    }
  ): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio } {
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
      F,
      v,
      T1,
      t1,
      T2,
      t2,
      sprocket: {
        z: sprocket.z,
        p: sprocket.p,
      },
      efficiency: baseEfficiency,
      ratio: baseRatio,
    };
    return {
      engi: EngineController.generateCalculatedEngine(
        F,
        v,
        sprocket.z * sprocket.p, // Chu vi của đĩa xích
        T1,
        t1,
        T2,
        t2,
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
    // this._designMechDriveStats = ChainController.generateCalculatedBelt(...);
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
  private _calcMechDrive!: CalculatedChain; // || CalculatedBelt; nếu có belt
  private _calcGear!: any; // any vì mỗi thiết kế lại có kiểu khác nhau
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
  calcEngineBase(F: number, v: number, T1: number, t1: number, T2: number, t2: number, output: any) {
    let engiDes = this._designStrategy.designEngine(F, v, T1, t1, T2, t2, output);
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
    if (this._gearBoxBuilder && this._calcEngine) {
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
          return {
            rearrangedRatio,
            newEngineShaftStats,
          };
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
    this._designStrategy.continueCalcMechDrive(this._calcMechDrive, selected);
  }

  getCalcMechDrive(): CalculatedChain | any {
    return this._calcMechDrive;
  }

  calcGear(input: GearSetInput) {
    this._designStrategy.designGear(input);
  }
}
