import CalculatedChain from "./Chain";
import { CalculatedEngine, SelectedEngine } from "./EngineModel";
import { CalculatedGear } from "./Gear";
import CalculatedShaft from "./Shaft";

class GearBox {
  private _calcEnginePostStats: any;
  private _engine: SelectedEngine | any;
  private _mechDrive: CalculatedChain | any;
  private _gearSet: CalculatedGear[] | any;
  private _shaft: CalculatedShaft | any;

  set calcEngine(calcEngine: any) {
    this._calcEnginePostStats = calcEngine;
  }
  get calcEngine(): any {
    return this._calcEnginePostStats;
  }
  set engine(engine: SelectedEngine) {
    this._engine = engine;
  }
  get engine(): SelectedEngine {
    return this._engine;
  }
  set mechDrive(mechDrive: CalculatedChain | any) {
    this._mechDrive = mechDrive;
  }
  get mechDrive(): CalculatedChain | any {
    return this._mechDrive;
  }
  set gearSet(gearSet: CalculatedGear[] | any) {
    this._gearSet = gearSet;
  }
  get gearSet(): CalculatedGear[] | any {
    return this._gearSet;
  }
  set shaft(shaft: CalculatedShaft) {
    this._shaft = shaft;
  }
  get shaft(): CalculatedShaft {
    return this._shaft;
  }
}

//
// ------------- Builder of Gear Box will be created
//
interface Builder {
  reset(): void;
  setEngine(engine: SelectedEngine): void;
  setMechDrive(mechDrive: CalculatedChain | any): void;
  setGearSet(gears: CalculatedGear[] | any): void;
  setShaft(shaft: CalculatedShaft): void;
  build(): GearBox;
}

export default class GearBoxBuilder implements Builder {
  private _gearBox!: GearBox;

  constructor() {
    this.reset();
  }

  reset(): void {
    this._gearBox = new GearBox();
  }
  setCalcEnginePostStats(calcEngine: any): void {
    this._gearBox.calcEngine = calcEngine;
  }
  getCalcEnginePostStats(): CalculatedEngine {
    return this._gearBox.calcEngine;
  }
  setEngine(engine: SelectedEngine): void {
    this._gearBox.engine = engine;
  }
  getEngine(): SelectedEngine {
    return this._gearBox.engine;
  }
  setMechDrive(mechDrive: any): void {
    this._gearBox.mechDrive = mechDrive;
  }
  getMechDrive(): any {
    return this._gearBox.mechDrive;
  }
  setGearSet(gearSet: any): void {
    this._gearBox.gearSet = gearSet;
  }
  getGearSet(): any {
    return this._gearBox.gearSet;
  }
  setShaft(shaft: CalculatedShaft): void {
    this._gearBox.shaft = shaft;
  }
  getShaft(): CalculatedShaft {
    return this._gearBox.shaft;
  }

  build(): GearBox {
    return this._gearBox;
  }
}
