import Lubricant from "@models/Lubricant";
import DatabaseService from "@services/DatabaseService";

export default class LubricantController {
  static async generateLubricant() {
    const lubData = await DatabaseService.getLubricant();
    if (lubData.length > 0) {
      return lubData
        .map((lub) => {
          if (lub) {
            return new Lubricant(lub.name, lub.centistoc_min, lub.centistoc_max);
          }
        })
        .filter((item): item is Lubricant => item !== null); // Loại bỏ `null` an toàn;
    } else {
      throw new Error("Không tìm thấy dầu bôi trơn");
    }
  }
}
