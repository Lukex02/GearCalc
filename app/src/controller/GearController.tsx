import GearSet from "../models/Gear";

export default class GearController {
  static generateGears(
    sigma_b: number,
    sigma_ch: number,
    HB: number,
    S_max: number,
    shaftStats: {
      u: number;
      n: number;
      T1: number;
    },
    desStats: {
      T1: number;
      t1: number;
      T2: number;
      t2: number;
      L_h: number;
    }
  ) {
    const gearSet = new GearSet(sigma_b, sigma_ch, HB, S_max, shaftStats, desStats, true);
  }
}
