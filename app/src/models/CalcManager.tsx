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
  ): any;
}

// Hộp giảm tốc 2 cấp khai triển (2 cặp bánh răng)
class DesignGearBox1 implements DesignStrategy {
  designEngine(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)\
    drum_pulley: {
      // Trục tang trống
      D: number; // Đường kính tang
    }
  ): any {
    // Design strategy 1 implementation
  }
}

// Hộp giảm tốc bánh răng trục vít 1 cấp
class DesignGearBox2 implements DesignStrategy {
  private _data: any;
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
    let newEfficieny = new Efficiency([
      [{ type: "ol", value: 0.99 }, 4],
      [{ type: "d", value: 0.94 }, 1],
      [{ type: "tv", value: 0.85 }, 1],
      [{ type: "brt", value: 0.96 }, 1],
      [{ type: "kn", value: 0.98 }, 1],
    ]);
    let newRatio = new TransRatio([
      { type: "d", value: 3 },
      { type: "tv", value: 10 },
      { type: "brt", value: 3 },
      { type: "kn", value: 1 },
    ]);

    return EngineController.generateCalculatedEngine(
      F,
      v,
      sprocket.z * sprocket.p, // Chu vi của đĩa xích
      T1,
      t1,
      T2,
      t2,
      newEfficieny,
      newRatio
    );
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
      case "GearBox1":
        this._designStrategy = new DesignGearBox1();
        break;
      case "GearBox2":
        this._designStrategy = new DesignGearBox2();
        break;
      default:
        throw new Error("Invalid gear box type");
    }
    this._calcEngine = null;
    this._gearBoxBuilder = new GearBoxBuilder();
  }
  calcEngine(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    output: any
  ) {
    F = 17000;
    v = 0.5;
    T1 = 1;
    t1 = 25;
    T2 = 0.5;
    t2 = 15;
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

  chooseEngine(selected: SelectedEngine) {
    this._gearBoxBuilder.setEngine(selected);
  }
}
