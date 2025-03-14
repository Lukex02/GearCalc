import { create, all } from "mathjs";
const math = create(all);

export class CalculatedEngine {
  private p: number; // Công suất trên trục công tác
  private p_td: number; // Công suất tương đương
  private p_ct: number; // Công suất cần thiết
  private n_sb: number; // Số vòng quay sơ bộ của động cơ
  private n_lv: number; // Số vòng quay của trục máy công tác
  // public u_d = 3;
  // public u_lv = 10;
  // public u_brt = 3;
  // public u_kn = 1;

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
    ratio: TransRatio
  ) {
    this.p = this.calc_p(F, v);
    this.p_td = this.calc_p_td(T1, t1, T2, t2);
    this.n_lv = this.calc_n_lv(v, z, p);
    this.n_sb =
      this.n_lv *
      this.calc_u_t_predict(ratio.u_d, ratio.u_tv, ratio.u_brt, ratio.u_kn);
    this.p_ct = this.p_td / efficiency_system;
  }

  // Tính công suất trên trục công tác
  private calc_p(F: number, v: number): number {
    return (F * v) / 1000;
  }

  // Tính công suất tương đương
  private calc_p_td(T1: number, t1: number, T2: number, t2: number): number {
    return this.p * Math.sqrt((T1 ** 2 * t1 + T2 ** 2 * t2) / (t1 + t2));
  }

  private calc_n_lv(v: number, z: number, p: number): number {
    return (60000 * v) / (z * p);
  }

  private calc_u_t_predict(
    u_d: number,
    u_tv: number,
    u_brt: number,
    u_kn: number
  ): number {
    return u_d * u_tv * u_brt * u_kn;
  }

  // Return công suất cần thiết
  get_p_ct() {
    return this.p_ct;
  }

  // Return công suất tương đương
  get_p_td() {
    return this.p_td;
  }

  // Return công suất trên trục công tác
  get_p() {
    return this.p;
  }

  // Return Số vòng quay sơ bộ của động cơ
  get_n_lv() {
    return this.n_lv;
  }

  // Return Số vòng quay sơ bộ của động cơ
  get_n_sb() {
    return this.n_sb;
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

export class Efficiency {
  public effi_ol: number; // Hiệu suất một cặp ổ lăn
  public effi_tv: number; // Hiệu suất của bộ truyền trục vít
  public effi_brt: number; // Hiệu suất của bộ truyền đai
  public effi_belt: number; // Hiệu suất của bộ truyền đai
  public effi_kn: number; // Hiệu suất của khớp nối
  private effi_system: number; // Hiệu suất truyền động của hệ thống

  constructor(
    effi_ol: number,
    effi_tv: number,
    effi_brt: number,
    effi_belt: number,
    effi_kn: number
  ) {
    this.effi_ol = effi_ol;
    this.effi_tv = effi_tv;
    this.effi_brt = effi_brt;
    this.effi_belt = effi_belt;
    this.effi_kn = effi_kn;
    this.effi_system = effi_ol ** 4 * effi_tv * effi_brt * effi_belt * effi_kn;
  }

  get_effi_system() {
    return this.effi_system;
  }
}

export class TransRatio {
  private _u_t: number; // Tỷ số truyền của hệ dẫn động
  private _u_d: number; // Tỷ số truyền của đai
  private _u_brt: number; // Tỷ số truyền của bánh răng trụ
  private _u_tv: number; // Tỷ số truyền của trục vít
  private _u_ng: number; // Tỷ số truyền ngoài hộp
  private _u_h: number; // Tỷ số truyền trong hộp
  private _u_kn: number; // Tỷ số truyền khớp nối

  constructor(u_d: number, u_tv: number, u_brt: number, u_kn: number) {
    this._u_d = u_d;
    this._u_tv = u_tv;
    this._u_brt = u_brt;
    this._u_kn = u_kn;
    this._u_t = u_d * u_tv * u_brt * u_kn;
    this._u_ng = this._u_d;
    this._u_h = this._u_t / this._u_ng;
  }

  // Getter và Setter của u_t ////////////////////////
  get u_t(): number {
    return this._u_t;
  }
  set u_t(value: number) {
    this._u_t = value;
    this.u_h = this._u_t / this._u_ng;
  }

  // Getter và Setter của u_d
  get u_d(): number {
    return this._u_d;
  }
  set u_d(value: number) {
    this._u_d = value;
    this._u_ng = this._u_d;
  }

  // Getter và Setter của u_brt
  get u_brt(): number {
    return this._u_brt;
  }
  set u_brt(value: number) {
    this._u_brt = value;
  }

  // Getter và Setter của u_tv
  get u_tv(): number {
    return this._u_tv;
  }
  set u_tv(value: number) {
    this._u_tv = value;
    this.u_brt = this._u_h / this._u_tv;
  }

  // Getter và Setter của u_h ////////////////////////
  get u_h(): number {
    return this._u_h;
  }
  set u_h(value: number) {
    this._u_h = value;
    const tan_gamma = 0.2;

    // Giải u_tv theo thuật toán Newton-Raphson
    const f = (u_tv: number) =>
      math.evaluate(
        `8 - (${tan_gamma}^2 * ${this._u_h}^2 * (1 + (${this._u_h}/x))) / (x * ${tan_gamma} + 1)^3`,
        { x: u_tv }
      );

    const fPrime = (u_tv: number) =>
      math
        .derivative(
          `8 - (${tan_gamma}^2 * ${this._u_h}^2 * (1 + (${this._u_h}/x))) / (x * ${tan_gamma} + 1)^3`,
          "x"
        )
        .evaluate({ x: u_tv });

    let x = 1;
    for (let i = 0; i < 10; i++) {
      x = x - f(x) / fPrime(x);
      if (Math.abs(f(x)) < 1e-6) break;
    }

    this.u_tv = x;
  }

  // Getter và Setter của u_kn
  get u_kn(): number {
    return this._u_kn;
  }
  set u_kn(value: number) {
    this._u_kn = value;
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
    efficiency_system: number,
    ratio: TransRatio
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
      ratio
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
    // Sau khi gán u_t mới thì các thông số khác sẽ tự 9dộng cập nhật
    cur_ratio.u_t = sele_engi.n_t / calc_engi.get_n_lv();
    // Kiểm tra lại
    let delta_check =
      cur_ratio.u_tv * cur_ratio.u_brt * cur_ratio.u_d - cur_ratio.u_t;
    if (-0.5 < delta_check && delta_check < 0.5) return cur_ratio;
    else return null;
  }
}
