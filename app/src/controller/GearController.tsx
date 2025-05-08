import GearSet from "@models/Gear";

export default class GearController {
  static generateGearSet(
    sigma_b: [number, number],
    sigma_ch: [number, number],
    HB: [number, number],
    S_max: [number, number],
    distributedShaftStats: {
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
  ): GearSet {
    const gearSet = new GearSet(sigma_b, sigma_ch, HB, S_max, distributedShaftStats, desStats, true);
    if (!gearSet.contactDuraCheck()) {
      console.log(gearSet);
      throw new Error("Bánh răng không đạt yêu cầu độ bền tiếp xúc");
    } else if (!gearSet.curlDuraCheck()) {
      console.log(gearSet);
      throw new Error("Bánh răng không đạt yêu cầu độ bền uốn");
    } else if (!gearSet.overloadDuraCheck(K_qt)) {
      console.log(gearSet);
      throw new Error("Bánh răng không đạt yêu cầu quá tải");
    } else {
      gearSet.calcSizeStats();
      return gearSet;
    }
  }
}
