export default class CalculatedKey {
  private _point: string; // Điểm lắp then
  private _d: number; // Đường kính trục
  private _lt: number; // Chiều dài then
  private _b: number; // Kích thước b của tiết diện then
  private _h: number; // Kích thước h của tiết diện then
  private _t1: number; // Chiều sâu rãnh then trên trục
  private _sigma_d: number; // Ứng suất dập cho phép
  private _tau_c: number; // Ứng suất cắt cho phép

  constructor(point: string, T: number, d: number, lm: number, b: number, h: number, t1: number) {
    this._d = d;
    this._point = point;
    this._lt = 0.8 * lm; // Chọn luôn lấy 0.8 * lm
    this._b = b;
    this._h = h;
    this._t1 = t1;
    this._sigma_d = (2 * T) / (d * this._lt * (h - t1));
    this._tau_c = (2 * T) / (d * this._lt * b);
    if (this._sigma_d > 120) alert(`Ứng suất dập không thỏa: ` + this._sigma_d.toFixed(2));
    // Chọn luôn max là 100 với thép cố định va đập nhẹ
    if (this._tau_c > 60) alert(`Ứng suất cắt không thỏa: ` + this._tau_c.toFixed(2));
    // Chọn luôn max là 60 khi chịu tải trọng va đập nhẹ
    else if (this._tau_c > 40) alert(`Ứng suất cắt hơi nguy hiểm: ` + this._tau_c.toFixed(2)); // Giới hạn dưới là 40 khi chịu tải trọng va đập nhẹ
  }
  getDimension() {
    return { b: this._b, h: this._h, t1: this._t1 };
  }
  get lt() {
    return this._lt;
  }
  get b() {
    return this._b;
  }
  get h() {
    return this._h;
  }
  get t1() {
    return this._t1;
  }
  get sigma_d() {
    return this._sigma_d;
  }
  get tau_c() {
    return this._tau_c;
  }
  get point() {
    return this._point;
  }
}
