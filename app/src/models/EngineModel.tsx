export class CalculatedEngine {
  private p: number; // Công suất trên trục công tác
  private p_td: number; // Công suất tương đương
  private p_ct: number; // Công suất cần thiết
  private n_sb: number; // Số vòng quay sơ bộ của động cơ

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
    efficiency_system: number
  ) {
    this.p = this.calc_p(F, v);
    this.p_td = this.calc_p_td(T1, t1, T2, t2);
    this.n_sb = this.calc_n_lv(v, z, p) * this.calc_u_t(3, 10, 3, 1);
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

  private calc_u_t(
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
  get_n_sb() {
    return this.n_sb;
  }
}

export class SelectedEngine {
  constructor(
    public name: string, // Kiểu động cơ
    public power: number, // Công suất theo nhà sản xuất
    public rpm: number, // Vận tốc quay vg/phút
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
    efficiency_system: number
  ): CalculatedEngine | null {
    // Check the condition first before return
    // if....

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
      efficiency_system
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
}
