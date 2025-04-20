export default class CalculatedKey {
  private _lt: number; // Chiều dài then
  private _b: number; // Kích thước b của tiết diện then
  private _h: number; // Kích thước h của tiết diện then
  private _t1: number; // Chiều sâu rãnh then trên trục
  private _sigma_d: number; // Ứng suất dập cho phép
  private _tau_c: number; // Ứng suất cắt cho phép

  constructor(T: number, d: number, lm: number, b: number, h: number, t1: number) {
    this._lt = 0.8 * lm; // Chọn luôn lấy 0.8 * lm
    this._b = b;
    this._h = h;
    this._t1 = t1;
    this._sigma_d = (2 * T) / (d * this._lt * (h - t1));
    this._tau_c = (2 * T) / (d * this._lt * b);
    if (this._sigma_d > 100) throw new Error("Ứng suất dập không thỏa: " + this._sigma_d); // CHọn luôn max là 100 với thép cố định va đập nhẹ
    if (this._tau_c > 60) throw new Error("Ứng suất cắt không thỏa: " + this._tau_c);
    // Chọn luôn max là 60 khi chịu tải trọng va đập nhẹ
    else if (this._tau_c > 40) alert("Ứng suất cắt hơi nguy hiểm: " + this._tau_c); // Giới hạn dưới là 40 khi chịu tải trọng va đập nhẹ
  }
  getDimension() {
    return { b: this._b, h: this._h, t1: this._t1 };
  }
}
