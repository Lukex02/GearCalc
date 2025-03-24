import EngineController from "../controller/EngineController";
import Efficiency from "./Efficiency";
import { CalculatedEngine, SelectedEngine } from "./EngineModel";
import GearBox, { GearBoxBuilder } from "./GearBox";
import TransRatio from "./GearRatio";

interface DesignStrategy {
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
}

// Hộp giảm tốc 2 cấp khai triển (2 cặp bánh răng)
// Quay một chiều, làm việc 2 ca, tải va đập nhẹ: 1 năm làm việc 300 ngày, 1 ca làm việc 8 giờ.
class DesignGearBox1 implements DesignStrategy {
  _designStats: any;

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
    let baseRatio = new TransRatio([
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
      this._designStats.F,
      this._designStats.v,
      this._designStats.sprocket.z * this._designStats.sprocket.p, // Chu vi của đ��a xích
      this._designStats.T1,
      this._designStats.t1,
      this._designStats.T2,
      this._designStats.t2,
      (this._designStats.efficiency = efficiency),
      (this._designStats.ratio = ratio)
    );
  }
}

// Hộp giảm tốc bánh răng trục vít 1 cấp
class DesignGearBox2 implements DesignStrategy {
  _designStats: any;

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
      [{ type: "ol", value: 0.992 }, 4],
      [{ type: "x", value: 0.96 }, 1],
      [{ type: "br", value: 0.96 }, 2],
      [{ type: "kn", value: 1 }, 1],
    ]);
    let baseRatio = new TransRatio([
      { type: "x", value: 2.56 },
      { type: "h", value: 18 },
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
      this._designStats.F,
      this._designStats.v,
      this._designStats.sprocket.z * this._designStats.sprocket.p, // Chu vi của đ��a xích
      this._designStats.T1,
      this._designStats.t1,
      this._designStats.T2,
      this._designStats.t2,
      (this._designStats.efficiency = efficiency),
      (this._designStats.ratio = ratio)
    );
  }
}

export default class CalcManager {
  private _designStrategy: DesignStrategy;
  private _effiency!: Efficiency;
  private _ratio!: TransRatio;
  private _calcEngine!: CalculatedEngine;
  // private _calcGear: CalculatedGear | null;
  // private _calcShaft: CalculatedShaft | null;
  private _gearBoxBuilder: GearBoxBuilder;

  constructor(gearBoxType: string) {
    switch (gearBoxType) {
      case "GearBox1":
        this._designStrategy = new DesignGearBox1();
        break;
      case "GearBox2":
        this._designStrategy = new DesignGearBox2();
        break;
      default:
        throw new Error("Invalid gear box type");
    }
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
    let engiDes = this._designStrategy.designEngine(
      F,
      v,
      T1,
      t1,
      T2,
      t2,
      output
    );
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
      const newTransRatio = EngineController.getNewTransRatio(
        this._calcEngine,
        this._gearBoxBuilder.getEngine(),
        this._ratio
      );
      const newEngineShaftStats = EngineController.getShaftStats(
        this._gearBoxBuilder.getEngine().n_t,
        this._calcEngine.p_td,
        this._effiency,
        newTransRatio
      );
      return {
        newTransRatio,
        newEngineShaftStats,
      };
    }
  }

  getCalcEngine(): CalculatedEngine {
    return this._calcEngine;
  }

  showEngineParam(): { effi: Efficiency; ratio: TransRatio } {
    return { effi: this._effiency, ratio: this._ratio };
  }
}
