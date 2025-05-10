import CalculatedKey from "@models/Key";
import DatabaseService from "@services/DatabaseService";

export default class KeyController {
  static async generateKey(lm: number, T: number, d: number) {
    try {
      const queriedKey = await DatabaseService.getKey(d);
      if (!queriedKey) throw new Error("Không tìm thấy then trong cơ sở dữ liệu");
      else {
        return new CalculatedKey(T, d, lm, queriedKey[0].b, queriedKey[0].h, queriedKey[0].t1);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}
