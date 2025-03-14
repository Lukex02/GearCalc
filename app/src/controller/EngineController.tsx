import EngineFactory, { Efficiency } from "../models/EngineModel";
import { DatabaseService } from "../services/DatabaseService";

export class EngineController {
  static generateCalculatedEngine() {
    // This should be the data we get from user
    let efficieny = new Efficiency(0.99, 0.85, 0.96, 0.94, 0.98);
    let F = 17000,
      v = 0.5,
      z = 15,
      p = 120,
      L = 10,
      T1 = 1,
      t1 = 25,
      T2 = 0.5,
      t2 = 15;

    return EngineFactory.createCalculatedEngine(
      F,
      v,
      z,
      p,
      L,
      T1,
      t1,
      T2,
      t2,
      efficieny.get_effi_system()
    );
  }
  static async getSelectedEngine(
    reqPower: number, // CalculatedEngine.p_ct
    reqRpm: number, // CalculatedEngine.n_sb
    T_mm_T: number // CalculatedEngine.T1 (có thể là T2 tùy vào lúc khởi động chạy cái nào, ở đây bài đang làm theo thì lấy T1)
  ): Promise<any[]> {
    // List of satisfied engine
    const dataList = await DatabaseService.getEngine(reqPower, reqRpm);
    return dataList.map(
      (data: {
        name: string;
        power: number;
        rpm: number;
        H: number;
        GD_2: number;
        T_max_T_dn: number;
        T_k_T_dn: number;
        weight: number;
      }) =>
        EngineFactory.createSelectedEngine(
          data.name,
          data.power,
          data.rpm,
          data.H,
          data.GD_2,
          data.T_max_T_dn,
          data.T_k_T_dn,
          data.weight,
          T_mm_T
        )
    );
  }
}
