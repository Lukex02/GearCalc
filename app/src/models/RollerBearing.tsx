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
    public r: number,
    public C: number,
    public C_O: number,
    public description: string,
    public B?: number, // của ổ bi đỡ 1 dãy
    public b?: number, // của ổ bi đỡ - chặn
    public r1?: number // của ổ bi đỡ - chặn
  ) {}
}
