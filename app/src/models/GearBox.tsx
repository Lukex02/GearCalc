import { SelectedEngine } from "./EngineModel";

export default class GearBox {
  private _engine!: SelectedEngine;

  set engine(engine: SelectedEngine) {
    this._engine = engine;
  }
  get engine(): SelectedEngine {
    return this._engine;
  }
}

// This is where the builder of Gear Box will be created
interface Builder {
  reset(): void;
  setEngine(engine: SelectedEngine): void;
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

  build(): GearBox {
    return this._gearBox;
  }
}
