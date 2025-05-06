import Box from "@models/Box";
import GearSet from "@models/Gear";
import CalculatedShaft from "@models/Shaft";

export default class BoxController {
  static generateBox(gearSet: GearSet[], shaft: CalculatedShaft, D1: number[]) {
    return new Box(gearSet, shaft, D1);
  }
}
