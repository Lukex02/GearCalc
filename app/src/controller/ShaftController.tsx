import CalculatedShaft from "../models/Shaft";

export default class GearController {
  static generateShaft(
    sigma_b: number,
    sigma_ch: number,
    HB: number,
    distributedTorque: number[],
    tau_allow: number[],
  ): CalculatedShaft {
    return new CalculatedShaft(sigma_b, sigma_ch, HB, distributedTorque, tau_allow);
  }
}
