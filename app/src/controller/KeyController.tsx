import CalculatedKey from "@models/Key";
import DatabaseService from "@services/DatabaseService";

export default class KeyController {
  static async generateKey(lm: number, T: number, d: number) {
    try {
      const queriedKey = await DatabaseService.getKey(d);
      return new CalculatedKey(T, d, lm, queriedKey.b, queriedKey.h, queriedKey.t);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        alert(`Lỗi khi tính toán then: ${error.message}`);
      }
    }
  }
}
