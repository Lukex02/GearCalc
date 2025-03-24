export interface IEfficieny {
  type: string;
  value: number;
}

export default class Efficiency {
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

  get n_parts_flat() {
    return this._n_parts.flatMap(([efficiency, count]) => Array(count).fill(efficiency));
  }

  get n_parts_full() {
    return this._n_parts;
  }
}
