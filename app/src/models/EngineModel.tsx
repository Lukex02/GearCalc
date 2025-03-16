import { CalcU_tv } from "../services/Utils";

/*
  Todo:
  Hiệu suất cần tối ưu lại để sử dụng cho bất kì số lượng chi tiết nào, vì hiệu suất là tích của hiệu suất các chi tiết
  Tỷ số truyền tương tự hiệu suất
*/

export class CalculatedEngine {
  private _p: number; // Công suất trên trục công tác
  private _p_td: number; // Công suất tương đương
  private _p_ct: number; // Công suất cần thiết
  private _n_sb: number; // Số vòng quay sơ bộ của động cơ
  private _n_lv: number; // Số vòng quay của trục máy công tác

  constructor(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    z: number, // Số răng đĩa xích tải dẫn (răng) (đề)
    p: number, // Bước xích tải (mm) (đề)
    L: number, // Thời gian phục vụ (năm) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)
    efficiency_system: number,
    select_ratio: IRatio[]
  ) {
    this._p = this.calc_p(F, v);
    this._p_td = this.calc_p_td(T1, t1, T2, t2);
    this._n_lv = this.calc_n_lv(v, z, p);
    this._n_sb = this._n_lv * this.calc_u_t_predict(select_ratio); // NEW
    this._p_ct = this._p_td / efficiency_system;
  }

  // Tính công suất trên trục công tác
  private calc_p(F: number, v: number): number {
    return (F * v) / 1000;
  }

  // Tính công suất tương đương
  private calc_p_td(T1: number, t1: number, T2: number, t2: number): number {
    return this._p * Math.sqrt((T1 ** 2 * t1 + T2 ** 2 * t2) / (t1 + t2));
  }

  private calc_n_lv(v: number, z: number, p: number): number {
    return (60000 * v) / (z * p);
  }

  private calc_u_t_predict(ratio: IRatio[]): number {
    return ratio.reduce((acc, ratio) => acc * ratio.value, 1);
  }

  // Return công suất cần thiết
  get p_ct() {
    return this._p_ct;
  }

  // Return công suất tương đương
  get p_td() {
    return this._p_td;
  }

  // Return công suất trên trục công tác
  get p() {
    return this._p;
  }

  // Return Số vòng quay sơ bộ của động cơ
  get n_lv() {
    return this._n_lv;
  }

  // Return Số vòng quay sơ bộ của động cơ
  get n_sb() {
    return this._n_sb;
  }
}

export class SelectedEngine {
  // Vì chưa biết có tính toán gì sau không nên sẽ dùng class thay vì interface
  constructor(
    public name: string, // Kiểu động cơ
    public power: number, // Công suất theo nhà sản xuất
    public n_t: number, // Vận tốc quay vg/phút
    public H: number, // cosp: Hệ số công suất của động cơ
    public GD_2: number, // Momen quán tính của động cơ
    public T_max_T_dn: number, // Hệ số momen cực đại chia cho momen định mức
    public T_k_T_dn: number, // Tỷ số momen khởi động và momen định mức
    public weight: number // Khối lượng
  ) {}
}

// Fix hiệu suất thành mảng
export interface IEfficieny {
  type: string;
  value: number;
}

export class Efficiency {
  // private _n_ol: number; // Hiệu suất một cặp ổ lăn
  // private _n_tv: number; // Hiệu suất của bộ truyền trục vít
  // private _n_brt: number; // Hiệu suất của bộ truyền đai
  // private _n_belt: number; // Hiệu suất của bộ truyền đai
  // private _n_kn: number; // Hiệu suất của khớp nối
  // constructor(
  //   n_ol: number,
  //   n_tv: number,
  //   n_brt: number,
  //   n_belt: number,
  //   n_kn: number
  // ) {
  //   this._n_ol = n_ol;
  //   this._n_tv = n_tv;
  //   this._n_brt = n_brt;
  //   this._n_belt = n_belt;
  //   this._n_kn = n_kn;
  //   // this._n_system = n_ol ** 4 * n_tv * n_brt * n_belt * n_kn;
  //   this._n_system = 0; // FIXME
  // }
  private _n_parts: [IEfficieny, number][]; // Hiệu suất của chi tiết và số lượng chi tiết sử dụng
  private _n_system: number; // Hiệu suất truyền động của hệ thống

  constructor(n_parts: [IEfficieny, number][]) {
    this._n_parts = n_parts;
    this._n_system = n_parts.reduce((acc, n) => acc * n[0].value, 1);
  }

  get n_system() {
    return this._n_system;
  }

  get n_parts_spec() {
    return this._n_parts.map((p) => p[0]);
  }

  get n_parts_full() {
    return this._n_parts;
  }
}

// FIXME TransRatio
// export class TransRatio {
//   private _u_t: number; // Tỷ số truyền của hệ dẫn động
//   private _u_d: number; // Tỷ số truyền của đai
//   private _u_brt: number; // Tỷ số truyền của bánh răng trụ
//   private _u_tv: number; // Tỷ số truyền của trục vít
//   private _u_ng: number; // Tỷ số truyền ngoài hộp
//   private _u_h: number; // Tỷ số truyền trong hộp
//   private _u_kn: number; // Tỷ số truyền khớp nối

//   constructor(u_d: number, u_tv: number, u_brt: number, u_kn: number) {
//     this._u_d = u_d;
//     this._u_tv = u_tv;
//     this._u_brt = u_brt;
//     this._u_kn = u_kn;
//     this._u_t = u_d * u_tv * u_brt * u_kn;
//     this._u_ng = this._u_d;
//     this._u_h = this._u_t / this._u_ng;
//   }

//   // Getter và Setter của u_t ////////////////////////
//   get u_t(): number {
//     return this._u_t;
//   }
//   set u_t(value: number) {
//     this._u_t = value;
//     this.u_h = this._u_t / this._u_ng;
//   }

//   // Getter và Setter của u_d
//   get u_d(): number {
//     return this._u_d;
//   }
//   set u_d(value: number) {
//     this._u_d = value;
//     this._u_ng = this._u_d;
//   }

//   // Getter và Setter của u_brt
//   get u_brt(): number {
//     return this._u_brt;
//   }
//   set u_brt(value: number) {
//     this._u_brt = value;
//   }

//   // Getter và Setter của u_tv
//   get u_tv(): number {
//     return this._u_tv;
//   }
//   set u_tv(value: number) {
//     this._u_tv = value;
//     this.u_brt = this._u_h / this._u_tv;
//   }

//   // Getter và Setter của u_h ////////////////////////
//   get u_h(): number {
//     return this._u_h;
//   }
//   set u_h(value: number) {
//     this._u_h = value;
//     const tan_gamma = 0.2;

//     // Giải u_tv theo thuật toán Newton-Raphson
//     const f = (u_tv: number) =>
//       math.evaluate(
//         `8 - (${tan_gamma}^2 * ${this._u_h}^2 * (1 + (${this._u_h}/x))) / (x * ${tan_gamma} + 1)^3`,
//         { x: u_tv }
//       );

//     const fPrime = (u_tv: number) =>
//       math
//         .derivative(
//           `8 - (${tan_gamma}^2 * ${this._u_h}^2 * (1 + (${this._u_h}/x))) / (x * ${tan_gamma} + 1)^3`,
//           "x"
//         )
//         .evaluate({ x: u_tv });

//     let x = 1;
//     for (let i = 0; i < 10; i++) {
//       x = x - f(x) / fPrime(x);
//       if (Math.abs(f(x)) < 1e-6) break;
//     }

//     this.u_tv = x;
//   }

//   // Getter và Setter của u_kn
//   get u_kn(): number {
//     return this._u_kn;
//   }
//   set u_kn(value: number) {
//     this._u_kn = value;
//   }
// }
export interface IRatio {
  type: string;
  value: number;
}

export class TransRatio {
  private _ratio_comp: IRatio[]; // Tỷ số truyền các chi tiết
  private _u_t: number; // Tỷ số truyền của hệ dẫn động
  private _u_ng: number; // Tỷ số truyền ngoài hộp
  private _u_h: number; // Tỷ số truyền trong hộp

  constructor(ratio: IRatio[]) {
    this._ratio_comp = ratio;
    this._u_t = ratio.reduce((acc, ratio) => acc * ratio.value, 1);
    this._u_ng =
      ratio.find((ratio) => ratio.type === "u_d" || ratio.type === "u_x")
        ?.value ?? 1; // Dựa theo thiết kế
    this._u_h = this._u_t / this._u_ng;
  }

  get ratio_comp() {
    return this._ratio_comp;
  }
  // Getter
  get_ratio(type: string) {
    return this._ratio_comp.find((ratio) => ratio.type === type)?.value;
  }

  get u_h(): number {
    return this._u_h;
  }

  get u_ng(): number {
    return this._u_ng;
  }

  get u_t(): number {
    return this._u_t;
  }

  // Hàm set ratio cho các loại chi tiết
  private set_ratio(type: string, value: number) {
    this._ratio_comp.map((ratio) => {
      if (ratio.type === type) return (ratio.value = value);
    });
  }

  // Setter của u_t
  set u_t(value: number) {
    this._u_t = value;
    this.u_h = this._u_t / this._u_ng;
  }

  // Setter của u_h
  set u_h(value: number) {
    this._u_h = value;
    const tan_gamma = 0.2;
    this.u_tv = CalcU_tv(this._u_h, tan_gamma);
  }

  // Setter của u_d
  set u_d(value: number) {
    this.set_ratio("u_d", value);
    this._u_ng = value;
  }

  // Setter của u_brt
  set u_brt(value: number) {
    this.set_ratio("u_brt", value);
  }

  // Setter của u_tv
  set u_tv(value: number) {
    // this._u_tv = value;
    // this.u_brt = this._u_h / this._u_tv;
    this._ratio_comp.map((ratio) => {
      if (ratio.type === "u_tv") return (ratio.value = value);
      // Nếu u_tv thay đổi thì u_brt thay đổi theo u_brt = u_h / u_tv
      if (ratio.type === "u_brt") {
        return (ratio.value = this.u_h / value);
      }
    });
  }

  // Setter của u_kn
  set u_kn(value: number) {
    this.set_ratio("u_kn", value);
  }
}

export default class EngineFactory {
  static createCalculatedEngine(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    z: number, // Số răng đĩa xích tải dẫn (răng) (đề)
    p: number, // Bước xích tải (mm) (đề)
    L: number, // Thời gian phục vụ (năm) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)
    efficiency_system: number, // Hiệu suất truyền (chọn)
    select_ratio: IRatio[] // Tỷ số truyền (chọn)
  ): CalculatedEngine {
    return new CalculatedEngine(
      F,
      v,
      z,
      p,
      L,
      T1,
      t1,
      T2,
      t2,
      efficiency_system,
      select_ratio
    );
  }

  static createSelectedEngine(
    name: string,
    power: number,
    rpm: number,
    H: number,
    GD_2: number,
    T_max_T_dn: number,
    T_k_T_dn: number,
    weight: number,
    T_mm_T: number // Tỷ số của momen mở máy
  ): SelectedEngine | null {
    // Kiểm tra điều kiện mở máy
    if (T_mm_T <= T_k_T_dn)
      return new SelectedEngine(
        name,
        power,
        rpm,
        H,
        GD_2,
        T_max_T_dn,
        T_k_T_dn,
        weight
      );
    else return null;
  }

  static recalcTransRatio(
    calc_engi: CalculatedEngine,
    sele_engi: SelectedEngine,
    cur_ratio: TransRatio
  ): TransRatio | null {
    // Sau khi gán u_t mới thì các thông số khác sẽ tự động cập nhật
    cur_ratio.u_t = sele_engi.n_t / calc_engi.n_lv;
    // Kiểm tra lại
    let delta_check =
      cur_ratio.u_t -
      cur_ratio.ratio_comp.reduce((acc, ratio) => acc * ratio.value, 1);
    if (-0.5 < delta_check && delta_check < 0.5) return cur_ratio;
    else return null;
  }
}
