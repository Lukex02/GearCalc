// Will fix later, this is for prop
export class DatabaseService {
  static async getEngine(reqPower: number, reqRpm: number): Promise<any> {
    return {
      power: 120,
      speed: 1400,
      efficiency: 0.85,
    };
  }
}
