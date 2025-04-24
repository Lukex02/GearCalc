export default class CalculatedChain {
  private _z1: number; // Số răng đĩa nhỏ
  private _z2: number; // Số răng đĩa lớn
  private _p!: number; // Bước xích
  private _k_0: number;
  private _k_a: number;
  private _k_dc: number;
  private _k_bt: number;
  private _k_d: number;
  private _k_c: number;
  private _k: number; // Hệ số điều kiện sử dụng xích
  private _k_z: number; // Hệ số răng đĩa xích
  private _k_n: number; // Hệ số vòng quay
  private _P_t: number;
  private _shaftStats!: {
    P: number;
    u_x: number;
    n: number;
  };
  private _a!: number;
  private _x_c!: number; // Số măt xích chẵn
  private _i!: number; // Số lần va đập của bản lề xích trong 1 giây
  private _s!: number; // Hệ số an toàn

  private _d1!: number; // Đường kính vòng chia đĩa xích dẫn
  private _d2!: number; // Đường kính vòng chia đĩa xích bị dẫn
  private _d_a1!: number; // Đường kính vòng đỉnh răng đĩa xích dẫn
  private _d_a2!: number; // Đường kính vòng chân răng đĩa xích dẫn
  private _d_f1!: number; // Đường kính vòng đỉnh răng đĩa xích bị dẫn
  private _d_f2!: number; // Đường kính vòng chân răng đĩa xích bị dẫn
  private _d_l!: number;
  private _d_c!: number;
  private _r!: number;
  private _A!: number;
  private _B!: number;

  private _F_t!: number; // Lực vòng
  private _F_0!: number;
  private _F_v!: number;
  private _sigma_H!: number;
  private _F_rx!: number;

  // Input là tỷ số truyền trên trục
  public constructor(
    P: number,
    u_x: number,
    n: number,
    k_0: number,
    k_a: number,
    k_dc: number,
    k_bt: number,
    k_d: number,
    k_c: number
  ) {
    this._z1 = this.calc_small_gear_teeth(u_x);
    this._z2 = this.calc_big_gear_teeth(u_x);
    // this._k = k; // k_0 * k_a * k_đc * k_đ * k_c * k_bt
    this._k_0 = k_0;
    this._k_a = k_a;
    this._k_dc = k_dc;
    this._k_bt = k_bt;
    this._k_d = k_d;
    this._k_c = k_c;
    this._k = k_0 * k_a * k_dc * k_d * k_c * k_bt;
    this._k_z = 25 / this._z1;
    this._k_n = 50 / n; // Will always default n_01 = 50 rpm
    this._P_t = P * this._k * this._k_z * this._k_n; // P_max = P * k * k_z * k_n
    this._shaftStats = { P: P, u_x: u_x, n: n };
  }

  private calc_small_gear_teeth(u_x: number) {
    const res = 29 - 2 * u_x; // Làm tròn
    const rounded = Math.round(res);
    if (res >= 19) {
      if (res % 2 == 1) return res;
      else {
        const lowerOdd = rounded - 1;
        const higherOdd = rounded + 1;
        return Math.abs(res - lowerOdd) <= Math.abs(res - higherOdd) ? lowerOdd : higherOdd;
      }
    } else throw new Error("Số răng đĩa nhỏ không hợp lệ");
  }
  private calc_big_gear_teeth(u_x: number) {
    const res = this._z1 * u_x; // Làm tròn
    const rounded = Math.round(res);
    if (res >= 19) {
      if (rounded % 2 == 1) return rounded;
      else {
        const lowerOdd = rounded - 1;
        const higherOdd = rounded + 1;
        return Math.abs(res - lowerOdd) <= Math.abs(res - higherOdd) ? lowerOdd : higherOdd;
      }
    } else throw new Error("Số răng đĩa lớn không hợp lệ");
  }
  calc_after_choose(selectedChain: SelectedChain) {
    this._d_l = selectedChain.d_l;
    this._d_c = selectedChain.d_c;
    this._A = selectedChain.A;
    this._B = selectedChain.B;
    this._p = selectedChain.Step_p;
    this._a = this._p * 40; // Chọn luôn a = 40, đã tạm khóa select khoảng a là 30 tới 50
    const x =
      (2 * this._a) / this._p +
      (this._z1 + this._z2) / 2 +
      ((this._z2 - this._z1) ** 2 * this._p) / (4 * this._a * Math.PI ** 2);
    const rounded_x = Math.floor(x);
    if (rounded_x % 2 == 0) this._x_c = rounded_x;
    else {
      this._x_c = rounded_x - 1; // Làm tròn xuống số chẵn
    }
    const a_recalc =
      0.25 *
      this._p *
      (this._x_c -
        0.5 * (this._z1 + this._z2) +
        Math.sqrt(
          (this._x_c - 0.5 * (this._z1 + this._z2)) ** 2 - 2 * ((this._z2 - this._z1) / Math.PI) ** 2
        ));
    const delta_a = 0.002 * a_recalc;
    this._a = Math.round((a_recalc - delta_a) / 10) * 10;
    this._i = (this._z1 * this._shaftStats.n) / (15 * this._x_c);
    if (this._p == 38.1 && this._i > 20) throw new Error("Số lần va đập vượt mức"); // Làm 1 trường hợp này tạm thời

    const v = (this._z1 * this._p * this._shaftStats.n) / 60000;
    this._F_t = (1000 * this._shaftStats.P) / v;
    this._F_0 = (9.81 * 6 * selectedChain.q_p * this._a) / 1000; // Lấy cứng k_f là 6 với bộ truyền nằm ngang
    this._F_v = selectedChain.q_p * v ** 2;
    this._s = (selectedChain.Q * 1000) / (this._k_d * this._F_t + this._F_0 + this._F_v);
    if (this._shaftStats.n <= 50) {
      if (this._s < 7) {
        throw new Error("Bộ truyền xích không an toàn");
      }
    } else if (this._shaftStats.n <= 200) {
      if ((this._p == 12.7 || this._p == 15.875) && this._s < 7.8) {
        throw new Error("Bộ truyền xích không an toàn");
      }
      if ((this._p == 19.05 || this._p == 25.4) && this._s < 8.2) {
        throw new Error("Bộ truyền xích không an toàn");
      }
      if ((this._p == 31.75 || this._p == 38.1) && this._s < 8.5) {
        throw new Error("Bộ truyền xích không an toàn");
      }
      if ((this._p == 44.45 || this._p == 50.8) && this._s < 9.3) {
        throw new Error("Bộ truyền xích không an toàn");
      }
    }
    if (this._shaftStats.n > 200) throw new Error("Bộ truyền xích không an toàn"); // Không cần xét đến trường hợp n > 200
  }

  calcSprocket() {
    this._d1 = this._p / Math.sin(Math.PI / this._z1);
    this._d2 = this._p / Math.sin(Math.PI / this._z2);
    this._d_a1 = this._p * (0.5 + 1 / Math.tan(Math.PI / this._z1));
    this._d_a2 = this._p * (0.5 + 1 / Math.tan(Math.PI / this._z2));
    this._r = 0.5025 * this._d_l + 0.05;
    this._d_f1 = this._d1 - 2 * this._r;
    this._d_f2 = this._d2 - 2 * this._r;

    const E = (2 * (210 * 10 ** 9) * (124 * 10 ** 9)) / (210 * 10 ** 9 + 124 * 10 ** 9);
    const F_vd = 13 * 10 ** -7 * this._shaftStats.n * this._p * 1;
    let k_r = 0;
    if (this._z1 >= 15 && this._z1 < 20)
      k_r = 0.59 - Math.floor(((0.59 - 0.48) / (this._z1 % 5)) * 100) / 100;
    if (this._z1 >= 20 && this._z1 < 30)
      k_r = 0.48 - Math.floor(((0.48 - 0.36) / (this._z1 % 10)) * 100) / 100;
    if (this._z1 >= 30 && this._z1 < 40)
      k_r = 0.36 - Math.floor(((0.36 - 0.29) / (this._z1 % 10)) * 100) / 100;
    if (this._z1 >= 40 && this._z1 < 50)
      k_r = 0.29 - Math.floor(((0.29 - 0.24) / (this._z1 % 10)) * 100) / 100;
    if (this._z1 >= 50 && this._z1 < 60)
      k_r = 0.24 - Math.floor(((0.24 - 0.22) / (this._z1 % 10)) * 100) / 100;
    // console.log(k_r);
    this._sigma_H = (0.47 * Math.sqrt((k_r * (this._F_t * this._k_d + F_vd) * E) / (this._A * 1))) / 1000; // Mặc định cho xích con lăn 1 dãy
    this._F_rx = 1.15 * this._F_t;
  }

  get P_t() {
    return this._P_t;
  }

  getChainPostStats() {
    return {
      z1: this._z1, // Số bánh răng dẫn
      z2: this._z2, // Số bánh răng bị dẫn
      p: this._p, // Bước xích
      B: this._B, // Chiều dài ống lót
      d_c: this._d_c, // Đường kính chốt
      x: this._x_c, // Số mắt xích
      a: this._a, // Khoảng cách trục
      d1: this._d1, // Đường kính vòng chia đĩa xích dẫn
      d2: this._d2, // Đường kính vòng chia đĩa bị dẫn
      F_rx: this._F_rx, // Lực tác dụng lên đĩa xích
    };
  }
}

export class SelectedChain {
  constructor(
    public CHAIN_ID: string, // ID động cơ
    public Step_p: number, // Bước xích
    public d_c: number, // Đường kính chốt
    public d_l: number,
    public B: number, // Chiều dài ống lót
    public P_max: number, // Hệ số điều kiện sử dụng xích
    public Q: number, // Tải trọng pha hỏng
    public q_p: number, // Khối lượng 1 mét xích
    public A: number // Diện tích chiếu của bản lề
  ) {}
}
