import Efficiency, { IEfficieny } from "./Efficiency";
import TransRatio from "./GearRatio";

export default class ShaftStats {
  private _n: number[]; // Tốc độ quay trên các trục, [n_dc, n1, n2, n3,..., n_ct]
  private _p: number[]; // Công suất trên các trục, [p_dc, p1, p2, p3,..., p_ct]
  private _T: number[]; // Momen xoắn trên các trục [t_dc, t1, t2, t3,..., t_ct] (ct là công tác, hay là output cuối)

  constructor(n_dc: number, p_td: number, effi: Efficiency, ratio: TransRatio, order: string[]) {
    // this._n = ratio.ratio_spec.reduce(
    //   (acc, ratio) => {
    //     if (ratio.type !== "kn") acc.push(acc[acc.length - 1] / ratio.value);
    //     return acc;
    //   },
    //   [n_dc]
    // );
    this._n = [n_dc];
    order.map((type) => {
      const cur = ratio.ratio_spec.find((ratio) => ratio.type === type)!;
      this._n.push(this._n[this._n.length - 1] / cur.value);
    });
    // let temp_effi = effi.n_parts_flat.reverse(); // Vì phải tính P ngược từ đầu ra
    this._p = this.calc_power(p_td, effi.n_parts_spec, order.reverse());
    this._T = this._p.map((p, idx) => this.calc_torque(this._n[idx], p));
  }

  calc_power(p_td: number, efficienciesList: IEfficieny[], order: string[]): number[] {
    const results: number[] = [p_td];
    const n_ol = efficienciesList.find((e) => e.type === "ol")?.value ?? 1;

    for (const effiType of order) {
      let efficiency = efficienciesList.find((e) => effiType.includes(e.type))!;
      const lastP = results[results.length - 1];
      const newP = lastP / (efficiency.value * n_ol);
      results.push(newP);
    }

    return results.reverse();
  }

  private calc_torque(n: number, p: number): number {
    return (9.55 * 10 ** 6 * p) / n;
  }

  get n() {
    return this._n;
  }
  get p() {
    return this._p;
  }
  get T() {
    return this._T;
  }
}
