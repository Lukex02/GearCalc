import GearSet from "../models/Gear";

export default class GearController {
  static generateGearSet(
    sigma_b: number,
    sigma_ch: number,
    HB: number,
    S_max: number,
    shaftStats: {
      u: number;
      n: number;
      T: number;
    },
    desStats: {
      T1: number;
      t1: number;
      T2: number;
      t2: number;
      L_h: number;
    },
    K_qt: number
  ) {
    const gearSet = new GearSet(sigma_b, sigma_ch, HB, S_max, shaftStats, desStats, true);
    if (gearSet.contactDuraCheck() && gearSet.curlDuraCheck() && gearSet.overloadDuraCheck(K_qt)) {
      gearSet.calcSizeStats();
      return gearSet;
      // return gearSet.returnPostStats();
    }
  }
}
