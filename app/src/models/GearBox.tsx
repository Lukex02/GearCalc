import { SelectedEngine } from "./EngineModel";

class GearBox {
  private _engine!: SelectedEngine;

  set engine(engine: SelectedEngine) {
    this._engine = engine;
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

class GearBoxBuilder implements Builder {
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

  build(): GearBox {
    return this._gearBox;
  }
}
