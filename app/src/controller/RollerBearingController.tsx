import DatabaseService from "@services/DatabaseService";
import CalculatedRollerBearing, { SelectedRollerBearing } from "@models/RollerBearing";
import { selectRollerBearingSizeLabel } from "@/views/common/Label";

export default class RollerBearingController {
  static generateRollerBearing(Rx: number, Ry: number) {
    try {
      return new CalculatedRollerBearing(Rx, Ry);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Lỗi khi tính toán ổ lăn: ${error.message}`);
      }
    }
  }
  static async getSelectableRollerBearing(type: string, d: number): Promise<SelectedRollerBearing[]> {
    const dataList = await DatabaseService.getSelectableRollerBearingList(type, d);
    if (dataList.length > 0) {
      return dataList
        .map((rollerBearing) => {
          if (rollerBearing) {
            return new SelectedRollerBearing(
              rollerBearing.rb_type,
              rollerBearing.symbol,
              rollerBearing.d,
              rollerBearing.D,
              rollerBearing.r,
              rollerBearing.C,
              rollerBearing.C_O,
              selectRollerBearingSizeLabel[
                rollerBearing.description as keyof typeof selectRollerBearingSizeLabel
              ],
              rollerBearing.B,
              rollerBearing.b,
              rollerBearing.r1
            );
          }
        })
        .filter((item): item is SelectedRollerBearing => item !== null); // Loại bỏ `null` an toàn;
    }
    return [];
  }
}
