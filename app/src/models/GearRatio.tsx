import { CalcU_tv } from "../services/Utils";
import { CalculatedEngine, SelectedEngine } from "./EngineModel";

export interface IRatio {
  type: string;
  value: number;
}

export default class TransRatio {
  private _ratio_spec: IRatio[]; // Tỷ số truyền các chi tiết
  private _u_t: number; // Tỷ số truyền của hệ dẫn động
  private _u_ng: number; // Tỷ số truyền ngoài hộp
  private _u_h: number; // Tỷ số truyền trong hộp

  constructor(ratio: IRatio[]) {
    this._ratio_spec = ratio;
    this._u_t = ratio.reduce((acc, ratio) => acc * ratio.value, 1);
    this._u_ng =
      ratio.find((ratio) => ratio.type === "u_d" || ratio.type === "u_x")
        ?.value ?? 1; // Dựa theo thiết kế
    this._u_h = this._u_t / this._u_ng;
  }

  get ratio_spec() {
    return this._ratio_spec;
  }
  // Getter
  get_ratio(type: string) {
    return this._ratio_spec.find((ratio) => ratio.type === type)?.value;
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
    this._ratio_spec.map((ratio) => {
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
    this.set_ratio("d", value);
    this._u_ng = value;
  }

  // Setter của u_brt
  set u_brt(value: number) {
    this.set_ratio("brt", value);
  }

  // Setter của u_tv
  set u_tv(value: number) {
    // this._u_tv = value;
    // this.u_brt = this._u_h / this._u_tv;
    this._ratio_spec.map((ratio) => {
      if (ratio.type === "tv") return (ratio.value = value);
      // Nếu u_tv thay đổi thì u_brt thay đổi theo u_brt = u_h / u_tv
      if (ratio.type === "brt") {
        return (ratio.value = this.u_h / value);
      }
    });
  }

  // Setter của u_kn
  set u_kn(value: number) {
    this.set_ratio("kn", value);
  }

  // clone(): TransRatio {
  //   return new TransRatio(this._ratio_spec);
  // }
  recalcTransRatio(
    calc_engi: CalculatedEngine,
    sele_engi: SelectedEngine
  ): TransRatio | Error {
    // Sau khi gán u_t mới thì các thông số khác sẽ tự động cập nhật
    // let old_ratio = this.clone();
    this._u_t = sele_engi.n_t / calc_engi.n_lv;
    // Kiểm tra lại
    let delta_check =
      this._u_t - this._ratio_spec.reduce((acc, ratio) => acc * ratio.value, 1);
    if (-0.5 < delta_check && delta_check < 0.5) return this;
    else return new Error("Failed check");
  }
}
