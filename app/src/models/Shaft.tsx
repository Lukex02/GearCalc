import Utils from "@services/Utils";
import Efficiency, { IEfficiency } from "@models/Efficiency";
import TransRatio from "@models/GearRatio";
import CalculatedKey from "@models/Key";

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
  private _distributedTorque: number[];
  private _d_sb: number[]; // Sơ bộ đường kính trục, với nhiều trục thì sẽ có d_<thứ tự> tương ứng
  private _d!: number[]; // Đường kính trục (đã xác định), với nhiều trục thì sẽ có d_<thứ tự> tương ứng
  private _bO!: number[]; // Chiều rộng ổ lăn
  private _hub_length!: { name: string; value: number }[]; // Độ dài của điều trục
  private _k1!: number; // Khoảng cách từ mặt mút của chi tiết quay đến thành trong của hộp hoặc khoảng cách giữa các chi tiết quay
  private _k2!: number; // Khoảng cách từ mặt mút ổ đến thành trong của hộp (lấy giá trị nhỏ khi bôi trơn ổ bằng dầu trong hộp giảm tốc)
  private _k3!: number; // Khoảng cách từ mặt mút của chi tiết quay đến nắp ổ
  private _h_n!: number; // Chiều cao nắp ổ và đầu bulông
  private _F_a!: number[]; // Lực dọc trục

  private _indiShaft: IndividualShaft[] = [];

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
    // this._d = distributedTorque.map((torque, idx) => {
    //   return Math.ceil(Math.pow(torque / (0.2 * tau_allow[idx]), 1 / 3) / 5) * 5;
    // });
    // this._bO = this._d.map((d) => Utils.getBO(d));
    this._d_sb = distributedTorque.map((torque, idx) => Math.pow(torque / (0.2 * tau_allow[idx]), 1 / 3));
    this._distributedTorque = distributedTorque;
  }
  choose_d(d_choose: number[]) {
    // Về lý thuyết sẽ không thể xảy ra vì đã số lượng d cho chọn đã được xác định từ trang view
    if (d_choose.length != this._d_sb.length) throw new Error("Số lượng d vượt quá số lượng d sơ bộ");
    this._d = d_choose;
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
    hub_bv?: number, // Hệ só tính chiều dài mayơ bánh vít, có thể sẽ define sau nếu có làm thiết kế liên quan
    hub_brc?: number // Hệ só tính chiều dài mayơ bánh răng côn, có thể sẽ define sau nếu có làm thiết kế liên quan
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
  addIndiviDia(
    MParam: { point: string; Mx: number; My: number; Rx: number; Ry: number }[],
    shaftNo: 1 | 2 | 3,
    l: { name: string; value: number }[]
  ) {
    const sigma_allow = Utils.getSigmaAllowInShaft(this._d[shaftNo - 1]);
    const T = this._distributedTorque[shaftNo - 1];
    this._indiShaft.push(new IndividualShaft(MParam, T, sigma_allow, l));
  }
  addAxialForce(F_a: number) {
    if (!this._F_a) this._F_a = [];
    this._F_a.push(F_a);
  }
  getAxialForce(shaftNo: 1 | 2 | 3) {
    if (shaftNo === 1) return this._F_a[0];
    if (shaftNo === 2) return Math.abs(this._F_a[2] - this._F_a[1]);
    else return this._F_a[3];
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
  getIndividualShaft(shaftNo: 1 | 2 | 3) {
    return this._indiShaft[shaftNo - 1];
  }
  getAllIndividualShaft() {
    return this._indiShaft;
  }
  get HB() {
    return this._HB;
  }
  get d_sb() {
    return this._d_sb;
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
  get sigma_b() {
    return this._sigma_b;
  }
  get sigma_ch() {
    return this._sigma_ch;
  }
}

class IndividualShaft {
  private _T: number; // Lực tác dụng lên trục này
  private _l: { name: string; value: number }[];
  private _maxStats: {
    d: number;
    M: number;
  };
  private _statAtPoint: {
    point: string; // Tên điểm được ký hiệu (A, B, C, D)
    d_sb: number; // Đường kính sơ bộ tại các mặt cắt trên trục này
    d: number | undefined; // Đường kính (chọn) tại các mặt cắt trên trục này
    M_td: number; // Momen tương đương
    M_x: number; // Momen theo trục x
    M_y: number; // Momentheo trục y
    R_x: number; // Phản lực theo trục x
    R_y: number; // Phản lực theo trục y
    key: CalculatedKey | undefined; // Then
  }[];

  constructor(
    MParam: { point: string; Mx: number; My: number; Rx: number; Ry: number }[],
    T: number,
    sigma_allow: number,
    l: { name: string; value: number }[]
  ) {
    this._T = T;
    this._l = l;
    this._maxStats = { d: 0, M: 0 };
    this._statAtPoint = MParam.map((curr) => {
      const M_td = Math.sqrt(curr.Mx ** 2 + curr.My ** 2 + 0.75 * T ** 2);
      this._maxStats.M = Math.max(this._maxStats.M, M_td);
      return {
        point: curr.point,
        M_td: M_td,
        M_x: curr.Mx,
        M_y: curr.My,
        R_x: curr.Rx,
        R_y: curr.Ry,
        d_sb: M_td / (0.1 * sigma_allow) ** 1 / 3,
        d: undefined,
        key: undefined,
      };
    });
  }
  choose_d(
    d_choose: {
      point: string;
      value: number;
    }[]
  ) {
    d_choose.forEach((d) => {
      this._statAtPoint.forEach((stat, idx) => {
        if (stat.point === d.point) {
          this._maxStats.d = Math.max(this._maxStats.d, d.value);
          stat.d = d.value;
        }
      });
    });
  }
  getStatAtPoint(point: string) {
    return this._statAtPoint.find((stat) => stat.point === point)!;
  }
  get T() {
    return this._T;
  }
  get maxStats() {
    return this._maxStats;
  }
  get l() {
    return this._l;
  }
}
