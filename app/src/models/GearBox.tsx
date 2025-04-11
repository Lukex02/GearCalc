import CalculatedChain from "./Chain";
import { SelectedEngine } from "./EngineModel";
import { CalculatedGear } from "./Gear";

export default class GearBox {
  private _engine!: SelectedEngine;
  private _mechDrive!: any;
  private _gearSet!: CalculatedGear[] | any;

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
}

// This is where the builder of Gear Box will be created
interface Builder {
  reset(): void;
  setEngine(engine: SelectedEngine): void;
  setMechDrive(mechDrive: CalculatedChain | any): void;
  setGearSet(gears: CalculatedGear[] | any): void;
  // setShaft(shaft: Shaft): void;
  build(): GearBox;
}

export class GearBoxBuilder implements Builder {
  private _gearBox!: GearBox;

  constructor() {
    this.reset();
  }

  reset(): void {
    this._gearBox = new GearBox();
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

  build(): GearBox {
    return this._gearBox;
  }
}
