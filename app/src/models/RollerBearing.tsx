export default class CalculatedRollerBearing {
  // private _Fr_A: number; // Tải trọng hướng tâm tác dụng lên ổ A
  // private _Fr_B: number; // Tải trọng hướng tâm tác dụng lên ổ B
  // private _Fr_C: number; // Tải trọng hướng tâm tác dụng lên ổ C
  // private _Fr_D: number; // Tải trọng hướng tâm tác dụng lên ổ D
  private _Fr: number; // Tải trọng hướng tâm tác dụng lên ổ lăn
  constructor(Rx: number, Ry: number) {
    this._Fr = Math.sqrt(Rx ** 2 + Ry ** 2);
  }
  get Fr() {
    return this._Fr;
  }
}

export class SelectedRollerBearing {
  constructor(
    public type: string,
    public symbol: number,
    public d: number,
    public D: number,
    public B: number,
    public r: number,
    public C: number,
    public C_O: number,
    public description: string
  ) {}
}
