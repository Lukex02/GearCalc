import Efficiency from "../models/Efficiency";
import EngineFactory, { CalculatedEngine, SelectedEngine } from "../models/EngineModel";
import TransRatio from "../models/GearRatio";
import ShaftStats from "../models/Shaft";
import DatabaseService from "../services/DatabaseService";

export default class EngineController {
  static generateCalculatedEngine(
    F: number,
    v: number,
    output_perimeter: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    efficieny: Efficiency,
    ratio: TransRatio
  ) {
    return EngineFactory.createCalculatedEngine(F, v, output_perimeter, T1, t1, T2, t2, efficieny.n_system, ratio.ratio_spec);
  }
  static async getSelectedEngine(
    reqPower: number, // CalculatedEngine.p_ct
    reqRpm: number, // CalculatedEngine.n_sb
    T_mm_T: number // CalculatedEngine.T1 (có thể là T2 tùy vào lúc khởi động chạy cái nào, ở đây bài đang làm theo thì lấy T1)
  ): Promise<SelectedEngine[] | null> {
    // List of satisfied engine
    const dataList = await DatabaseService.getSelectableEngine(reqPower, reqRpm);
    return dataList;
  }

  static getNewTransRatio(calc_engi: CalculatedEngine, sele_engi: SelectedEngine, cur_ratio: TransRatio) {
    // console.log(calc_engi, sele_engi, cur_ratio);
    return cur_ratio.recalcTransRatio(calc_engi, sele_engi);
  }

  static getShaftStats(n_dc: number, p_td: number, final_effi: Efficiency, final_ratio: TransRatio, order: string[]) {
    return new ShaftStats(n_dc, p_td, final_effi, final_ratio, order);
  }
}
