import EngineController from "./EngineController";
import Efficiency, { IEfficiency } from "../models/Efficiency";
import { CalculatedEngine, SelectedEngine } from "../models/EngineModel";
import GearBox, { GearBoxBuilder } from "../models/GearBox";
import TransRatio, { TransRatioType1, TransRatioType2 } from "../models/GearRatio";
import ChainController from "./ChainController";
import GearController from "./GearController";
import CalculatedChain, { SelectedChain } from "../models/Chain";
import GearSet from "../models/Gear";
import ShaftController from "./ShaftController";
import CalculatedShaft from "../models/Shaft";
import Utils from "../services/Utils";
import KeyController from "./KeyController";
import CalculatedKey from "../models/Key";

type GearBox1GearSetInput = {
  sigma_b: [number, number];
  sigma_ch: [number, number];
  HB: [number, number];
  S_max: [number, number];
  distributedShaftStats: {
    u: number;
    n: number;
    T: number;
  };
  K_qt: number;
};
type GearBox2GearSetInput = {
  a: number; // Random prop
};
type GearSetInput = GearBox1GearSetInput | GearBox2GearSetInput;

type GearBox1MechDriveInput = {
  P: number;
  u_x: number;
  n: number;
  k_0: number;
  k_a: number;
  k_dc: number;
  k_bt: number;
  k_d: number;
  k_c: number;
};
type GearBox2MechDriveInput = {
  a: number; // Random prop
};
type MechDriveInput = GearBox1MechDriveInput | GearBox2MechDriveInput;

//
// -------------- Stategy Pattern cho thiết kế
//
interface DesignStrategy {
  _designInputStats: any;
  _designEngineStats: any;
  // _designMechDriveStats: any;
  // _designGearStats: any;
  _shaftDiagramData: any;

  storeDesignInput(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L: number,
    output: any
  ): void;
  designEngine(): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio };
  recalcEngine(efficiency: Efficiency, ratio: TransRatio): CalculatedEngine;
  designMechDrive(input: MechDriveInput): any;
  continueCalcMechDrive(calculated: CalculatedChain | any, selected: SelectedChain | any): void;
  designGear(input: GearSetInput): GearSet | any; // Sẽ chỉ làm 1 hàm tính bánh răng dùng chung
  designShaft(
    input: { sigma_b: number; sigma_ch: number; HB: number },
    order: string[],
    distributedTorque: number[],
    hubParam: {
      hub_d_x_brt?: number; // Hệ số tính chiều dài mayơ bánh đai, dĩa xích, bánh răng trụ
      hub_kn_tvdh?: number; // Hệ số tính chiếu dài mayơ nửa khớp nối đối với trục vòng đàn hồi
      hub_kn_tr?: number; // Hệ số tính chiều dài mayơ nửa khớp nối đối với trục răng, có thể sẽ define sau nếu có làm thiết kế liên quan
      hub_bv?: number; // Hệ só tính chiều dài mayơ bánh vít
      hub_brc?: number; // Hệ só tính chiều dài mayơ bánh răng côn
    },
    gears: any,
    mechDrive: {
      F_r: number;
    }
  ): CalculatedShaft | any;
  get shaftDiagram(): any;
  designKey(shaft: CalculatedShaft): any;
  testDurability(calcShaft: CalculatedShaft): any;
}

//
// -------------- Hộp giảm tốc 2 cấp khai triển (2 cặp bánh răng)
// Quay một chiều, làm việc 2 ca, tải va đập nhẹ: 1 năm làm việc 300 ngày, 1 ca làm việc 8 giờ.
//
class DesignGearBox1 implements DesignStrategy {
  _designInputStats: any;
  _designEngineStats: any;
  _shaftDiagramData: any;
  // _designMechDriveStats: any;
  // _designGearStats: any;

  storeDesignInput(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L: number,
    output: any
  ) {
    this._designInputStats = {
      F: F,
      v: v,
      T1: T1,
      t1: t1,
      T2: T2,
      t2: t2,
      L: L,
      output: output,
    };
  }

  designEngine(): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio } {
    // Design strategy 1 implementation
    let baseEfficiency = new Efficiency([
      [{ type: "ol", value: 0.992 }, 4],
      [{ type: "x", value: 0.96 }, 1],
      [{ type: "brt", value: 0.96 }, 2],
      [{ type: "kn", value: 1 }, 1],
    ]);
    let baseRatio = new TransRatioType1([
      { type: "x", value: 2.56 },
      { type: "h", value: 18 },
      { type: "kn", value: 1 },
    ]);
    this._designEngineStats = {
      F: this._designInputStats.F,
      v: this._designInputStats.v,
      T1: this._designInputStats.T1,
      t1: this._designInputStats.t1,
      T2: this._designInputStats.T2,
      t2: this._designInputStats.t2,
      drumPulley: {
        D: this._designInputStats.output.D,
      },
      efficiency: baseEfficiency,
      ratio: baseRatio,
    };
    return {
      engi: EngineController.generateCalculatedEngine(
        this._designEngineStats.F,
        this._designEngineStats.v,
        this._designEngineStats.drumPulley.D * Math.PI, // Chu vi của đĩa xích
        this._designEngineStats.T1,
        this._designEngineStats.t1,
        this._designEngineStats.T2,
        this._designEngineStats.t2,
        baseEfficiency,
        baseRatio
      ),
      base_effi: baseEfficiency,
      base_ratio: baseRatio,
    };
  }
  recalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    return EngineController.generateCalculatedEngine(
      this._designEngineStats.F,
      this._designEngineStats.v,
      this._designEngineStats.drumPulley.D * Math.PI, // Chu vi của trục tang trống
      this._designEngineStats.T1,
      this._designEngineStats.t1,
      this._designEngineStats.T2,
      this._designEngineStats.t2,
      (this._designEngineStats.efficiency = efficiency),
      (this._designEngineStats.ratio = ratio)
    );
  }

  designMechDrive(input: GearBox1MechDriveInput) {
    try {
      return ChainController.generateCalculatedChain(
        input.P,
        input.u_x,
        input.n,
        input.k_0,
        input.k_a,
        input.k_dc,
        input.k_bt,
        input.k_d,
        input.k_c
      );
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }
  continueCalcMechDrive(calculatedChain: CalculatedChain, selectedChain: SelectedChain) {
    try {
      calculatedChain.calc_after_choose(selectedChain);
      calculatedChain.calcSprocket();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }
  designGear(input: GearBox1GearSetInput): GearSet {
    // Design gears here
    return GearController.generateGearSet(
      input.sigma_b,
      input.sigma_ch,
      input.HB,
      input.S_max,
      input.distributedShaftStats,
      {
        T1: this._designInputStats.T1,
        t1: this._designInputStats.t1,
        T2: this._designInputStats.T2,
        t2: this._designInputStats.t2,
        L_h: this._designInputStats.L,
      },
      input.K_qt
    );
  }
  designShaft(
    input: { sigma_b: number; sigma_ch: number; HB: number; k1: number; k2: number; k3: number; h_n: number },
    order: string[],
    distributedTorque: number[],
    hubParam: {
      hub_d_x_brt?: number;
      hub_kn_tvdh?: number;
      hub_kn_tr?: number;
      hub_bv?: number;
      hub_brc?: number;
    },
    gears: {
      fastGear: {
        a_tw: number; // rad
        b_w: number; // độ
        d1: number;
        d2: number;
        beta: number;
      };
      slowGear: {
        a_tw: number; // rad
        b_w: number; // độ
        d1: number;
        d2: number;
        beta: number;
      };
    },
    chain: {
      F_r: number; // Lực tác dụng lên trục của xích (F_rx)
    }
  ): CalculatedShaft {
    // Design shaft here
    const shaft = ShaftController.generateShaft(
      input.sigma_b,
      input.sigma_ch,
      input.HB,
      distributedTorque,
      [15, 20, 30]
    );
    shaft.add_distance(input.k1, input.k2, input.k3, input.h_n);
    shaft.calc_hub_length(
      order,
      gears.fastGear.b_w,
      gears.slowGear.b_w,
      hubParam.hub_d_x_brt,
      hubParam.hub_kn_tvdh,
      hubParam.hub_kn_tr,
      hubParam.hub_bv,
      hubParam.hub_brc
    );

    // ------ Tính chiều dài trục II
    // l22 = 0,5(lm22 + b_o2) + k1 + k2
    const l22 = shaft.getHubLength("lm22") + shaft.getBO(1) + shaft.k1 + shaft.k2;
    // l23 = l22 + 0.5(lm22 + lm23) + k1
    const l23 = l22 + 0.5 * (shaft.getHubLength("lm22") + shaft.getHubLength("lm23")) + shaft.k1;
    // l21 = lm22 + lm23 + 3k1 + 2k2 + b_o2
    const l21 =
      shaft.getHubLength("lm22") + shaft.getHubLength("lm23") + 3 * shaft.k1 + 2 * shaft.k2 + shaft.getBO(2);

    // ------ Tính chiều dài trục I
    const l13 = l22;
    const l12 = 0.5 * (shaft.getHubLength("lm12") + shaft.getBO(1)) + shaft.k3 + shaft.h_n;
    const l11 = l21;

    // ------ Tính chiều dài trục III
    const l32 = l23;
    const l31 = l21;
    const l33 = l31 + 0.5 * (shaft.getHubLength("lm33") + shaft.getBO(3)) + shaft.k3 + shaft.h_n;

    // ------ Xác định lực tác dụng lên trục I
    // Lực tác dụng từ khớp nối, lực hướng tâm
    const F_r = 0.2 * 2 * distributedTorque[0];
    // Lực trên bánh răng nhỏ của bộ truyền cấp nhanh
    const F_t1 = (2 * distributedTorque[0]) / gears.fastGear.d1; // Lực vòng
    const F_a1 = F_t1 * Math.tan((gears.fastGear.beta * Math.PI) / 180); // Lực dọc trục
    const F_r1 = (F_t1 * Math.tan(gears.fastGear.a_tw)) / Math.cos((gears.fastGear.beta * Math.PI) / 180); // Lực trên bánh răng

    const R1_Bz = F_a1;
    const R1_Bx = (F_r * (l11 + l12) + F_t1 * (l11 - l13)) / l11;
    const R1_By = (F_r1 * (l11 - l13) + (F_a1 * gears.fastGear.d1) / 2) / l11;
    const R1_Dx = F_r - R1_Bx + F_t1;
    const R1_Dy = F_r1 - R1_By;

    const Q1x = [
      { x: 0, y: -F_r },
      { x: l12, y: -F_r },
      { x: l12, y: -F_r + R1_By },
      { x: l12 + l13, y: -F_r + R1_By },
      { x: l12 + l13, y: -F_r + R1_By - F_t1 },
      { x: l12 + l11, y: -F_r + R1_By - F_t1 },
    ];

    const Q1y = [
      { x: l12, y: 0 },
      { x: l12, y: R1_By },
      { x: l12 + l13, y: R1_By },
      { x: l12 + l13, y: R1_By - F_r1 },
      { x: l12 + l11, y: R1_By - F_r1 },
    ];

    const M1x = [
      { x: l12, y: 0 }, // M1xB
      { x: l12 + l13, y: R1_By * l13 }, // M1xC
      { x: l12 + l13, y: R1_By * l13 - (F_a1 * gears.fastGear.d1) / 2 },
      { x: l12 + l11, y: R1_By * l13 - (F_a1 * gears.fastGear.d1) / 2 + (R1_By - F_r1) * (l11 - l13) }, // M1xD, should be 0
    ];

    const M1y = [
      { x: 0, y: 0 }, // M1yA
      { x: l12, y: F_r * l12 }, // M1yB
      { x: l12 + l13, y: F_r * l12 - (-F_r + R1_By) * l13 }, // M1yC
      { x: l12 + l11, y: F_r * l12 - (-F_r + R1_By) * l13 - (-F_r + R1_By - F_t1) * (l11 - l13) }, // M1yD, should be 0
    ];

    const M1z = [
      { x: 0, y: distributedTorque[0] },
      { x: l12 + l13, y: distributedTorque[0] },
    ];
    this._shaftDiagramData = { ...this._shaftDiagramData, Shaft1: { Q1x, Q1y, M1x, M1y, M1z } };
    shaft.addIndiviDia(
      [
        { point: "A", Mx: 0, My: 0 },
        { point: "B", Mx: 0, My: F_r * l12 }, // Tương tự ở D
        { point: "C", Mx: R1_By * l13, My: F_r * l12 - (-F_r + R1_By) * l13 },
      ],
      1
    );

    // ------ Xác định lực tác dụng lên trục II
    // Lực trên bánh răng lớn của bộ truyền cấp nhanh
    const F_t2 = F_t1; // Lực vòng
    const F_a2 = F_a1; // Lực dọc trục
    const F_r2 = F_r1; // Lực trên bánh răng
    // Lực trên bánh răng nhỏ của bộ truyền cấp chậm
    const F_t3 = (2 * distributedTorque[1]) / gears.slowGear.d1; // Lực vòng
    const F_a3 = F_t3 * Math.tan((gears.slowGear.beta * Math.PI) / 180); // Lực dọc trục
    const F_r3 = (F_t3 * Math.tan(gears.slowGear.a_tw)) / Math.cos((gears.slowGear.beta * Math.PI) / 180); // Lực trên bánh răng

    const R2_Az = F_a3 - F_a2;
    const R2_Ax = (-F_t2 * (l21 - l22) + F_t3 * (l21 - l23)) / l21;
    const R2_Ay =
      (-F_r2 * (l21 - l22) +
        F_r3 * (l21 - l23) +
        (F_a2 * gears.fastGear.d2) / 2 +
        (F_a3 * gears.slowGear.d1) / 2) /
      l21;
    const R2_Dx = F_t2 + F_t3 - R2_Ax;
    const R2_Dy = F_r2 - F_r3 - R2_Ay;

    const Q2x = [
      { x: 0, y: -R2_Ax }, // A
      { x: l22, y: -R2_Ax }, // A -> B
      { x: l22, y: -R2_Ax + F_t2 }, // B
      { x: l23, y: -R2_Ax + F_t2 }, // B -> C
      { x: l23, y: -R2_Ax + F_t2 + F_t3 }, // C
      { x: l21, y: -R2_Ax + F_t2 + F_t3 }, // C -> D
    ];

    const Q2y = [
      { x: 0, y: Math.abs(R2_Ay) }, // A
      { x: l22, y: Math.abs(R2_Ay) }, // A -> B
      { x: l22, y: Math.abs(R2_Ay) + F_r2 }, // B
      { x: l23, y: Math.abs(R2_Ay) + F_r2 }, // B -> C
      { x: l23, y: Math.abs(R2_Ay) + F_r2 - F_r3 }, // C
      { x: l21, y: Math.abs(R2_Ay) + F_r2 - F_r3 }, // C -> D
    ];

    const M2x = [
      { x: 0, y: 0 }, // MxA
      { x: l22, y: Math.abs(R2_Ay) * l22 }, // MxB
      { x: l22, y: Math.abs(R2_Ay) * l22 - (F_a2 * gears.fastGear.d2) / 2 },
      {
        x: l23,
        y: Math.abs(R2_Ay) * l22 - (F_a2 * gears.fastGear.d2) / 2 + (Math.abs(R2_Ay) + F_r2) * (l23 - l22),
      }, // MxC
      {
        x: l23,
        y:
          Math.abs(R2_Ay) * l22 -
          (F_a2 * gears.fastGear.d2) / 2 +
          (Math.abs(R2_Ay) + F_r2) * (l23 - l22) -
          (F_a3 * gears.slowGear.d1) / 2,
      },
      {
        x: l21,
        y:
          Math.abs(R2_Ay) * l22 -
          (F_a2 * gears.fastGear.d2) / 2 +
          (Math.abs(R2_Ay) + F_r2) * (l23 - l22) -
          (F_a3 * gears.slowGear.d1) / 2 -
          (Math.abs(R2_Ay) + F_r2 - F_r3) * (l21 - l23), // should be 0
      }, // MxD
    ];

    const M2y = [
      { x: 0, y: 0 }, // M2yA
      { x: l22, y: R2_Ax * l22 }, // M2yB
      { x: l23, y: R2_Ax * l22 - (-R2_Ax + F_t2) * (l23 - l22) }, // M2yC
      { x: l21, y: R2_Ax * l22 - (-R2_Ax + F_t2) * (l23 - l22) - (R2_Ax - F_t2 - F_t3) * (l21 - l23) }, // M2yD, should be 0
    ];

    const M2z = [
      { x: l22, y: -distributedTorque[1] },
      { x: l23, y: -distributedTorque[1] },
    ];
    this._shaftDiagramData = { ...this._shaftDiagramData, Shaft2: { Q2x, Q2y, M2x, M2y, M2z } };
    shaft.addIndiviDia(
      [
        { point: "A", Mx: 0, My: 0 },
        { point: "B", Mx: Math.abs(R2_Ay) * l22, My: R2_Ax * l22 }, // Tương tự ở D
        {
          point: "C",
          Mx: Math.abs(R2_Ay) * l22 - (F_a2 * gears.fastGear.d2) / 2 + (Math.abs(R2_Ay) + F_r2) * (l23 - l22),
          My: R2_Ax * l22 - (-R2_Ax + F_t2) * (l23 - l22),
        },
      ],
      2
    );

    // ------ Xác định lực tác dụng lên trục III
    // Lực trên bánh răng lớn của bộ truyền cấp chậm
    const F_t4 = F_t3; // Lực vòng
    const F_a4 = F_a3; // Lực dọc trục
    const F_r4 = F_r3; // Lực trên bánh răng
    // Lực vòng trên bộ truyền xích
    const F_rx = chain.F_r;

    const R3_Cz = F_a4;
    const R3_Ax = (F_t4 * (l31 - l32) + F_rx * (l33 - l31)) / l31;
    const R3_Ay = (-F_r4 * (l31 - l32) + (F_a4 * gears.slowGear.d2) / 2) / l31;
    const R3_Cx = F_t4 - F_rx - R3_Ax;
    const R3_Cy = F_r4 - R3_Ay;

    const Q3x = [
      { x: 0, y: R3_Ax }, // A
      { x: l32, y: R3_Ax }, // A -> B
      { x: l32, y: R3_Ax - F_t4 }, // B
      { x: l31, y: R3_Ax - F_t4 }, // B -> C
      { x: l31, y: R3_Ax - F_t4 - Math.abs(R3_Cx) }, // C
      { x: l33, y: R3_Ax - F_t4 - Math.abs(R3_Cx) }, // C -> D
    ];

    const Q3y = [
      { x: 0, y: Math.abs(R3_Ay) }, // A
      { x: l32, y: Math.abs(R3_Ay) }, // A -> B
      { x: l32, y: Math.abs(R3_Ay) + F_r4 }, // B
      { x: l31, y: Math.abs(R3_Ay) + F_r4 }, // B -> C
      { x: l31, y: Math.abs(R3_Ay) + F_r4 - Math.abs(R3_Cy) }, // C, should be 0
    ];

    const M3x = [
      { x: 0, y: 0 }, // M3xA
      { x: l32, y: R3_Ay * l32 }, // M3xB
      { x: l32, y: R3_Ay * l32 - (F_a4 * gears.slowGear.d2) / 2 }, // M3xC
      { x: l31, y: R3_Ay * l32 - (F_a4 * gears.slowGear.d2) / 2 - (Math.abs(R3_Ay) + F_r4) * (l31 - l32) },
      {
        x: l31,
        y: R3_Ay * l32 - (F_a4 * gears.slowGear.d2) / 2 - (Math.abs(R3_Ay) + F_r4) * (l31 - l32) - R3_Cy, // should be 0
      }, // M3xD
    ];

    const M3y = [
      { x: 0, y: 0 }, // M3yA
      { x: l32, y: -R3_Ax * l32 }, // M3yB
      { x: l31, y: -R3_Ax * l32 - (R3_Ax - F_t4) * (l33 - l32) }, // M3yC
      {
        x: l33,
        y: -R3_Ax * l32 - (R3_Ax - F_t4) * (l33 - l32) - (R3_Ax - F_t4 - Math.abs(R3_Cx)) * (l33 - l31), // should be 0
      }, // M3yD
    ];

    const M3z = [
      { x: l22, y: distributedTorque[2] },
      { x: l23, y: distributedTorque[2] },
    ];
    this._shaftDiagramData = { ...this._shaftDiagramData, Shaft3: { Q3x, Q3y, M3x, M3y, M3z } };
    shaft.addIndiviDia(
      [
        { point: "A", Mx: 0, My: 0 }, // Tương tự ở D
        { point: "B", Mx: R3_Ay * l32, My: -R3_Ax * l32 },
        {
          point: "C",
          Mx: R3_Ay * l32 - (F_a4 * gears.slowGear.d2) / 2,
          My: -R3_Ax * l32 - (R3_Ax - F_t4) * (l33 - l32),
        },
      ],
      3
    );
    console.log("Diagram: ", this._shaftDiagramData);
    console.log("Shaft step 1: ", shaft);
    return shaft;
  }
  get shaftDiagram() {
    return this._shaftDiagramData;
  }
  async designKey(shaft: CalculatedShaft): Promise<void> {
    await Promise.all(
      shaft.getAllIndividualShaft().map(async (indiShaft, shaftIdx) => {
        if (shaftIdx === 0) {
          indiShaft.getStatAtPoint("A").key = await KeyController.generateKey(
            shaft.getHubLength("lm12"),
            indiShaft.T,
            indiShaft.getStatAtPoint("A").d!
          );
          indiShaft.getStatAtPoint("C").key = await KeyController.generateKey(
            shaft.getHubLength("lm13"),
            indiShaft.T,
            indiShaft.getStatAtPoint("C").d!
          );
        } else if (shaftIdx === 1) {
          indiShaft.getStatAtPoint("B").key = await KeyController.generateKey(
            shaft.getHubLength("lm22"),
            indiShaft.T,
            indiShaft.getStatAtPoint("B").d!
          );
          indiShaft.getStatAtPoint("C").key = await KeyController.generateKey(
            shaft.getHubLength("lm23"),
            indiShaft.T,
            indiShaft.getStatAtPoint("C").d!
          );
        } else if (shaftIdx === 2) {
          indiShaft.getStatAtPoint("B").key = await KeyController.generateKey(
            shaft.getHubLength("lm32"),
            indiShaft.T,
            indiShaft.getStatAtPoint("B").d!
          );
          indiShaft.getStatAtPoint("D").key = await KeyController.generateKey(
            shaft.getHubLength("lm33"),
            indiShaft.T,
            indiShaft.getStatAtPoint("D").d!
          );
        }
      })
    );
  }
  testDurability(calcShaft: CalculatedShaft) {
    // Kiểm nghiệm độ bền mỏi
    const sigma_max = 0.436 * calcShaft.sigma_b; // Giới hạn mỏi uốn
    const tau_max = 0.58 * sigma_max; // Giới hạn mỏi xoắn
    const sigma_mj = 0; // Vì trục quay, ứng suất uốn thay đổi theo chu kì đối xứng nên giá trị trung bình của ứng suất pháp tại tiết diện j là 0

    // *** sigma_b = 600 là lấy cố định nên sẽ chọn mặc định theo cột nào mà chỉ có 1 lựa chọn *** //
    const psi_sigma = 0.05;
    const psi_tau = 0;
    const K_x = 1.06; // Trị số của hệ số tập trung ứng suất do trạng thái bề mặt

    // Chọn theo bề mặt trục được thấm cacbon, trục nhẵn
    const K_y = 1.8; // Trị số của hệ số tăng bền

    // Chọn theo rãnh then được cắt bằng dao phay ngón, sigma_b = 600
    const K_sigma = 1.76;
    const K_tau = 1.54;

    calcShaft.getAllIndividualShaft().forEach((indiShaft, shaftIdx) => {
      let indiShaftStat =
        shaftIdx === 0
          ? indiShaft.getStatAtPoint("C")
          : shaftIdx === 1
          ? indiShaft.getStatAtPoint("C")
          : shaftIdx === 2
          ? indiShaft.getStatAtPoint("B")
          : null;
      if (indiShaftStat) {
        const { d, M_x, M_y } = indiShaftStat;
        const { epsi_sigma, epsi_tau } = Utils.getEpsilonSigmaAndTau(d!);
        const { b, h, t1 } = indiShaftStat.key!.getDimension();
        const W_j = (Math.PI * d! ** 3) / 32 - (b * t1 * (d! - t1) ** 2) / d!; // Momen cản uốn
        const W_oj = (Math.PI * d! ** 3) / 16 - (b * t1 * (d! - t1) ** 2) / d!; // Momen cản xoắn
        const M_j = Math.sqrt(M_x ** 2 + M_y ** 2); // Momen tại tiết diện j
        const sigma_aj = M_j / W_j; // Biên độ ứng suất pháp tại tiết diện j
        const tau_mj = indiShaft.T / (2 * W_oj);
        const tau_aj = tau_mj;
        const K_sigmadj = (K_sigma / epsi_sigma + K_x - 1) / K_y;
        const K_taudj = (K_tau / epsi_tau + K_x - 1) / K_y;
        const s_sigma = sigma_max / (K_sigmadj * sigma_aj + psi_sigma * sigma_mj);
        const s_tau = tau_max / (K_taudj * tau_aj + psi_tau * tau_mj);
        const s = (s_sigma * s_tau) / Math.sqrt(s_sigma ** 2 + s_tau ** 2);
        if (s < 3) throw new Error("Trục " + shaftIdx + " không thỏa điều kiện bền mỏi");
      }
    });

    // Kiểm nghiệm độ bền tĩnh
    const sigma_allow = 0.8 * calcShaft.sigma_ch;
    calcShaft.getAllIndividualShaft().forEach((indiShaft, shaftIdx) => {
      const { d: d_max, M: M_max } = indiShaft.maxStats;
      const T_max = indiShaft.T;
      const sigma = M_max / (0.1 * d_max ** 3);
      const tau = T_max / (0.2 * d_max ** 3);
      const sigma_td = Math.sqrt(sigma ** 2 + 3 * tau ** 2);
      if (sigma_td > sigma_allow) throw new Error("Trục " + shaftIdx + " không thỏa điều kiện bền tĩnh");
    });
  }
}

//
// -------------- Thiết kế hộp giảm tốc bánh răng trục vít bánh răng
//
class DesignGearBox2 implements DesignStrategy {
  _designInputStats: any;
  _designEngineStats: any;
  _shaftDiagramData: any;
  // _designMechDriveStats: any;
  // _designGearStats: any;

  storeDesignInput(
    F: number,
    v: number,
    T1: number,
    t1: number,
    T2: number,
    t2: number,
    L: number,
    output: any
  ) {
    this._designInputStats = {
      F: F,
      v: v,
      T1: T1,
      t1: t1,
      T2: T2,
      t2: t2,
      L: L,
      output: output,
    };
  }

  designEngine(): { engi: CalculatedEngine; base_effi: Efficiency; base_ratio: TransRatio } {
    // Design strategy 2 implementation
    let baseEfficiency = new Efficiency([
      [{ type: "ol", value: 0.99 }, 4],
      [{ type: "d", value: 0.94 }, 1],
      [{ type: "tv", value: 0.85 }, 1],
      [{ type: "brt", value: 0.96 }, 1],
      [{ type: "kn", value: 0.98 }, 1],
    ]);
    let baseRatio = new TransRatioType2([
      { type: "d", value: 3 },
      { type: "tv", value: 10 },
      { type: "brt", value: 3 },
      { type: "kn", value: 1 },
    ]);
    this._designEngineStats = {
      F: this._designInputStats.F,
      v: this._designInputStats.v,
      T1: this._designInputStats.T1,
      t1: this._designInputStats.t1,
      T2: this._designInputStats.T2,
      t2: this._designInputStats.t2,
      sprocket: {
        z: this._designInputStats.output.z,
        p: this._designInputStats.output.p,
      },
      efficiency: baseEfficiency,
      ratio: baseRatio,
    };
    return {
      engi: EngineController.generateCalculatedEngine(
        this._designEngineStats.F,
        this._designEngineStats.v,
        this._designEngineStats.sprocket.z * this._designEngineStats.sprocket.p, // Chu vi của đĩa xích
        this._designEngineStats.T1,
        this._designEngineStats.t1,
        this._designEngineStats.T2,
        this._designEngineStats.t2,
        baseEfficiency,
        baseRatio
      ),
      base_effi: baseEfficiency,
      base_ratio: baseRatio,
    };
  }
  recalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    return EngineController.generateCalculatedEngine(
      this._designEngineStats.F,
      this._designEngineStats.v,
      this._designEngineStats.sprocket.z * this._designEngineStats.sprocket.p, // Chu vi của đĩa xích
      this._designEngineStats.T1,
      this._designEngineStats.t1,
      this._designEngineStats.T2,
      this._designEngineStats.t2,
      (this._designEngineStats.efficiency = efficiency),
      (this._designEngineStats.ratio = ratio)
    );
  }

  designMechDrive(input: any) {
    // Should be belt here
  }
  continueCalcMechDrive(calculatedBelt: any, selectedBelt: any) {}
  designGear(input: any) {
    // Design gears here
  }
  designShaft(
    input: { sigma_b: number; sigma_ch: number; HB: number },
    order: string[],
    distributedTorque: number[]
  ) {
    // Design shaft here
    return;
  }
  get shaftDiagram() {
    return this._shaftDiagramData;
  }
  async designKey() {}
  testDurability(calcShaft: CalculatedShaft): boolean {
    return true;
  }
}

//
// -------------- Controller chung cho các tính toán, dùng giao tiếp trực tiếp với các Views
//
export default class CalcController {
  private _designStrategy: DesignStrategy;
  private _order: string[];
  private _effiency!: Efficiency;
  private _ratio!: TransRatio;
  private _calcEngine!: CalculatedEngine;
  private _calcEnginePostStats: any;
  private _calcMechDrive: CalculatedChain | any; // || CalculatedBelt; nếu có belt
  private _calcGearSet: GearSet[] | any; // any vì mỗi thiết kế lại có kiểu khác nhau
  private _calcShaft!: CalculatedShaft;
  private _gearBoxBuilder: GearBoxBuilder;

  // Implement semi-Singleton to store object state
  private static instance: CalcController;

  static getInstance(): CalcController {
    return CalcController.instance;
  }

  constructor(gearBoxType: string) {
    switch (gearBoxType) {
      case "GearBox1":
        this._designStrategy = new DesignGearBox1();
        this._order = ["kn", "brt_1", "brt_2", "x"];
        break;
      case "GearBox2":
        this._designStrategy = new DesignGearBox2();
        this._order = ["d", "tv", "brt", "kn"];
        break;
      default:
        throw new Error("Invalid gear box type");
    }
    CalcController.instance = this;
    this._gearBoxBuilder = new GearBoxBuilder();
  }

  initDesign(F: number, v: number, T1: number, t1: number, T2: number, t2: number, L: number, output: any) {
    this._designStrategy.storeDesignInput(F, v, T1, t1, T2, t2, L, output);
  }

  calcEngineBase() {
    let engiDes = this._designStrategy.designEngine();
    this._calcEngine = engiDes.engi;
    this._effiency = engiDes.base_effi;
    this._ratio = engiDes.base_ratio;
  }
  adjustCalcEngine(efficiency: Efficiency, ratio: TransRatio) {
    if (this._calcEngine) {
      // Adjust engine parameters
      this._calcEngine = this._designStrategy.recalcEngine(efficiency, ratio);
    } else {
      throw new Error("Base engine calculation has not been performed");
    }
  }

  chooseEngine(selected: SelectedEngine) {
    this._gearBoxBuilder.setEngine(selected);
  }

  getEnginePostStats() {
    if (this._calcEnginePostStats) {
      return this._calcEnginePostStats;
    } else if (this._gearBoxBuilder && this._calcEngine) {
      try {
        const newTransRatio = EngineController.getNewTransRatio(
          this._calcEngine,
          this._gearBoxBuilder.getEngine(),
          this._ratio
        );
        if (newTransRatio) {
          const newEngineShaftStats = EngineController.getShaftStats(
            this._gearBoxBuilder.getEngine().n_t,
            this._calcEngine.p_lv,
            this._effiency,
            newTransRatio,
            this._order
          );
          let rearrangedRatio = this._order
            .map((ratio_type) => newTransRatio.ratio_spec.find((ratio) => ratio.type === ratio_type))
            .reverse();
          this._calcEnginePostStats = {
            ratio: rearrangedRatio,
            distShaft: newEngineShaftStats,
          };
          return this._calcEnginePostStats;
        } else {
          return null;
        }
      } catch (error) {
        if (error instanceof Error) {
          alert(`Error while calculating engine stats: ${error.message}`);
        }
      }
    }
  }

  getCalcEngine(): CalculatedEngine {
    return this._calcEngine;
  }

  showEngineParam(): { effi: Efficiency; ratio: TransRatio } {
    return { effi: this._effiency, ratio: this._ratio };
  }

  calcMechDriveBase(input: MechDriveInput) {
    let mechDriveDes = this._designStrategy.designMechDrive(input);
    this._calcMechDrive = mechDriveDes;
  }

  chooseMechDrive(selected: SelectedChain | any) {
    // Selected Chain chỉ mang tính chất chọn thiết kế chuẩn để tính tiếp, nên sẽ dùng calcMechDrive để lưu state
    this._designStrategy.continueCalcMechDrive(this._calcMechDrive, selected);
    this._gearBoxBuilder.setMechDrive(this._calcMechDrive);
  }

  getCalcMechDrive(): CalculatedChain | any {
    return this._calcMechDrive;
  }

  calcGearSet(
    input: {
      sigma_b: [number, number];
      sigma_ch: [number, number];
      HB: [number, number];
      S_max: [number, number];
    },
    inputShaftNo: number = 1 | 2 | 3
  ) {
    try {
      this._calcGearSet.push(
        this._designStrategy.designGear({
          ...input,
          distributedShaftStats: {
            u: this._calcEnginePostStats.ratio[inputShaftNo].value,
            n: this._calcEnginePostStats.distShaft.n[inputShaftNo],
            T: this._calcEnginePostStats.distShaft.T[inputShaftNo],
          },
          K_qt: this._gearBoxBuilder.getEngine().T_max_T_dn,
        })
      );
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        alert(`Lỗi khi tính toán bộ truyền: ${error.message}`);
      }
    }
  }
  getCalcGearSet(): any[] {
    return this._calcGearSet;
  }

  setGearAll() {
    this._gearBoxBuilder.setGearSet(this._calcGearSet);
  }
  // Bước 1 của trục: tính sơ bộ
  calcShaft(
    mats: { sigma_b: number; sigma_ch: number; HB: number },
    hubParam: {
      hub_d_x_brt?: number;
      hub_kn_tvdh?: number;
      hub_kn_tr?: number;
      hub_bv?: number;
      hub_brc?: number;
    }
  ) {
    // Calculate shaft here
    try {
      this._calcShaft = this._designStrategy.designShaft(
        mats,
        this._order,
        this._calcEnginePostStats.distShaft.T.slice(1, this._calcEnginePostStats.distShaft.T.length - 1),
        hubParam,
        {
          fastGear: {
            b_w: this._calcGearSet[0].returnPostStats().b_w,
            d1: this._calcGearSet[0].returnPostStats().d1,
            d2: this._calcGearSet[0].returnPostStats().d2,
            beta: this._calcGearSet[0].returnPostStats().beta,
            a_tw: this._calcGearSet[0].a_tw_rad,
          },
          slowGear: {
            b_w: this._calcGearSet[1].returnPostStats().b_w,
            d1: this._calcGearSet[1].returnPostStats().d1,
            d2: this._calcGearSet[1].returnPostStats().d2,
            beta: this._calcGearSet[0].returnPostStats().beta,
            a_tw: this._calcGearSet[0].a_tw_rad,
          },
        }, // Gears
        {
          F_r: this._calcMechDrive.getChainPostStats().F_rx, // Tạm thời bỏ qua trường hợp đai
        }
      );
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        alert(`Lỗi khi tính toán bộ truyền: ${error.message}`);
      }
    }
  }
  // Bước 1.5 của trục: Lấy tọa độ để vẽ biểu đồ lực
  getShaftDiagram() {
    this._designStrategy.shaftDiagram;
  }
  // Bước 2 của trục: Chọn đường kính trục chung
  chooseShaftDiameter(d_choose: number[]) {
    if (this._calcShaft) {
      this._calcShaft.choose_d(d_choose);
    }
  }
  // Bước 3 của trục: Chọn đường kính trục cho từng tiết diện của từng trục
  chooseIndiShaftDiameter(shaftNo: 1 | 2 | 3, d_choose: { point: string; value: number; key: undefined }[]) {
    if (this._calcShaft) {
      const thisShaft = this._calcShaft.getIndividualShaft(shaftNo);
      thisShaft.choose_d(d_choose);
    }
  }
  // Bước 4 của trục: Chọn then
  async calcKey() {
    if (this._calcShaft) {
      this._designStrategy.designKey(this._calcShaft);
    }
  }
  // Bước 5 (cuối) của trục: Kiểm nghiệm
  testShaft() {
    if (this._calcShaft) {
      try {
        // Kiểm nghiệm trục
        this._designStrategy.testDurability(this._calcShaft);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          alert(`Lỗi khi tính toán trục: ${error.message}`);
        }
      }
    }
  }
}
