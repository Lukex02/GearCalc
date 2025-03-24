// Will fix later, this is for prop
export default class DatabaseService {
  static async getEngine(reqPower: number, reqRpm: number): Promise<any[]> {
    return [
      {
        name: "DK.62-4",
        power: 10,
        n_t: 1460,
        H: 0.88,
        GD_2: 0.6,
        T_max_T_dn: 2.3,
        T_k_T_dn: 1.3,
        weight: 170,
      },
      // {
      //   name: "K160S4",
      //   power: 7.5,
      //   n_t: 1450,
      //   H: 0.86,
      //   GD_2: null,
      //   T_max_T_dn: null,
      //   T_k_T_dn: 2.2,
      //   weight: 94,
      // },
    ];
  }
}
