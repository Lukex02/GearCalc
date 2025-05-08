import GearSet from "@models/Gear";
import CalculatedShaft from "@models/Shaft";
import Utils from "@services/Utils";

export default class Box {
  private _deltaBody: number;
  private _deltaLid: number;
  private _e: number;
  private _h: number;
  private _slope: number;
  private _d1: number;
  private _d2: number;
  private _d3: number;
  private _d4: number;
  private _d5: number;
  private _S3: number;
  private _S4: number;
  private _E2: number;
  private _R2: number;
  private _K2: number;
  private _K3: number;
  private _shaftBearing: any[];
  private _S1: number;
  private _K1: number;
  private _q: number;
  private _deltaGapGears: number;
  private _deltaGapTop: number;
  private _deltaGapSide: number;
  private _L: number;
  private _B: number;
  private _Z: number;

  constructor(gears: GearSet[], shaft: CalculatedShaft, D1: number[]) {
    const a_w = gears.map((gear) => gear.returnPostStats().a_w);
    const aMax = Math.max(...a_w);
    const da1 = gears[0].returnPostStats().da1;
    const dw2 = gears[1].returnPostStats().dw2;
    const l11 = shaft.getIndividualShaft(1).l.find((l) => l.name === "l11")!.value;
    const l21 = shaft.getIndividualShaft(2).l.find((l) => l.name === "l21")!.value;
    const l31 = shaft.getIndividualShaft(3).l.find((l) => l.name === "l31")!.value;
    const l_max = Math.max(l11, l21, l31);

    // Chiều dày hộp
    this._deltaBody = Math.round(aMax * 0.03 + 3); // Thân
    this._deltaLid = Math.ceil(this._deltaBody * 0.9); // Nắp

    // Gân tăng cứng
    this._e = this._deltaBody;
    this._h = 40; // Chiều cao
    this._slope = 2; // (độ) Độ dốc
    this._d1 = Math.ceil(0.04 * aMax + 10 + 2); // Bulông nền, d1
    this._d2 = Math.ceil(this._d1 * 0.7); // Bulông cạnh ổ
    this._d3 = Math.ceil(this._d2 * 0.8); // Bulông ghép bích nắp và thân, d3
    this._d4 = Math.ceil(this._d2 * 0.7); // Vít ghép nắp ổ
    this._d5 = Math.ceil(this._d2 * 0.55); // Vít ghép thân ổ

    // Mặt bích ghép nắp và thân
    this._S3 = Math.ceil(1.6 * this._d4);
    this._S4 = Math.ceil(0.9 * this._S3);

    this._E2 = Math.ceil(1.6 * this._d2);
    this._R2 = 1.3 * this._d2;
    this._K2 = Math.ceil(this._E2 + this._R2 + 4);
    this._K3 = this._K2 - 4;

    this._shaftBearing = D1.map((D) => {
      const chooseSB = Utils.getShaftBearing(D)!;
      return {
        D: D,
        C: chooseSB.D3 / 2,
        ...chooseSB,
      };
    });

    this._S1 = Math.ceil(1.3 * this._d1);
    this._K1 = 3 * this._d1;
    this._q = this._K1 + 2 * this._deltaBody;

    this._deltaGapGears = 1.1 * this._deltaBody;
    this._deltaGapTop = 4 * this._deltaBody;
    this._deltaGapSide = this._deltaBody;
    this._L = Math.floor(a_w[0] + a_w[1] + da1 / 2 + dw2 / 2 + 2 * this._deltaGapGears + 2 * this._K3);
    this._B = l_max + this._K3;
    this._Z = (this._L + this._B) / 200;
  }
}
