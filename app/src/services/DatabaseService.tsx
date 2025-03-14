// Will fix later, this is for prop
export default class DatabaseService {
  static async getEngine(reqPower: number, reqRpm: number): Promise<any[]> {
    return [
      {
        name: "DA",
        power: 10,
        n_t: 1460,
        H: 0.88,
        GD_2: 0.6,
        T_max_T_dn: 2.3,
        T_k_T_dn: 1.3,
        weight: 170,
      },
    ];
  }
}
