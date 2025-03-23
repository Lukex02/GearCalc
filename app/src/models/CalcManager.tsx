import EngineController from "../controller/EngineController";
import Efficiency from "./Efficiency";
import { CalculatedEngine, SelectedEngine } from "./EngineModel";
import GearBox, { GearBoxBuilder } from "./GearBox";
import TransRatio from "./GearRatio";

interface DesignStrategy {
  _designStats: any;
  _effiency: Efficiency;
  _ratio: TransRatio;
  designEngine(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)\
    output: any // Có thể là đĩa xích, trục tang, tùy thuộc sẽ thay đổi kiểu và số liệu
  ): any;
  recalcEngine(efficiency: Efficiency, ratio: TransRatio): CalculatedEngine;
  showEngineParam(): [Efficiency, TransRatio];
}

// Hộp giảm tốc 2 cấp khai triển (2 cặp bánh răng)
// Quay một chiều, làm việc 2 ca, tải va đập nhẹ: 1 năm làm việc 300 ngày, 1 ca làm việc 8 giờ.
// class DesignGearBox1 implements DesignStrategy {
//   _effiency!: Efficiency;
//   _ratio!: TransRatio;
//   designEngine(
//     F: number, // Lực vòng trên băng tải (N) (đề)
//     v: number, // Vận tốc băng tải (m/s) (đề)
//     T1: number, // Momen xoắn chế độ tải 1 (đề)
//     t1: number, // Thời gian hoạt động ở tải 1 (đề)
//     T2: number, // Momen xoắn chế độ tải 2 (đề)
//     t2: number, // Thời gian hoạt động ở tải 2 (đề)\
//     drum_pulley: {
//       // Trục tang trống
//       D: number; // Đường kính tang
//     }
//   ): any {
//     // Design strategy 1 implementation
//   }
//   // showEngineParam() {}
// }

// Hộp giảm tốc bánh răng trục vít 1 cấp
class DesignGearBox2 implements DesignStrategy {
  _designStats: any;
  _effiency!: Efficiency;
  _ratio!: TransRatio;
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
  ): CalculatedEngine {
    // Design strategy 2 implementation
    this._effiency = new Efficiency([
      [{ type: "ol", value: 0.99 }, 4],
      [{ type: "d", value: 0.94 }, 1],
      [{ type: "tv", value: 0.85 }, 1],
      [{ type: "brt", value: 0.96 }, 1],
      [{ type: "kn", value: 0.98 }, 1],
    ]);
    this._ratio = new TransRatio([
      { type: "d", value: 3 },
      { type: "tv", value: 10 },
      { type: "brt", value: 3 },
      { type: "kn", value: 1 },
    ]);
    this._designStats = {
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
      efficiency: this._effiency,
      ratio: this._ratio,
    };
    return EngineController.generateCalculatedEngine(
      F,
      v,
      sprocket.z * sprocket.p, // Chu vi của đĩa xích
      T1,
      t1,
      T2,
      t2,
      this._effiency,
      this._ratio
    );
  }
  recalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    this._effiency = efficiency;
    this._ratio = ratio;
    return EngineController.generateCalculatedEngine(
      this._designStats.F,
      this._designStats.v,
      this._designStats.sprocket.z * this._designStats.sprocket.p, // Chu vi của đ��a xích
      this._designStats.T1,
      this._designStats.t1,
      this._designStats.T2,
      this._designStats.t2,
      this._effiency,
      this._ratio
    );
  }
  showEngineParam(): [Efficiency, TransRatio] {
    return [this._effiency, this._ratio];
  }
}

export default class CalcManager {
  private _designStrategy: DesignStrategy;
  private _calcEngine: CalculatedEngine | null;
  // private _calcGear: CalculatedGear | null;
  // private _calcShaft: CalculatedShaft | null;
  private _gearBoxBuilder: GearBoxBuilder;

  constructor(gearBoxType: string) {
    switch (gearBoxType) {
      // case "GearBox1":
      //   this._designStrategy = new DesignGearBox1();
      //   break;
      case "GearBox2":
        this._designStrategy = new DesignGearBox2();
        break;
      default:
        throw new Error("Invalid gear box type");
    }
    this._calcEngine = null;
    this._gearBoxBuilder = new GearBoxBuilder();
  }
  calcEngineBase(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    output: any
  ) {
    this._calcEngine = this._designStrategy.designEngine(
      F,
      v,
      T1,
      t1,
      T2,
      t2,
      output
    );
  }
  adjustCalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    if (this._calcEngine) {
      // Adjust engine parameters
      this._calcEngine = this._designStrategy.recalcEngine(efficiency, ratio);
    } else {
      throw new Error("Engine calculation has not been performed");
    }
  }

  chooseEngine(selected: SelectedEngine) {
    this._gearBoxBuilder.setEngine(selected);
  }

  getPostStats(newEfficieny: Efficiency, newRatio: TransRatio) {
    if (this._gearBoxBuilder && this._calcEngine) {
      const newTransRatio = EngineController.getNewTransRatio(
        this._calcEngine,
        this._gearBoxBuilder.getEngine(),
        newRatio
      );
      const newShaftStats = EngineController.getShaftStats(
        this._gearBoxBuilder.getEngine().n_t,
        this._calcEngine.p_td,
        newEfficieny,
        newRatio
      );
      return {
        newTransRatio,
        newShaftStats,
      };
    }
  }

  get calcEngine() {
    return this._calcEngine;
  }

  get calcEngineParam(): [Efficiency, TransRatio] {
    return this._designStrategy.showEngineParam();
  }
}
