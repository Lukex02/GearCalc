import Efficiency, { IEfficieny } from "./Efficiency";
import TransRatio from "./GearRatio";

// Phần tính toán thì đúng nhưng mà cần không lệ thuộc vào array itteration hơn
export default class ShaftStats {
  private _n: number[]; // Tốc độ quay trên các trục, [n_dc, n1, n2, n3,...]
  private _p: number[]; // Công suất trên các trục, [p_dc, p1, p2, p3,...]
  private _T: number[]; // Momen xoắn trên các trục [t_dc, t1, t2, t3,...]

  constructor(n_dc: number, p_td: number, effi: Efficiency, ratio: TransRatio) {
    this._n = ratio.ratio_spec.reduce(
      (acc, ratio) => {
        if (ratio.type !== "u_kn") acc.push(acc[acc.length - 1] / ratio.value);
        return acc;
      },
      [n_dc]
    );
    let temp_effi = effi.n_parts_spec.reverse(); // Vì phải tính P ngược từ đầu ra
    this._p = this.calc_power(p_td, temp_effi);
    this._T = this._p.map((p, idx) => this.calc_torque(this._n[idx], p));
  }

  calc_power(p_td: number, efficienciesList: IEfficieny[]): number[] {
    const results: number[] = [p_td];
    const n_ol = efficienciesList.find((e) => e.type === "n_ol")?.value ?? 1;

    for (const efficiencies of efficienciesList) {
      if (efficiencies.type === "n_ol") continue;

      const lastP = results[results.length - 1];
      const newP = lastP / (efficiencies.value * n_ol);
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
