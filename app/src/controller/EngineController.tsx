import Efficiency from "../models/Efficiency";
import EngineFactory, {
  CalculatedEngine,
  SelectedEngine,
} from "../models/EngineModel";
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
    return EngineFactory.createCalculatedEngine(
      F,
      v,
      output_perimeter,
      T1,
      t1,
      T2,
      t2,
      efficieny.n_system,
      ratio.ratio_spec
    );
  }
  static async getSelectedEngine(
    reqPower: number, // CalculatedEngine.p_ct
    reqRpm: number, // CalculatedEngine.n_sb
    T_mm_T: number // CalculatedEngine.T1 (có thể là T2 tùy vào lúc khởi động chạy cái nào, ở đây bài đang làm theo thì lấy T1)
  ): Promise<SelectedEngine[]> {
    // List of satisfied engine
    const dataList = await DatabaseService.getEngine(reqPower, reqRpm);
    return dataList
      .map(
        (data: {
          name: string;
          power: number;
          n_t: number;
          H: number;
          GD_2: number;
          T_max_T_dn: number;
          T_k_T_dn: number;
          weight: number;
        }) =>
          EngineFactory.createSelectedEngine(
            data.name,
            data.power,
            data.n_t,
            data.H,
            data.GD_2,
            data.T_max_T_dn,
            data.T_k_T_dn,
            data.weight,
            T_mm_T
          )
      )
      .filter((engi) => engi !== null);
  }

  static getNewTransRatio(
    calc_engi: CalculatedEngine,
    sele_engi: SelectedEngine,
    cur_ratio: TransRatio
  ) {
    // console.log(calc_engi, sele_engi, cur_ratio);
    return cur_ratio.recalcTransRatio(calc_engi, sele_engi);
  }

  static getShaftStats(
    n_dc: number,
    p_td: number,
    final_effi: Efficiency,
    final_ratio: TransRatio
  ) {
    return new ShaftStats(n_dc, p_td, final_effi, final_ratio);
  }
}
