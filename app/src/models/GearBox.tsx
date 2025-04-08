import { SelectedEngine } from "./EngineModel";

export default class GearBox {
  private _engine!: SelectedEngine;
  private _mechDrive!: any;

  set engine(engine: SelectedEngine) {
    this._engine = engine;
  }
  get engine(): SelectedEngine {
    return this._engine;
  }
  set mechDrive(mechDrive: any) {
    this._mechDrive = mechDrive;
  }
  get mechDrive(): any {
    return this._mechDrive;
  }
}

// This is where the builder of Gear Box will be created
interface Builder {
  reset(): void;
  setEngine(engine: SelectedEngine): void;
  setMechDrive(mechDrive: any): void;
  // setGears(gears: Gear[]): void;
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

  build(): GearBox {
    return this._gearBox;
  }
}
