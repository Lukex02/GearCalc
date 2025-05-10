import CalculatedChain from "@models/Chain";
import { CalculatedEngine, SelectedEngine } from "@models/EngineModel";
import GearSet, { CalculatedGear } from "@models/Gear";
import CalculatedShaft from "@models/Shaft";
import { SelectedRollerBearing } from "@models/RollerBearing";
import Lubricant from "@models/Lubricant";

export class GearBox {
  private _design!: any;
  private _type!: string;
  private _calcEnginePostStats: any | null;
  private _engine: SelectedEngine | any;
  private _mechDrive: CalculatedChain | any;
  private _gearSet: GearSet[] | any = [];
  private _shaft: CalculatedShaft | any;
  private _rollerBearing: Record<number, SelectedRollerBearing> = {};
  private _box: any;
  private _lubricant!: Lubricant;

  set design(storedDesign: any) {
    this._design = storedDesign;
  }
  get design(): any {
    return this._design;
  }
  set type(type: string) {
    this._type = type;
  }
  get type(): string {
    return this._type;
  }
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
  set gearSet(gearSet: GearSet[] | any) {
    this._gearSet = gearSet;
  }
  get gearSet(): GearSet[] | any {
    return this._gearSet;
  }
  set shaft(shaft: CalculatedShaft) {
    this._shaft = shaft;
  }
  get shaft(): CalculatedShaft {
    return this._shaft;
  }
  set rollerBearing(rollerBearing: SelectedRollerBearing[]) {
    this._rollerBearing = rollerBearing;
  }
  get rollerBearing(): Record<number, SelectedRollerBearing> {
    return this._rollerBearing;
  }
  set box(box: any) {
    this._box = box;
  }
  get box(): any {
    return this._box;
  }
  set lubricant(lub: Lubricant) {
    this._lubricant = lub;
  }
  get lubricant(): Lubricant {
    return this._lubricant;
  }
}

//
// ------------- Builder of Gear Box will be created
//
interface Builder {
  reset(): void;
  setDesign(storedItem: any): void;
  setType(gearBoxType: string): void;
  setCalcEnginePostStats(calcEngine: any): void;
  setEngine(engine: SelectedEngine): void;
  setMechDrive(mechDrive: CalculatedChain | any): void;
  setGearSet(gears: GearSet, name: string): void;
  setShaft(shaft: CalculatedShaft): void;
  setRollerBearing(rollerBearing: SelectedRollerBearing, shaftNo: 1 | 2 | 3): void;
  setBox(box: any): void;
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
  setDesign(storedItem: any): void {
    this._gearBox.design = storedItem;
  }
  setType(gearBoxType: string): void {
    this._gearBox.type = gearBoxType;
  }
  getType(): string {
    return this._gearBox.type;
  }
  setCalcEnginePostStats(calcEngine: { ratio: any; distShaft: any }): void {
    this._gearBox.calcEngine = calcEngine;
  }
  getCalcEnginePostStats(): { ratio: any; distShaft: any } {
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
  setGearSet(gearSet: any, name: "Bánh răng cấp nhanh" | "Bánh răng cấp chậm"): void {
    this._gearBox.gearSet = this._gearBox.gearSet.filter((item: any) => item.name !== name);
    this._gearBox.gearSet.push(gearSet);
  }
  getGearSet(): any[] {
    return this._gearBox.gearSet;
  }
  setShaft(shaft: CalculatedShaft): void {
    this._gearBox.shaft = shaft;
  }
  getShaft(): CalculatedShaft {
    return this._gearBox.shaft;
  }
  setRollerBearing(rollerBearing: SelectedRollerBearing, shaftNo: 1 | 2 | 3): void {
    this._gearBox.rollerBearing[shaftNo] = rollerBearing;
  }
  getRollerBearing(): Record<number, SelectedRollerBearing> {
    return this._gearBox.rollerBearing;
  }
  setBox(box: any): void {
    this._gearBox.box = box;
  }
  getBox(): any {
    return this._gearBox.box;
  }
  setLubricant(lubricant: Lubricant): void {
    this._gearBox.lubricant = lubricant;
  }
  getLubricant(): Lubricant {
    return this._gearBox.lubricant;
  }
  build(): GearBox {
    return this._gearBox;
  }
}
