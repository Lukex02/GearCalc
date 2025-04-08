const psi_bdValues = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6];
const a_wValues = [40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400];
const mValues = [1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 12];
// Mỗi hàng là tương ứng với psi_bd = 0.2, 0.4, ...
// Mỗi cột là sơ đồ 1 đến 7 (chỉ số mảng: 0 đến 6)
const K_HBetaTable: number[][] = [
  [1.08, 1.05, 1.02, 1.01, 1.01, 1.0, 1.0], // ψ_bd = 0.2
  [1.18, 1.12, 1.05, 1.03, 1.02, 1.01, 1.01], // ψ_bd = 0.4
  [1.31, 1.19, 1.07, 1.05, 1.03, 1.02, 1.02], // ψ_bd = 0.6
  [1.45, 1.27, 1.12, 1.08, 1.05, 1.03, 1.02], // ψ_bd = 0.8
  [0, 1.27, 1.15, 1.1, 1.07, 1.04, 1.03], // ψ_bd = 1.0
  [0, 0, 1.13, 1.11, 1.06, 1.04, 1.03], // ψ_bd = 1.2
  [0, 0, 1.17, 1.13, 1.09, 1.05, 1.04], // ψ_bd = 1.4
  [0, 0, 1.28, 1.21, 1.16, 1.1, 1.05], // ψ_bd = 1.6
];

export class CalculatedGear {
  // Dựa trên thiết kế, ta chỉ có thể chọn 1 loại vật liệu là Thép 40X - Tôi cải thiện
  private _sigma_b: number;
  private _sigma_ch: number;
  private _HB: number;
  private _S_max: number;
  private _S_H: number = 1.1; // Hệ số an toàn khi tính về tiếp xúc
  private _S_F: number = 1.75; // Hệ số an toàn khi tính về uốn
  private _K_FC: number = 1; // Hệ số xét đến ảnh hưởng đặt tải (Hard code khi đặt tải 1 phía, bộ truyền quay 1 chiều)
  private _sigma_H_lim: number; // Giới hạn mỏi tiếp xúc tương ứng với chu kỳ cơ sở (ứng suất tiếp xúc)
  private _sigma_F_lim: number; // Giới hạn mỏi tiếp xúc tương ứng với chu kỳ cơ sở (ứng suất tiếp xúc)
  private _sigma_H_allow!: number; // Ứng suất tiếp xúc cho phép
  private _sigma_F_allow!: number; // Ứng suất uốn cho phép
  private _N_HO: number; // Số chu kỳ ứng suất khi thử về độ bền tiếp xúc
  private _N_FO: number; // Số chu kỳ ứng suất khi thử về độ bền uốn
  private _m_H: number = 6; // Bậc của đường cong mỏi khi thử về độ bền tiếp xúc
  private _m_F: number = 6; // Bậc của đường cong mỏi khi thử về độ bền uốn
  private _K_HL!: number; // Hệ số tuổi thọ xét đến ảnh hưởng của thời hạn phục vụ và chế độ tải
  private _K_FL!: number; // Hệ số tuổi thọ xét đến ảnh hưởng của thời hạn phục vụ và chế độ tải
  private _N_HE!: number; // Số chu kỳ thay đổi ứng suất tương đương
  private _N_FE!: number; // Số chu kỳ thay đổi ứng suất tương đương

  constructor(sigma_b: number, sigma_ch: number, HB: number, S_max: number) {
    this._sigma_b = sigma_b;
    this._sigma_ch = sigma_ch;
    this._HB = HB;
    this._S_max = S_max;
    this._sigma_H_lim = 2 * this._HB + 70;
    this._sigma_F_lim = 1.8 * this._HB;

    this._N_HO = 30 * this._HB;
    this._N_FO = 4 * 10 ** 6;
  }

  calcSigma_H_allow(
    u: number,
    n: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L_h: number,
    isSmall: 0 | 1 // Bánh nhỏ thì có chia u, bánh lớn thì không
  ) {
    this._N_HE = 60 * 1 * (n / u ** isSmall) * L_h * ((T1 ** 3 * t1) / 60 + (T2 ** 3 * t2) / 60);
    if (this._N_HE > this._N_HO) {
      this._K_HL = 1;
    } else {
      this._K_HL = Math.pow(this._N_HO / this._N_HE, 1 / this._m_H);
    }
    this._sigma_H_allow = (this._sigma_H_lim * this._K_HL) / this._S_H;
  }

  calcSigma_F_allow(
    u: number,
    n: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L_h: number,
    isSmall: 0 | 1 // Bánh nhỏ thì có chia u, bánh lớn thì không
  ) {
    this._N_FE =
      60 * 1 * (n / u ** isSmall) * L_h * ((T1 ** this._m_F * t1) / 60 + (T2 ** this._m_F * t2) / 60);
    if (this._N_FE > this._N_FO) {
      this._K_FL = 1;
    } else {
      this._K_FL = Math.pow(this._N_FO / this._N_FE, 1 / this._m_F);
    }
    this._sigma_F_allow = (this._sigma_F_lim * this._K_FL * this._K_FC) / this._S_F;
  }
  get sigma_H_allow(): number {
    return this._sigma_H_allow;
  }
  get sigma_F_allow(): number {
    return this._sigma_F_allow;
  }
  get sigma_ch(): number {
    return this._sigma_ch;
  }
}

export default class GearSet {
  private _gear_small: CalculatedGear;
  private _gear_big: CalculatedGear;
  private _sigma_H_allow: number; // Ứng suất tiếp xúc cho phép
  private _sigma_H_allow_max: number; // Ứng suất tiếp xúc cho phép quá tải
  private _sigma_F1_allow_max: number; // Ứng suất uốn cho phép quá tải
  private _sigma_F2_allow_max: number; // Ứng suất uốn cho phép quá tải
  private _psi_ba: number = 0.315; // Chọn mặc định
  private _K_a: number = 43; // Chọn mặc định thoe loại răng nghiêng và chữ V, thép - thép
  private _Z_M: number = 274; // Chọn mặc định theo thép - thép
  private _K_Hbeta: number;
  private _soDo: number; // Vị trí trong sơ đồ
  private _a_w_calc: number; // Khoảng cách trục tính lý thuyết
  private _a_w: number; // Khoảng cách trục chọn theo chuẩn
  private _m: number = 1; // Module
  private _Beta_angle: number = 10; // góc Beta, chọn sơ bộ 10 trong khoảng 8..20 độ
  private _cosBeta: number = Math.cos((Math.PI / 180) * this._Beta_angle); // cosBeta, khởi tạo sơ bộ
  private _z1: number; // Số răng bánh nhỏ
  private _z2: number; // Số răng bánh lớn

  constructor(
    sigma_b: number,
    sigma_ch: number,
    HB: number,
    S_max: number,
    shaftStats: {
      u: number;
      n: number;
      T1: number;
    },
    desStats: {
      T1: number;
      t1: number;
      T2: number;
      t2: number;
      L_h: number;
    },
    fast: boolean
  ) {
    this._gear_small = new CalculatedGear(sigma_b, sigma_ch, HB, S_max);
    this._gear_big = new CalculatedGear(sigma_b, sigma_ch, HB, S_max);
    this._gear_small.calcSigma_H_allow(
      shaftStats.u,
      shaftStats.n,
      desStats.T1,
      desStats.t1,
      desStats.T2,
      desStats.t2,
      desStats.L_h,
      1
    );
    this._gear_small.calcSigma_F_allow(
      shaftStats.u,
      shaftStats.n,
      desStats.T1,
      desStats.t1,
      desStats.T2,
      desStats.t2,
      desStats.L_h,
      1
    );
    this._gear_big.calcSigma_H_allow(
      shaftStats.u,
      shaftStats.n,
      desStats.T1,
      desStats.t1,
      desStats.T2,
      desStats.t2,
      desStats.L_h,
      0
    );
    this._gear_big.calcSigma_F_allow(
      shaftStats.u,
      shaftStats.n,
      desStats.T1,
      desStats.t1,
      desStats.T2,
      desStats.t2,
      desStats.L_h,
      0
    );
    this._sigma_H_allow = (this._gear_small.sigma_H_allow + this._gear_big.sigma_H_allow) / 2;
    if (this._sigma_H_allow > 1.25 * Math.min(this._gear_small.sigma_H_allow, this._gear_big.sigma_H_allow)) {
      throw new Error("Bánh răng không đạt yêu cầu về độ bền tiếp xúc");
    }
    this._sigma_H_allow_max = 2.8 * this._gear_big.sigma_ch;
    this._sigma_F1_allow_max = 0.8 * this._gear_small.sigma_ch;
    this._sigma_F2_allow_max = 0.8 * this._gear_big.sigma_ch;

    // Lấy mặc định là u + 1 do bánh răng ăn khớp ngoài
    if (fast) this._soDo = 3;
    else this._soDo = 5;
    let psi_bd = Math.floor(0.53 * this._psi_ba * (shaftStats.u + 1));
    if (psi_bd % 2 == 0) psi_bd += 1;
    const psiIndex = psi_bdValues.indexOf(psi_bd);
    this._K_Hbeta = K_HBetaTable[psiIndex][this._soDo];

    this._a_w_calc =
      this._K_a *
      (shaftStats.u + 1) *
      Math.pow(
        (shaftStats.T1 * this._K_Hbeta) / (this._sigma_H_allow ** 2 * shaftStats.u * this._psi_ba),
        1 / 3
      );
    this._a_w = a_wValues.reduce((prev, curr) =>
      Math.abs(curr - this._a_w_calc) < Math.abs(prev - this._a_w_calc) ? curr : prev
    );
    const m_min = 0.01 * this._a_w;
    const m_max = 0.02 * this._a_w;
    for (let m in mValues) {
      if (mValues[m] >= m_min && mValues[m] <= m_max) {
        this._m = mValues[m];
        break;
      }
    }
    this._z1 = Math.floor((2 * this._a_w * this._cosBeta) / (this._m * (shaftStats.u + 1)));
    this._z2 = Math.floor(shaftStats.u * this._z1);
    const u_m1 = this._z2 / this._z1; // Tỉ số truyền thực
    // Tính lại góc beta
    this._cosBeta = (this._m * (this._z1 * this._z2)) / (2 * this._a_w);
    this._Beta_angle = Math.acos(this._cosBeta) * (180 / Math.PI);

    const sigma_H = this._Z_M;
  }

  get sigma_H_allow_max(): number {
    return this._sigma_H_allow_max;
  }
  get sigma_F1_allow_max(): number {
    return this._sigma_F1_allow_max;
  }
  get sigma_F2_allow_max(): number {
    return this._sigma_F2_allow_max;
  }
}
