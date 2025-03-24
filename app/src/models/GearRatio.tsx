import { CalcU_tv } from "../services/Utils";
import { CalculatedEngine, SelectedEngine } from "./EngineModel";

export interface IRatio {
  type: string;
  value: number;
}

export default class TransRatio {
  protected _ratio_spec: IRatio[]; // Tỷ số truyền các chi tiết
  protected _u_t: number; // Tỷ số truyền của hệ dẫn động
  protected _u_ng: number; // Tỷ số truyền ngoài hộp
  protected _u_h: number; // Tỷ số truyền trong hộp

  constructor() {
    this._ratio_spec = []; // Gán giá trị mặc định nếu cần
    this._u_t = 0;
    this._u_ng = 0;
    this._u_h = 0;
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
  protected set_ratio(type: string, value: number) {
    this._ratio_spec.map((ratio) => {
      if (ratio.type === type) return (ratio.value = value);
    });
  }
  protected add_ratio(type: string, value: number) {
    this._ratio_spec.push({ type: type, value: value });
  }
  protected remove_ratio(type: string, value: number) {
    this._ratio_spec = this._ratio_spec.filter((ratio) => ratio.type !== type);
  }
  // Setter của u_h
  set u_h(value: number) {
    this._u_h = value;
  }
  // Setter của u_t
  set u_t(value: number) {
    this._u_t = value;
    this.u_h = this._u_t / this._u_ng;
  }
  // Setter của u_kn
  set u_kn(value: number) {
    this.set_ratio("kn", value);
  }

  recalcTransRatio(calc_engi: CalculatedEngine, sele_engi: SelectedEngine): TransRatio {
    // Sau khi gán u_t mới thì các thông số khác sẽ tự động cập nhật
    this.u_t = sele_engi.n_t / calc_engi.n_lv;
    // Kiểm tra lại
    // console.log(this);
    let delta_check = this.u_t - this._ratio_spec.reduce((acc, ratio) => acc * ratio.value, 1);
    if (-0.5 < delta_check && delta_check < 0.5) return this;
    else throw new Error("Failed check");
  }
}

export class TransRatioType1 extends TransRatio {
  // Cái này sẽ làm base ratio khi construct lần đầu
  constructor(ratio: IRatio[]) {
    super();
    this._ratio_spec = ratio;
    this._u_t = ratio.reduce((acc, ratio) => acc * ratio.value, 1);
    this._u_ng = ratio.find((ratio) => ratio.type === "d" || ratio.type === "x")?.value ?? 1; // Dựa theo thiết kế
    this._u_h = this._u_t / this._u_ng;
  }

  // Setter của u_t
  set u_t(value: number) {
    this._u_t = value;
    this.u_h = this._u_t / this._u_ng;
  }

  // Setter của u_h
  set u_h(value: number) {
    this._u_h = value;
  }

  set u_x(value: number) {
    this.set_ratio("x", value);
    this._u_ng = value;
  }

  // Setter của u_brt
  set u_brt(value: number) {
    // u_brt_1: bánh răng trụ cấp nhanh
    this.add_ratio("brt_1", value);
    // u_brt_2: bánh răng trụ cấp chậm
    this.add_ratio("brt_2", value);
  }
}

export class TransRatioType2 extends TransRatio {
  // Cái này sẽ làm base ratio khi construct lần đầu
  constructor(ratio: IRatio[]) {
    super();
    this._ratio_spec = ratio;
    this._u_t = ratio.reduce((acc, ratio) => acc * ratio.value, 1);
    this._u_ng = ratio.find((ratio) => ratio.type === "d" || ratio.type === "x")?.value ?? 1; // Dựa theo thiết kế
    this._u_h = this._u_t / this._u_ng;
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
    this._ratio_spec.map((ratio) => {
      if (ratio.type === "tv") return (ratio.value = value);
      // Nếu u_tv thay đổi thì u_brt thay đổi theo u_brt = u_h / u_tv
      if (ratio.type === "brt") {
        return (ratio.value = this.u_h / value);
      }
    });
  }
}
