export default class Engine {
  private p: number; // Công suất trên trục công tác
  private p_td: number; // Công suất tương đương
  private p_ct: number; // Công suất cần thiết
  private n_sb: number; // Số vòng quay sơ bộ của động cơ

  constructor(
    F: number, // Lực vòng trên băng tải (N) (đề)
    v: number, // Vận tốc băng tải (m/s) (đề)
    z: number, // Số răng đĩa xích tải dẫn (răng) (đề)
    p: number, // Bước xích tải (mm) (đề)
    L: number, // Thời gian phục vụ (năm) (đề)
    T1: number, // Momen xoắn chế độ tải 1 (đề)
    t1: number, // Thời gian hoạt động ở tải 1 (đề)
    T2: number, // Momen xoắn chế độ tải 2 (đề)
    t2: number, // Thời gian hoạt động ở tải 2 (đề)
    efficiency_system: number
  ) {
    this.p = this.calc_p(F, v);
    this.p_td = this.calc_p_td(T1, t1, T2, t2);
    this.n_sb = this.calc_n_lv(v, z, p) * this.calc_u_t(3, 10, 3, 1);
    this.p_ct = this.p_td / efficiency_system;
  }

  // Tính công suất trên trục công tác
  calc_p(F: number, v: number): number {
    return (F * v) / 1000;
  }

  // Tính công suất tương đương
  calc_p_td(T1: number, t1: number, T2: number, t2: number): number {
    return this.p * Math.sqrt((T1 ** 2 * t1 + T2 ** 2 * t2) / (t1 + t2));
  }

  calc_n_lv(v: number, z: number, p: number): number {
    return (60000 * v) / (z * p);
  }

  calc_u_t(u_d: number, u_tv: number, u_brt: number, u_kn: number): number {
    return u_d * u_tv * u_brt * u_kn;
  }

  // Return công suất cần thiết
  get_p_ct() {
    return this.p_ct;
  }

  // Return công suất tương đương
  get_p_td() {
    return this.p_td;
  }

  // Return công suất trên trục công tác
  get_p() {
    return this.p;
  }

  get_n_sb() {
    return this.n_sb;
  }
}

export class Efficiency {
  // private effi_ol: number; // Hiệu suất một cặp ổ lăn
  // private effi_tv: number; // Hiệu suất của bộ truyền trục vít
  // private effi_brt: number; // Hiệu suất của bộ truyền đai
  // private effi_belt: number; // Hiệu suất của bộ truyền đai
  // private effi_kn: number; // Hiệu suất của khớp nối
  private effi_system: number; // Hiệu suất truyền động của hệ thống

  constructor(
    effi_ol: number,
    effi_tv: number,
    effi_brt: number,
    effi_belt: number,
    effi_kn: number
  ) {
    // this.effi_ol = effi_ol;
    // this.effi_tv = effi_tv;
    // this.effi_brt = effi_brt;
    // this.effi_belt = effi_belt;
    // this.effi_kn = effi_kn;
    this.effi_system = effi_ol ** 4 * effi_tv * effi_brt * effi_belt * effi_kn;
  }

  // get_effi_ol() {
  //   return this.effi_ol;
  // }

  // get_effi_tv() {
  //   return this.effi_tv;
  // }

  // get_effi_brt() {
  //   return this.effi_brt;
  // }

  // get_effi_belt() {
  //   return this.effi_belt;
  // }

  // get_effi_kn() {
  //   return this.effi_kn;
  // }

  get_effi_system() {
    return this.effi_system;
  }
}

// export class Speed {
//   private n_sb: number; // Số vòng quay sơ bộ của động cơ
//   private n_lv: number; // Số vòng quay của trục máy công tác
//   private u_t: number; // Tỷ số truyền cho toàn hệ thống

//   constructor(
//     v: number,
//     z: number,
//     p: number,
//     u_d: number,
//     u_tv: number,
//     u_brt: number,
//     u_kn: number
//   ) {
//     this.n_lv = this.calc_n_lv(v, z, p);
//     this.u_t = this.calc_u_t(u_d, u_tv, u_brt, u_kn);
//     this.n_sb = this.n_lv * this.u_t;
//   }

//   calc_n_lv(v: number, z: number, p: number): number {
//     return (60000 * v) / (z * p);
//   }

//   calc_u_t(u_d: number, u_tv: number, u_brt: number, u_kn: number): number {
//     return u_d * u_tv * u_brt * u_kn;
//   }

//   get_n_sb() {
//     return this.n_sb;
//   }
// }

/* -------------------Ví dụ cách sử dụng------------------- */

//   const [engine, setEngine] = useState<Engine | null>(null);
//   const [efficiency, setEfficiency] = useState<Efficiency | null>(null);

//   const calculateEfficiency = () => {
//     const newEfficiency = new Efficiency(0.99, 0.85, 0.96, 0.94, 0.98);
//     setEfficiency(newEfficiency);
//     return newEfficiency;
//   };

//   const calculatePower = () => {
//     const newEngine = new Engine(
//       17000,
//       0.5,
//       15,
//       120,
//       10,
//       1,
//       25,
//       0.5,
//       15,
//       calculateEfficiency().get_effi_system()
//     );
//     setEngine(newEngine);
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Button title="Tính Công Suất" onPress={calculatePower} />
//       {efficiency && (
//         <Text>
//           Hiệu suất truyền động hệ thống:{" "}
//           {efficiency.get_effi_system().toFixed(3)}
//         </Text>
//       )}
//       {engine && (
//         <Text>
//           Công suất cần thiết: {engine.get_p_ct().toFixed(2)} {"\n"}
//           Số vòng quay sơ bộ của động cơ: {engine.get_n_sb().toFixed(0)}
//         </Text>
//       )}
//     </View>
//   );
// }
