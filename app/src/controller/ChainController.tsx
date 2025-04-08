import CalculatedChain, { SelectedChain } from "../models/Chain";

export default class ChainController {
  static generateCalculatedChain(
    P: number,
    u_x: number,
    n: number,
    k_0: number,
    k_a: number,
    k_dc: number,
    k_bt: number,
    k_d: number,
    k_c: number
  ) {
    return new CalculatedChain(P, u_x, n, k_0, k_a, k_dc, k_bt, k_d, k_c);
  }
  static async getSelectableChain(P_max: number): Promise<any[]> {
    // getChain from Db
    const dataList = [{ Step_p: 38.1, d_c: 11.12, d_l: 22.23, B: 35.46, P_max: 10.5, Q: 127, q_p: 5.5, A: 395 }];
    // const dataList = await DatabaseService.getSelectableChain(P_max);
    if (dataList.length > 0) {
      return dataList
        .map((chain) => {
          if (chain) {
            return new SelectedChain(chain.Step_p, chain.d_c, chain.d_l, chain.B, chain.P_max, chain.Q, chain.q_p, chain.A);
          }
        })
        .filter((item): item is SelectedChain => item !== null); // Loại bỏ `null` an toàn;
    }
    return [];
  }
}
