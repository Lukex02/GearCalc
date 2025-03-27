import { IRatio } from "./GearRatio";

export class CalculatedEngine {
  private _p_lv: number; // Công suất trên trục công tác
  private _p_td: number; // Công suất tương đương
  private _p_ct: number; // Công suất cần thiết
  private _n_sb: number; // Số vòng quay sơ bộ của động cơ
  private _n_lv: number; // Số vòng quay của trục máy công tác
  private _T_mm: number; // Tỷ số của momen mở máy

  constructor(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    output_perimeter: number, // Chu vi của trục quay đầu ra (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)
    efficiency_system: number,
    select_ratio: IRatio[]
  ) {
    this._p_lv = this.calc_p(F, v);
    this._p_td = this.calc_p_td(T1, t1, T2, t2);
    this._n_lv = this.calc_n_lv(v, output_perimeter);
    this._n_sb = this._n_lv * this.calc_u_t_predict(select_ratio); // NEW
    this._p_ct = this._p_td / efficiency_system;
    this._T_mm = T1;
  }

  // Tính công suất trên trục công tác
  private calc_p(F: number, v: number): number {
    return (F * v) / 1000;
  }

  // Tính công suất tương đương
  private calc_p_td(T1: number, t1: number, T2: number, t2: number): number {
    return this._p_lv * Math.sqrt((T1 ** 2 * t1 + T2 ** 2 * t2) / (t1 + t2));
  }

  private calc_n_lv(v: number, output_perimeter: number): number {
    return (60000 * v) / output_perimeter;
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
  get p_lv() {
    return this._p_lv;
  }

  // Return Số vòng quay sơ bộ của động cơ
  get n_lv() {
    return this._n_lv;
  }

  // Return Số vòng quay sơ bộ của động cơ
  get n_sb() {
    return this._n_sb;
  }

  get T_mm() {
    return this._T_mm;
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

export default class EngineFactory {
  static createCalculatedEngine(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    output_perimeter: number, // Số răng đĩa xích tải dẫn (răng) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)
    efficiency_system: number, // Hiệu suất truyền (chọn)
    select_ratio: IRatio[] // Tỷ số truyền (chọn)
  ): CalculatedEngine {
    return new CalculatedEngine(F, v, output_perimeter, T1, t1, T2, t2, efficiency_system, select_ratio);
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
    if (T_mm_T <= T_k_T_dn) return new SelectedEngine(name, power, rpm, H, GD_2, T_max_T_dn, T_k_T_dn, weight);
    else return null;
  }
}
