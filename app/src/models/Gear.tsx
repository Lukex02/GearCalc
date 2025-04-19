import Utils from "../services/Utils";

const psi_bdValues = [0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6];
const a_wValues = [40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400];
const mValues = [1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 10, 12];
const z_vValues = [17, 20, 22, 25, 30, 40, 50, 60, 80, 100, 150];
const Y_FValues = [4.26, 4.08, 4, 3.9, 3.8, 3.7, 3.65, 3.62, 3.61, 3.6, 3.6];

// Mỗi hàng là tương ứng với psi_bd = 0.2, 0.4, ...
// Mỗi cột là sơ đồ 1 đến 7 (chỉ số mảng: 0 đến 6)
const K_HBetaTable: number[][] = [
  [1.08, 1.05, 1.02, 1.01, 1.01, 1.0, 1.0], // ψ_bd = 0.2
  [1.18, 1.12, 1.05, 1.03, 1.02, 1.01, 1.01], // ψ_bd = 0.4
  [1.31, 1.19, 1.07, 1.05, 1.03, 1.02, 1.02], // ψ_bd = 0.6
  [1.45, 1.27, 1.12, 1.08, 1.05, 1.03, 1.02], // ψ_bd = 0.8
  [0, 0, 1.15, 1.11, 1.07, 1.05, 1.03], // ψ_bd = 1.0
  [0, 0, 1.2, 1.13, 1.11, 1.06, 1.04], // ψ_bd = 1.2
  [0, 0, 1.24, 1.17, 1.13, 1.07, 1.05], // ψ_bd = 1.4
  [0, 0, 1.28, 1.21, 1.16, 1.11, 1.06], // ψ_bd = 1.6
];
const K_FBetaTable: number[][] = [
  [1.18, 1.1, 1.05, 1.03, 1.02, 1.01, 1.0], // ψ_bd = 0.2
  [1.38, 1.21, 1.11, 1.06, 1.05, 1.03, 1.01], // ψ_bd = 0.4
  [1.61, 1.39, 1.17, 1.12, 1.08, 1.05, 1.02], // ψ_bd = 0.6
  [1.95, 1.58, 1.24, 1.17, 1.12, 1.07, 1.03], // ψ_bd = 0.8
  [0, 0, 1.32, 1.23, 1.16, 1.1, 1.05], // ψ_bd = 1.0
  [0, 0, 1.41, 1.3, 1.22, 1.14, 1.08], // ψ_bd = 1.2
  [0, 0, 1.5, 1.38, 1.28, 1.19, 1.12], // ψ_bd = 1.4
  [0, 0, 1.6, 1.45, 1.37, 1.26, 1.15], // ψ_bd = 1.6
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
  private _K_Hbeta: number; // Hệ số kể đến sự phân bố không đều tải trọng trên chiều rộng vành răng
  private _K_Halpha!: number; // Hệ số kể đến sự phân bố không đều tải trọng cho các đôi răng đồng thời ăn khớp.
  private _K_Fbeta!: number; // hệ số kể đến sự phân bố không đều tải trọng trên chiều rộng vành răng khi tính về uốn
  private _K_Falpha!: number; // hệ số kể đến sự phân bố không đều tải trọng cho các đôi răng đồng thời ăn khớp khi tính về uốn
  private _soDo: number; // Vị trí trong sơ đồ
  private _a_w_calc: number; // Khoảng cách trục tính lý thuyết
  private _a_w: number; // Khoảng cách trục chọn theo chuẩn
  private _m: number = 1; // Module
  private _Beta_angle: number = 10; // góc Beta, chọn sơ bộ 10 trong khoảng 8..20 độ
  private _cosBeta: number = Math.cos((Math.PI / 180) * this._Beta_angle); // cosBeta, khởi tạo sơ bộ
  private _z1: number; // Số răng bánh nhỏ
  private _z2: number; // Số răng bánh lớn
  private _u_m: number; // Tỉ số truyền thực
  private _b_w: number; // Chiều rộng vành răng
  private _Z_H: number; // Hệ số xét đến ảnh hình dạng bề mặt tiếp xúc
  private _Z_epsi: number; // Hệ số kể đến sự trùng khớp của răng
  private _precision_level!: 6 | 7 | 8 | 9; // Cấp chính xác
  private _sigma_H!: number; // Ứng suất tiếp xúc
  private _sigma_F1!: number; // Ứng suất uốn 1
  private _sigma_F2!: number; // Ứng suất uốn 2

  private _d1!: number; // Đường kính vòng chia
  private _d2!: number;
  private _da1!: number; // Đường kính đỉnh răng
  private _da2!: number;
  private _df1!: number; // Đường kính đáy răng
  private _df2!: number;
  private _dw1!: number; // Đường kính lăn
  private _dw2!: number;
  private _x: number = 0; // Hệ số dịch chỉnh, cho mặc định là 0

  private _alpha_tw_rad!: number; // Góc nghiêng của răng trên hình trụ cơ sở (radian)

  constructor(
    sigma_b: [number, number],
    sigma_ch: [number, number],
    HB: [number, number],
    S_max: [number, number],
    distributedShaftStats: {
      u: number;
      n: number;
      T: number;
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
    this._gear_small = new CalculatedGear(sigma_b[0], sigma_ch[0], HB[0], S_max[0]);
    this._gear_big = new CalculatedGear(sigma_b[1], sigma_ch[1], HB[1], S_max[1]);
    // Tính sigma này là lấy sơ bộ Z_R * Z_v * K_xH = 1
    this._gear_small.calcSigma_H_allow(
      distributedShaftStats.u,
      distributedShaftStats.n,
      desStats.T1,
      desStats.t1,
      desStats.T2,
      desStats.t2,
      desStats.L_h,
      1
    );
    this._gear_small.calcSigma_F_allow(
      distributedShaftStats.u,
      distributedShaftStats.n,
      desStats.T1,
      desStats.t1,
      desStats.T2,
      desStats.t2,
      desStats.L_h,
      1
    );
    this._gear_big.calcSigma_H_allow(
      distributedShaftStats.u,
      distributedShaftStats.n,
      desStats.T1,
      desStats.t1,
      desStats.T2,
      desStats.t2,
      desStats.L_h,
      0
    );
    this._gear_big.calcSigma_F_allow(
      distributedShaftStats.u,
      distributedShaftStats.n,
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
    let psi_bd = Math.floor(0.53 * this._psi_ba * (distributedShaftStats.u + 1) * 10) / 10;
    if ((psi_bd * 10) % 2 !== 0) psi_bd = Math.round((psi_bd + 0.1) * 10) / 10;
    const psi_bdIndex = psi_bdValues.indexOf(psi_bd);
    this._K_Hbeta = K_HBetaTable[psi_bdIndex][this._soDo - 1];

    this._a_w_calc =
      this._K_a *
      (distributedShaftStats.u + 1) *
      Math.pow(
        (distributedShaftStats.T * this._K_Hbeta) /
          (this._sigma_H_allow ** 2 * distributedShaftStats.u * this._psi_ba),
        1 / 3
      );
    this._a_w = a_wValues.reduce((prev, curr) =>
      curr > this._a_w_calc && prev < this._a_w_calc ? curr : prev
    );
    const m_min = 0.01 * this._a_w;
    const m_max = 0.02 * this._a_w;
    for (let m in mValues) {
      if (mValues[m] >= m_min && mValues[m] <= m_max) {
        this._m = mValues[m];
        break;
      }
    }
    this._z1 = Math.floor((2 * this._a_w * this._cosBeta) / (this._m * (distributedShaftStats.u + 1)));
    this._z2 = Math.floor(distributedShaftStats.u * this._z1);
    this._u_m = this._z2 / this._z1; // Tỉ số truyền thực
    // Tính lại góc beta
    this._cosBeta = (this._m * (this._z1 + this._z2)) / (2 * this._a_w);
    this._Beta_angle = Math.acos(this._cosBeta) * (180 / Math.PI);

    // Kiểm nghiệm răng về độ bền tiếp xúc
    const alpha_tw_rad = Math.atan(
      Math.tan((20 * Math.PI) / 180) * Math.cos((this._Beta_angle * Math.PI) / 180)
    ); // (radian)
    this._alpha_tw_rad = alpha_tw_rad;
    const beta_b_rad = Math.tan(Math.cos(alpha_tw_rad) * Math.tan((this._Beta_angle * Math.PI) / 180)); // Góc nghiêng của răng trên hình trụ cơ sở (radian)
    this._Z_H = Math.sqrt((2 * Math.cos(beta_b_rad)) / Math.sin(2 * alpha_tw_rad));

    this._b_w = this._psi_ba * this._a_w; // Chiều rộng vành răng
    const epsi_beta = (this._b_w * Math.sin(beta_b_rad)) / (this._m * Math.PI); // Hệ số trùng khớp dọc
    const epsi_alpha =
      (1.88 - 3.2 * (1 / this._z1 + 1 / this._z2)) * Math.cos((this._Beta_angle * Math.PI) / 180); // Hệ số trùng khớp ngang
    if (epsi_beta == 0) {
      this._Z_epsi = Math.sqrt((4 - epsi_alpha) / 3);
    } else if (epsi_beta >= 1) {
      this._Z_epsi = Math.sqrt(1 / epsi_alpha);
    } else {
      this._Z_epsi = Math.sqrt(((4 - epsi_alpha) * (1 - epsi_beta)) / 3 + epsi_beta / epsi_alpha);
    }

    const d_w = (2 * this._a_w) / (this._u_m + 1);
    const v = (Math.PI * d_w * distributedShaftStats.n) / 60000;

    // Xét thẳng luôn trường hợp bánh răng trụ răng nghiệng
    const coeffValue = Utils.getCoeffLoad(v);

    this._precision_level = coeffValue.precisionLvl;
    this._K_Halpha = coeffValue.K_HAlpha;

    const v_H = 0.002 * Utils.getG0(this._m, this._precision_level) * Math.sqrt(this._a_w / this._u_m);
    const K_Hv = 1 + (v_H * this._b_w * d_w) / (2 * distributedShaftStats.T * this._K_Hbeta * this._K_Halpha);
    const K_H = this._K_Hbeta * this._K_Halpha * K_Hv;

    this._sigma_H =
      this._Z_M *
      this._Z_H *
      this._Z_epsi *
      Math.sqrt((2 * distributedShaftStats.T * K_H * (this._u_m + 1)) / (this._b_w * this._u_m * d_w ** 2));

    // Kiểm nghiệm răng về độ bền uốn
    const Y_epsi = 1 / epsi_alpha;
    const Y_beta = 1 - this._Beta_angle / 140;

    const z_v1 = this._z1 / this._cosBeta ** 3;
    const z_v2 = this._z2 / this._cosBeta ** 3;
    const z_v1Idx = z_vValues.indexOf(
      z_vValues.reduce((prev, curr) => (Math.abs(curr - z_v1) < Math.abs(prev - z_v1) ? curr : prev))
    );
    const z_v2Idx = z_vValues.indexOf(
      z_vValues.reduce((prev, curr) => (Math.abs(curr - z_v2) < Math.abs(prev - z_v2) ? curr : prev))
    );
    const Y_F1 = Y_FValues[z_v1Idx];
    const Y_F2 = Y_FValues[z_v2Idx];

    this._K_Fbeta = K_FBetaTable[psi_bdIndex][this._soDo - 1];
    this._K_Falpha = coeffValue.K_FAlpha;

    const v_F = 0.006 * Utils.getG0(this._m, this._precision_level) * Math.sqrt(this._a_w / this._u_m);
    const K_Fv = 1 + (v_F * this._b_w * d_w) / (2 * distributedShaftStats.T * this._K_Fbeta * this._K_Falpha);
    const K_F = this._K_Hbeta * this._K_Falpha * K_Fv;

    this._sigma_F1 =
      (2 * distributedShaftStats.T * K_F * Y_epsi * Y_beta * Y_F1) / (this._b_w * d_w * this._m);
    this._sigma_F2 = (this._sigma_F1 * Y_F2) / Y_F1;
  }
  contactDuraCheck(): boolean {
    // Chọn Z_v = 1 cho chẵn, vì kiểu gì theo công thức nào thì kết quả cũng gần 1
    // Chọn Z_R = 0.95 Với độ nhám R_a = 2.5 .. 1.25 micro mét
    // Chọn K_xH = 1 với d_a < 700 mm
    if (this._sigma_H > this._sigma_H_allow * 1 * 0.95 * 1) return false;
    else return true;
  }

  curlDuraCheck(): boolean {
    // Chọn Y_R = 1 - hệ số xét đến ảnh hưởng của độ nhám mặt lượn chân răng (bánh răng phay).
    const Y_S = 1.08 - 0.0695 * Math.log(this._m);
    // Chọn K_xF = 1 ứng với d_a <= 400 mm
    if (
      this._sigma_F1 > this._gear_small.sigma_F_allow * 1 * Y_S * 1 ||
      this._sigma_F2 > this._gear_big.sigma_F_allow * 1 * Y_S * 1
    )
      return false;
    else return true;
  }

  // K_qt là Tmax/Tdn của động cơ đã chọn
  overloadDuraCheck(K_qt: number): boolean {
    const sigma_Hmax = this._sigma_H * Math.sqrt(K_qt);
    const sigma_F1max = this._sigma_F1 * K_qt;
    const sigma_F2max = this._sigma_F2 * K_qt;
    if (
      sigma_Hmax > this._sigma_H_allow_max ||
      sigma_F1max > this._sigma_F1_allow_max ||
      sigma_F2max > this._sigma_F2_allow_max
    )
      return false;
    return true;
  }

  calcSizeStats() {
    this._d1 = (this._m * this._z1) / this._cosBeta;
    this._d2 = (this._m * this._z2) / this._cosBeta;
    this._dw1 = (2 * this._a_w) / (this._u_m + 1);
    this._dw2 = this._dw1 * this._u_m;
    this._da1 = this._d1 + 2 * (1 + this._x) * this._m;
    this._da2 = this._d2 + 2 * (1 + this._x) * this._m;
    this._df1 = this._d1 - (2.5 - 2 * this._x) * this._m;
    this._df2 = this._d2 - (2.5 - 2 * this._x) * this._m;
  }

  returnPostStats() {
    return {
      a_w: this._a_w,
      m: this._m,
      b_w: this._b_w,
      u_m: this._u_m,
      beta: this._Beta_angle,
      z1: this._z1,
      z2: this._z2,
      d1: this._d1,
      d2: this._d2,
      da1: this._da1,
      da2: this._da2,
      df1: this._df1,
      df2: this._df2,
      dw1: this._dw1,
      dw2: this._dw2,
    };
  }
  get a_tw_rad(): number {
    return this._alpha_tw_rad;
  }
}
