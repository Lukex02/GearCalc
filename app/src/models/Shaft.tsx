import Utils from "../services/Utils";
import Efficiency, { IEfficiency } from "./Efficiency";
import TransRatio from "./GearRatio";

export class DistributedShaftStats {
  private _n: number[]; // Tốc độ quay trên các trục, [n_dc, n1, n2, n3,..., n_ct]
  private _p: number[]; // Công suất trên các trục, [p_dc, p1, p2, p3,..., p_ct]
  private _T: number[]; // Momen xoắn trên các trục [t_dc, t1, t2, t3,..., t_ct] (ct là công tác, hay là output cuối)

  constructor(n_dc: number, p_td: number, effi: Efficiency, ratio: TransRatio, order: string[]) {
    this._n = [n_dc];
    order.map((type) => {
      const cur = ratio.ratio_spec.find((ratio) => ratio.type === type)!;
      this._n.push(this._n[this._n.length - 1] / cur.value);
    });
    this._p = this.calc_power(p_td, effi.n_parts_spec, order.reverse());
    this._T = this._p.map((p, idx) => this.calc_torque(this._n[idx], p));
  }

  calc_power(p_td: number, efficienciesList: IEfficiency[], order: string[]): number[] {
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

export default class CalculatedShaft {
  private _sigma_b: number; // Giới hạn bền
  private _sigma_ch: number; // Giới hạn chảy
  private _HB: number; // Độ rắn
  private _d: number[]; // Sơ bộ đường kính trục, với nhiều trục thì sẽ có d_<thứ tự> tương ứng
  private _bO: number[]; // Chiều rộng ổ lăn
  private _hub_length!: any[]; // Độ dài của điều trục
  private _k1!: number; // Khoảng cách từ mặt mút của chi tiết quay đến thành trong của hộp hoặc khoảng cách giữa các chi tiết quay
  private _k2!: number; // Khoảng cách từ mặt mút ổ đến thành trong của hộp (lấy giá trị nhỏ khi bôi trơn ổ bằng dầu trong hộp giảm tốc)
  private _k3!: number; // Khoảng cách từ mặt mút của chi tiết quay đến nắp ổ
  private _h_n!: number; // Chiều cao nắp ổ và đầu bulông

  constructor(
    sigma_b: number,
    sigma_ch: number,
    HB: number,
    distributedTorque: number[],
    tau_allow: number[]
  ) {
    this._sigma_b = sigma_b;
    this._sigma_ch = sigma_ch;
    this._HB = HB;
    this._d = distributedTorque.map((torque, idx) => {
      return Math.ceil(Math.pow(torque / (0.2 * tau_allow[idx]), 1 / 3) / 5) * 5;
    });
    this._bO = this._d.map((d) => Utils.getBO(d));
  }
  add_distance(k1: number, k2: number, k3: number, h_n: number) {
    this._k1 = k1;
    this._k2 = k2;
    this._k3 = k3;
    this._h_n = h_n;
  }
  calc_hub_length(
    order: string[],
    b_w1: number,
    b_w2: number,
    hub_d_x_brt: number = 1.5, // Hệ số tính chiều dài mayơ bánh đai, dĩa xích, bánh răng trụ
    hub_kn_tvdh: number = 1.6, // Hệ số tính chiếu dài mayơ nửa khớp nối đối với trục vòng đàn hồi
    hub_kn_tr?: number, // Hệ số tính chiều dài mayơ nửa khớp nối đối với trục răng, có thể sẽ define sau nếu có làm thiết kế liên quan
    hub_bv?: number, // Hệ só tính chiều dài mayơ bánh vít
    hub_brc?: number // Hệ só tính chiều dài mayơ bánh răng côn
  ) {
    // Tính độ rắn
    order.forEach((comp) => {
      if (comp === "brt1") {
        // Bánh răng trụ 1 (cấp nhanh)
        this._hub_length.push({
          name: "lm13",
          value: hub_d_x_brt * this._d[0] < b_w1 ? b_w1 : hub_d_x_brt * this._d[0],
        });
        this._hub_length.push({
          name: "lm22",
          value: hub_d_x_brt * this._d[1] < b_w1 ? b_w1 : hub_d_x_brt * this._d[1],
        });
      } else if (comp == "brt2") {
        // Bánh răng trụ 2 (cấp chậm)
        this._hub_length.push({
          name: "lm23",
          value: hub_d_x_brt * this._d[1] < b_w2 ? b_w2 : hub_d_x_brt * this._d[1],
        });
        this._hub_length.push({
          name: "lm32",
          value: hub_d_x_brt * this._d[2] < b_w2 ? b_w2 : hub_d_x_brt * this._d[2],
        });
      } else if (comp == "x") {
        // Xích
        this._hub_length.push({ name: "lm33", value: hub_d_x_brt * this._d[2] });
      } else if (comp == "kn") {
        // Khớp nối
        this._hub_length.push({ name: "lm12", value: hub_kn_tvdh * this._d[0] });
      }
    });
  }
  getHubLength(name: string) {
    return this._hub_length.find((h) => h.name === name)!.value;
  }
  getBO(idx: number) {
    return this._bO[idx - 1]; // Vì sẽ gọi idx theo như ký hiệu trong sách/thiết kế nên khi tra mảng phải -1
  }
  getD(idx: number) {
    return this._d[idx - 1];
  }
  get k1() {
    return this._k1;
  }
  get k2() {
    return this._k2;
  }
  get k3() {
    return this._k3;
  }
  get h_n() {
    return this._h_n;
  }
}
