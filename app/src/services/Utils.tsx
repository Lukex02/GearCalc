import { create, all } from "mathjs";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import React, { useEffect } from "react";
import Svg, { Line, Path, Text } from "react-native-svg";
import { View, ColorValue } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedReaction, runOnJS } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import Label, { inputLabel } from "@/views/common/Label";
import { scale, verticalScale } from "react-native-size-matters";
import DatabaseService from "./DatabaseService";

const math = create(all);

function CalcU_tv(u_h: number, tan_gamma: number, initialGuess = 1): number {
  // Giải u_tv theo thuật toán Newton-Raphson
  const f = (u_tv: number) =>
    math.evaluate(`8 - (${tan_gamma}^2 * ${u_h}^2 * (1 + (${u_h}/x))) / (x * ${tan_gamma} + 1)^3`, {
      x: u_tv,
    });

  const fPrime = (u_tv: number) =>
    math
      .derivative(`8 - (${tan_gamma}^2 * ${u_h}^2 * (1 + (${u_h}/x))) / (x * ${tan_gamma} + 1)^3`, "x")
      .evaluate({ x: u_tv });

  let x = initialGuess;
  for (let i = 0; i < 10; i++) {
    x = x - f(x) / fPrime(x);
    if (Math.abs(f(x)) < 1e-6) break;
  }

  return x;
}

// Lập bảngg g0
type mRange = "≤3.55" | "3.55–10" | ">10";
type AccuracyLevel = 6 | 7 | 8 | 9;

const g0Table: Record<AccuracyLevel, Record<mRange, number>> = {
  6: {
    "≤3.55": 38,
    "3.55–10": 42,
    ">10": 48,
  },
  7: {
    "≤3.55": 47,
    "3.55–10": 53,
    ">10": 64,
  },
  8: {
    "≤3.55": 56,
    "3.55–10": 61,
    ">10": 73,
  },
  9: {
    "≤3.55": 73,
    "3.55–10": 82,
    ">10": 100,
  },
};

function getMRange(m: number): mRange {
  if (m <= 3.55) return "≤3.55";
  if (m <= 10) return "3.55–10";
  return ">10";
}

function getG0(m: number, level: AccuracyLevel): number {
  const range = getMRange(m);
  return g0Table[level][range];
}

interface CoeffLoadResult {
  precisionLvl: AccuracyLevel;
  K_HAlpha: number;
  K_FAlpha: number;
}

function getCoeffLoad(v: number): CoeffLoadResult {
  let precisionLvl: AccuracyLevel = 6;
  let K_HAlpha: number = 0;
  let K_FAlpha: number = 0;

  if (v <= 4) {
    precisionLvl = 9;
    if (v <= 2.5) {
      K_HAlpha = 1.13;
      K_FAlpha = 1.37;
    } else {
      K_HAlpha = 1.16;
      K_FAlpha = 1.4;
    }
  } else if (v <= 10) {
    precisionLvl = 8;
    if (v <= 5) {
      K_HAlpha = 1.09;
      K_FAlpha = 1.27;
    } else {
      K_HAlpha = 1.13;
      K_FAlpha = 1.37;
    }
  } else if (v <= 15) {
    precisionLvl = 7;
    K_HAlpha = 1.09;
    K_FAlpha = 1.25;
  } else if (v <= 30) {
    precisionLvl = 6;
    if (v <= 20) {
      K_HAlpha = 1.05;
      K_FAlpha = 1.17;
    } else if (v <= 25) {
      K_HAlpha = 1.06;
      K_FAlpha = 1.2;
    }
  }
  return {
    precisionLvl,
    K_HAlpha,
    K_FAlpha,
  };
}

const d_bOTables: Record<number, number> = {
  20: 15,
  25: 17,
  30: 19,
  35: 21,
  40: 23,
  45: 25,
  50: 27,
  55: 29,
  60: 31,
  65: 33,
  70: 35,
  75: 37,
  80: 39,
  85: 41,
  90: 43,
  100: 47,
};
function getBO(d: number): number {
  return d_bOTables[d];
}

// [Sigma] này được lấy theo cột Thép CT6, 45 có sigma_b >= 600
function getSigmaAllowInShaft(d: number) {
  if (d <= 30) return 63;
  else if (d <= 50) return 50;
  else return 48; // < 100
}

// Epsilon được chọn theo thép cacbon
function getEpsilonSigmaAndTau(d: number) {
  if (d <= 15) return { epsi_sigma: 0.95, epsi_tau: 0.92 };
  else if (d <= 20) return { epsi_sigma: 0.92, epsi_tau: 0.89 };
  else if (d <= 30) return { epsi_sigma: 0.88, epsi_tau: 0.81 };
  else if (d <= 40) return { epsi_sigma: 0.85, epsi_tau: 0.78 };
  else if (d <= 50) return { epsi_sigma: 0.81, epsi_tau: 0.76 };
  else if (d <= 70) return { epsi_sigma: 0.76, epsi_tau: 0.73 };
  else if (d <= 80) return { epsi_sigma: 0.73, epsi_tau: 0.71 };
  else return { epsi_sigma: 0.7, epsi_tau: 0.7 }; // Assume < 100
}

interface ForceOnShaftDataProps {
  diagramWidth: number;
  diagramHeight: number;
  padding: number;
  xStroke: number;
  yStroke: number;
  labelSize: number;
  data: ForceOnShaftDataPoint[];
  borderColor: ColorValue;
  fillColor: ColorValue;
  lineColor: ColorValue;
  xUnit: string;
  yUnit: string;
}

export interface ForceOnShaftDataPoint {
  x: number;
  y: number;
}

const ForceOnShaftDiagram = ({
  diagramWidth,
  diagramHeight,
  padding,
  data,
  xStroke,
  yStroke,
  labelSize,
  borderColor,
  fillColor,
  lineColor,
  xUnit,
  yUnit,
}: ForceOnShaftDataProps) => {
  const maxX = Math.max(...data.map((p) => p.x));
  const minY = Math.min(...data.map((p) => p.y), 0);
  const maxY = Math.max(...data.map((p) => p.y), 0);
  const originY =
    padding + (Math.max(...data.map((p) => p.y), 0) * (diagramHeight - 2 * padding)) / (maxY - minY);

  const scaleX = (diagramWidth - 2 * padding) / maxX;
  const scaleY = (diagramHeight - 2 * padding) / (maxY - minY);

  const startX = padding + data[0].x * scaleX;
  const endX = padding + data[data.length - 1].x * scaleX;

  const pathFill =
    data
      .map((point, index) => {
        const x = padding + point.x * scaleX;
        const y = originY - point.y * scaleY;
        return `${index === 0 ? "M" : "L"} ${x},${y}`;
      })
      .join(" ") + ` L ${endX},${originY} L ${startX},${originY} Z`;

  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withTiming(1, { duration: 1000 });
  }, [data]);
  const [animatedD, setAnimatedD] = React.useState(pathFill); // bắt đầu từ path chưa có animation

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      const newPath =
        data
          .map((point, index) => {
            const x = padding + point.x * scaleX;
            const y = originY - point.y * scaleY * value;
            return `${index === 0 ? "M" : "L"} ${x},${y}`;
          })
          .join(" ") + ` L ${endX},${originY} L ${startX},${originY} Z`;

      runOnJS(setAnimatedD)(newPath); // Cập nhật lại d path trong React state
    },
    [data]
  );

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Svg width={diagramWidth} height={diagramHeight}>
        {/* Vùng tô  */}
        <Path d={animatedD} fill={fillColor} stroke={lineColor} strokeWidth={2} />

        {/* Trục x */}
        <Line
          x1={padding}
          y1={originY}
          x2={diagramWidth - padding}
          y2={originY}
          stroke={borderColor}
          strokeWidth={xStroke}
        />

        {/* Trục y */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={diagramHeight - padding}
          stroke={borderColor}
          strokeWidth={yStroke}
        />

        {/* Giá trị  */}
        {data.map((point, index) => {
          const x = padding + point.x * scaleX;
          const y = originY - point.y * scaleY;

          return (
            <React.Fragment key={`label-${index}`}>
              <Text x={padding - 40} y={y + 4} fontSize={labelSize} fill={borderColor}>
                {point.y.toFixed(2)}
              </Text>
              <Text x={x + 4} y={originY + 15} fontSize={labelSize} fill={borderColor}>
                {Math.round(point.x)}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Ký hiệu đơn vị trục */}
        <Text x={padding - 10} y={padding - 20} fontSize={labelSize} fill={borderColor}>
          ({yUnit})
        </Text>
        <Text x={diagramWidth - padding - 10} y={diagramHeight - 30} fontSize={labelSize} fill={borderColor}>
          ({xUnit})
        </Text>
      </Svg>
    </View>
  );
};

function chooseRollerBearingType(F_a: number, maxFr: number) {
  if (F_a / maxFr < 0.4) return "single_row_ball"; // Ổ bi một dãy
  else if (F_a / maxFr < 1.5) return "thrust"; // Ổ đỡ - chặn
  else return "tapered"; // Ổ đũa côn
}

const rollerCoeffi = {
  single_row_ball: [
    { iFa_Co: 0.014, X: 0.56, Y: 2.3, e: 0.19 },
    { iFa_Co: 0.028, X: 0.56, Y: 1.99, e: 0.22 },
    { iFa_Co: 0.056, X: 0.56, Y: 1.71, e: 0.26 },
    { iFa_Co: 0.084, X: 0.56, Y: 1.55, e: 0.28 },
    { iFa_Co: 0.11, X: 0.56, Y: 1.45, e: 0.3 },
    { iFa_Co: 0.17, X: 0.56, Y: 1.31, e: 0.34 },
    { iFa_Co: 0.28, X: 0.56, Y: 1.15, e: 0.38 },
    { iFa_Co: 0.42, X: 0.56, Y: 1.04, e: 0.42 },
    { iFa_Co: 0.56, X: 0.56, Y: 1.0, e: 0.44 },
  ],
};

function getRollerCoeffi(type: "single_row_ball", iFa_Co_calc: number) {
  return rollerCoeffi[type as keyof typeof rollerCoeffi].reverse().find(({ iFa_Co, X, Y, e }) => {
    if (iFa_Co_calc > iFa_Co) {
      return { X, Y, e };
    }
  });
}
const shaftBearing = [
  { D_min: 40, D_max: 42, D2: 54, D3: 68, D4: 32, h: 8, d4: "M6", Z: 4 },
  { D_min: 44, D_max: 47, D2: 60, D3: 70, D4: 37, h: 8, d4: "M6", Z: 4 },
  { D_min: 50, D_max: 52, D2: 65, D3: 80, D4: 42, h: 8, d4: "M6", Z: 4 },
  { D_min: 55, D_max: 58, D2: 70, D3: 85, D4: 48, h: 8, d4: "M6", Z: 4 },
  { D_min: 60, D_max: 62, D2: 75, D3: 90, D4: 52, h: 8, d4: "M6", Z: 4 },
  { D_min: 65, D_max: 68, D2: 84, D3: 110, D4: 58, h: 10, d4: "M8", Z: 4 },
  { D_min: 70, D_max: 75, D2: 90, D3: 115, D4: 65, h: 10, d4: "M8", Z: 4 },
  { D_min: 80, D_max: 85, D2: 100, D3: 125, D4: 75, h: 10, d4: "M8", Z: 4 },
  { D_min: 90, D_max: 95, D2: 110, D3: 135, D4: 85, h: 12, d4: "M8", Z: 6 },
  { D_min: 100, D_max: 110, D2: 120, D3: 150, D4: 90, h: 12, d4: "M10", Z: 6 },
  { D_min: 105, D_max: 110, D2: 130, D3: 160, D4: 100, h: 12, d4: "M10", Z: 6 },
  { D_min: 115, D_max: 120, D2: 140, D3: 170, D4: 115, h: 14, d4: "M10", Z: 6 },
  { D_min: 125, D_max: 130, D2: 150, D3: 180, D4: 115, h: 14, d4: "M10", Z: 6 },
  { D_min: 135, D_max: 140, D2: 160, D3: 190, D4: 125, h: 14, d4: "M10", Z: 6 },
];
function getShaftBearing(D: number) {
  return shaftBearing.find(({ D_min, D_max }) => D_min <= D && D <= D_max);
}

async function imageToBase64(name: string): Promise<{ base64Img: string; mimeType: string }> {
  const imageMap = {
    engine_dk: require("../../../assets/images/Engine_DK.jpeg"),
    engine_4a: require("../../../assets/images/Engine_4A.jpeg"),
    engine_k_kcb: require("../../../assets/images/Engine_K_KCB.jpeg"),
    engine_k_knn: require("../../../assets/images/Engine_K_KNN.jpeg"),
    gearbox1_template: require("../../../assets/images/GearBox1Template.png"),
    gearbox2_template: require("../../../assets/images/GearBox2Template.png"),
    shaft1: require("../../../assets/images/GB1/Shaft1.png"),
    shaft2: require("../../../assets/images/GB1/Shaft2.png"),
    shaft3: require("../../../assets/images/GB1/Shaft3.png"),
    shaft_all: require("../../../assets/images/GB1/ShaftAll.png"),
    rollerBearing: require("../../../assets/images/rollerBearing/single_row_ball.png"),
    box1: require("../../../assets/images/GB1/box_1.png"),
    box2: require("../../../assets/images/GB1/box_2.png"),
    box3: require("../../../assets/images/GB1/box_3.png"),
  };
  const asset = Asset.fromModule(imageMap[name as keyof typeof imageMap]);
  await asset.downloadAsync();
  const ext = asset.name?.split(".").pop() || "jpeg";
  const filename = `image.${ext}`;
  const newPath = FileSystem.documentDirectory + filename;
  await FileSystem.copyAsync({
    from: asset.localUri!,
    to: newPath,
  });
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";
  const base64Img = await FileSystem.readAsStringAsync(newPath!, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return { base64Img, mimeType };
}

async function renderStats(stats: any, key: string) {
  let content = "";
  if (key === "_type") {
    // Trường hợp là loại hộp giảm tốc
    content = `
    <section>
    <h2 class="componentTitle">Loại: ${stats}</h2>
    </section>
    `;
  } else if (typeof stats === "object" && !Array.isArray(stats)) {
    if (key === "_design") {
      const inputStatsKey = Object.keys(inputLabel);
      const { base64Img: designTemplateImg, mimeType } = await imageToBase64("gearbox1_template");
      content = `
      <img src="data:${mimeType};base64,${designTemplateImg}" class="design" />
      <section>
        <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]}</h2>
        ${inputStatsKey
          .map((inputKey) => {
            return `
          <p class="medTxt">${Label.inputLabel[inputKey as keyof typeof Label.inputLabel]}: ${
              typeof stats.designStrategy._designInputStats[inputKey] === "object"
                ? Object.keys(stats.designStrategy._designInputStats[inputKey])
                    .map(
                      (desOutKey) => `
            <p>- ${Label.outputInDesignLabel[desOutKey as keyof typeof Label.outputInDesignLabel]}: ${
                        stats.designStrategy._designInputStats[inputKey][desOutKey]
                      }</p>`
                    )
                    .join("")
                : stats.designStrategy._designInputStats[inputKey]
            }
          </p>
          `;
          })
          .join("")}
      </section>
      `;
    } else if (key === "_calcEnginePostStats") {
      content = `
      <section>
        <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]}</h2>
        <div style="border: 1px solid black; padding: 4pt;">
          <div class="grid-container">
            <p class="grid-item-6">Thông số</p>
            <p class="grid-item-6">Trục động cơ</p>
            <p class="grid-item-6">Trục 1</p>
            <p class="grid-item-6">Trục 2</p>
            <p class="grid-item-6">Trục 3</p>
            <p class="grid-item-6">Trục công tác</p>
          </div>
          <div class="grid-container">
            <p class="grid-item-6">P (kW)</p>${stats.distShaft._p
              .map((P: any, index: number) => {
                return `
            <p class="grid-item-6">${P.toFixed(4)}</p>`;
              })
              .join("")}
          </div>
          <div class="grid-container">
            <p class="grid-item-6">N (rpm)</p>${stats.distShaft._n
              .map((n: any, index: number) => {
                return `
            <p class="grid-item-6">${n.toFixed(2)}</p>`;
              })
              .join("")}
          </div>
          <div class="grid-container">
            <p class="grid-item-6">T (N.mm)</p>${stats.distShaft._T
              .map((T: any, index: number) => {
                return `
            <p class="grid-item-6">${T.toFixed(4)}</p>`;
              })
              .join("")}
          </div>
          <div class="grid-container">
            <p class="grid-item-5">Tỷ số truyền u</p>${stats.ratio
              .map((u: any, index: number) => {
                return `
            <p class="grid-item-5">${u.type}: ${u.value.toFixed(2)}</p>`;
              })
              .join("")}
          </div>
        </div>
      </section>

      `;
    } else if (key === "_shaft") {
      content += `
      <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]}</h2>
      <p class="medTxt">Đường kính các trục: ${stats._d.join(", ")}</p>
      <div class="grid-container">
      ${await Promise.all(
        stats._indiShaft.map(async (indiShaft: any, index: number) => {
          const { base64Img: shaftImg, mimeType: mimeType } = await imageToBase64(
            "shaft" + indiShaft._shaftNo
          );
          return `
        <section class="grid-item-2-sm" style="display: flex; flex-direction: column; align-items: center;">
          <img src="data:${mimeType};base64,${shaftImg}" class="design-3" />
          <h2 class="componentTitle">Đường kính các điểm trên trục ${indiShaft._shaftNo} (mm)</h2>
          ${indiShaft._statAtPoint
            .map((pointsStat: any, index: number) => {
              return `<div class="grid-container">
            <p class="grid-item-2-lg">${indiShaft._shaftNo}-${pointsStat.point}</p>
            <p class="grid-item-2-sm">${pointsStat.d}</p>
          </div>`;
            })
            .join("")}
        </section>`;
        })
      ).then((res) => res.join(""))}
      </div>
      `;
    } else if (key === "_rollerBearing") {
      const tableLabel = Label.labelTable[key as keyof typeof Label.labelTable] as keyof typeof Label;
      const statsLabel = Label[tableLabel];
      const { base64Img: rollerBearingImg, mimeType } = await imageToBase64("rollerBearing");

      content += `
      <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]}</h2>
      <div class="grid-container">
      ${Object.keys(stats)
        .map((shaftNo: any) => {
          return `
        <section class="grid-item-2-sm">
          <img src="data:${mimeType};base64,${rollerBearingImg}" class="design-3" />
          <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]} ${shaftNo}</h2>
          ${Object.keys(statsLabel)
            .map((spec) => {
              return `<div class="grid-container">
            <p class="grid-item-2-sm">${statsLabel[spec as keyof typeof statsLabel]}</p>
            <p class="grid-item-2-lg">${
              spec === "type"
                ? Label.rollerBearingTypeLabel[spec as keyof typeof Label.rollerBearingTypeLabel]
                : stats[shaftNo][spec as keyof typeof stats]
            }</p>
          </div>`;
            })
            .join("")}
        </section>`;
        })
        .join("")}
      </div>
      `;
    } else {
      const tableLabel = Label.labelTable[key as keyof typeof Label.labelTable] as keyof typeof Label;
      const statsLabel = Label[tableLabel];
      if (key === "_box") {
        const boxImg = await Promise.all(
          [1, 2, 3].map(async (slice: number) => await imageToBase64("box" + slice))
        );
        content += `
          ${boxImg.map((img, index) => {
            return `<img src="data:${img.mimeType};base64,${img.base64Img}" class="design" />`;
          })}
        `;
      }
      content += `
      <section>
        <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]}</h2>
        <div class="grid-container">
        ${Object.keys(statsLabel)
          .map((statKey) => {
            return `<p class="grid-item-2-sm">${statsLabel[statKey as keyof typeof statsLabel]}</p>
            <p class="grid-item-2-lg">${
              stats[statKey as keyof typeof stats]
                ? stats[statKey as keyof typeof stats]
                : stats[("_" + statKey) as keyof typeof stats]
            }</p>
          `;
          })
          .join("")}
        </div>
      </section>
      `;
    }
  } else {
    // Trường hợp mảng
    const tableLabel = Label.labelTable[key as keyof typeof Label.labelTable] as keyof typeof Label;
    const statsLabel = Label[tableLabel];
    content += `
    <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]}</h2>
    <div class="grid-container">
    ${stats
      .map((stat: any, index: number) => {
        return `
      <section class="grid-item-2-md">
        <h2 class="componentTitle">${Label.mainlabel[key as keyof typeof Label.mainlabel]} ${index + 1}</h2>
        ${Object.keys(statsLabel)
          .map((spec) => {
            return `<div class="grid-container">
          <p class="grid-item-2-sm">${statsLabel[spec as keyof typeof statsLabel]}</p>
          <p class="grid-item-2-lg">${stat[("_" + spec) as keyof typeof stats]}</p>
        </div>`;
          })
          .join("")}
      </section>`;
      })
      .join("")}
    </div>
    `;
  }
  return content;
}

const iconForComponent = {
  _engine: `<svg xmlns="http://www.w3.org/2000/svg"
            width="40pt"
            height="40pt"
            style="margin: auto" viewBox="0 0 24 24"><path d="M7,4V6H10V8H7L5,10V13H3V10H1V18H3V15H5V18H8L10,20H18V16H20V19H23V9H20V12H18V8H12V6H15V4H7Z" /></svg>`,
  _mechDrive: `<svg xmlns="http://www.w3.org/2000/svg"
            width="40pt"
            height="40pt"
            style="margin: auto" viewBox="0 0 24 24"><path d="M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z" /></svg>`,
  _gearSet: `<svg xmlns="http://www.w3.org/2000/svg"
            width="40pt"
            height="40pt"
            style="margin: auto" viewBox="0 0 24 24"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" /></svg>`,
  _shaft: `<svg fill="#000000" 
            width="40pt"
            height="40pt"
            style="margin: auto" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<g>
	<g>
		<path d="M508.939,55.945L456.056,3.061C454.095,1.101,451.438,0,448.666,0c-2.771,0-5.429,1.101-7.389,3.061L337.576,106.762
			l20.892-77.97c0.718-2.677,0.342-5.53-1.044-7.93c-1.386-2.399-3.668-4.152-6.345-4.869l-57.361-15.37
			c-5.578-1.495-11.304,1.815-12.798,7.389L224.038,220.3L3.061,441.276C1.102,443.236,0,445.894,0,448.666
			c0,2.773,1.101,5.43,3.061,7.389l52.884,52.884C57.986,510.98,60.66,512,63.334,512c2.674,0,5.348-1.021,7.389-3.061
			l103.78-103.78l-20.941,78.156c-1.494,5.575,1.814,11.305,7.389,12.799l57.359,15.37c0.89,0.238,1.799,0.356,2.705,0.356
			c1.818,0,3.623-0.475,5.225-1.4c2.4-1.386,4.152-3.668,4.869-6.345l11.909-44.444c0.001-0.004,0.002-0.008,0.003-0.013
			l45.02-168.016l59.838-59.839c1.173-0.776,2.178-1.783,2.955-2.955L508.939,70.723C513.02,66.642,513.02,60.025,508.939,55.945z
			 M287.365,64.71l27.211,47.133l-6.559,24.477l-19.086,19.086l-17.668-30.602L287.365,64.71z M200.916,272.978l54.927-54.926
			v76.209l-54.927,54.927V272.978z M125.09,425.015v-5.723c0-5.772-4.68-10.45-10.45-10.45s-10.45,4.679-10.45,10.45v26.623
			l-40.855,40.855l-38.105-38.105l154.787-154.787v76.21L125.09,425.015z M213.626,488.59l-37.171-9.96l18.046-67.347l27.211,47.131
			L213.626,488.59z M229.362,429.865l-27.694-47.968c-0.478-0.827-1.058-1.554-1.706-2.196l26.934-26.934l15.795,27.357
			L229.362,429.865z M250.34,351.575l-8.144-14.107l16.289-16.289L250.34,351.575z M253.594,190.743l10.019-37.388l10.018,17.352
			L253.594,190.743z M331.669,218.435l-54.926,54.926v-74.761c0-0.459-0.04-0.907-0.097-1.35l55.023-55.023V218.435z
			 M322.226,83.292l-27.211-47.133l3.388-12.643l37.172,9.96L322.226,83.292z M428.398,121.706v-5.721
			c0-5.772-4.68-10.45-10.45-10.45c-5.771,0-10.45,4.679-10.45,10.45v26.622l-54.928,54.928v-75.221c0-0.318-0.02-0.63-0.047-0.94
			l96.143-96.143l38.104,38.105L428.398,121.706z"/>
	</g>
</g>
<g>
	<g>
		<path d="M114.639,374.896c-5.771,0-10.45,4.679-10.45,10.45v0.137c0,5.772,4.68,10.45,10.45,10.45s10.45-4.679,10.45-10.45v-0.137
			C125.089,379.575,120.409,374.896,114.639,374.896z"/>
	</g>
</g>
<g>
	<g>
		<path d="M417.947,71.589c-5.771,0-10.45,4.679-10.45,10.45v0.137c0,5.772,4.68,10.45,10.45,10.45c5.771,0,10.45-4.679,10.45-10.45
			v-0.137C428.397,76.267,423.718,71.589,417.947,71.589z"/>
	</g>
</g>
</svg>`,
  _rollerBearing: `<svg xmlns="http://www.w3.org/2000/svg"
            width="40pt"
            height="40pt"
            style="margin: auto" viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A2.5,2.5 0 0,0 9.5,6.5A2.5,2.5 0 0,0 12,9A2.5,2.5 0 0,0 14.5,6.5A2.5,2.5 0 0,0 12,4M4.4,9.53C3.97,10.84 4.69,12.25 6,12.68C7.32,13.1 8.73,12.39 9.15,11.07C9.58,9.76 8.86,8.35 7.55,7.92C6.24,7.5 4.82,8.21 4.4,9.53M19.61,9.5C19.18,8.21 17.77,7.5 16.46,7.92C15.14,8.34 14.42,9.75 14.85,11.07C15.28,12.38 16.69,13.1 18,12.67C19.31,12.25 20.03,10.83 19.61,9.5M7.31,18.46C8.42,19.28 10,19.03 10.8,17.91C11.61,16.79 11.36,15.23 10.24,14.42C9.13,13.61 7.56,13.86 6.75,14.97C5.94,16.09 6.19,17.65 7.31,18.46M16.7,18.46C17.82,17.65 18.07,16.09 17.26,14.97C16.45,13.85 14.88,13.6 13.77,14.42C12.65,15.23 12.4,16.79 13.21,17.91C14,19.03 15.59,19.27 16.7,18.46M12,10.5A1.5,1.5 0 0,0 10.5,12A1.5,1.5 0 0,0 12,13.5A1.5,1.5 0 0,0 13.5,12A1.5,1.5 0 0,0 12,10.5Z" /></svg>`,
  _lubricantAt50C: `<svg xmlns="http://www.w3.org/2000/svg"
            width="40pt"
            height="40pt"
            style="margin: auto" viewBox="0 0 24 24"><path d="M22,12.5C22,12.5 24,14.67 24,16A2,2 0 0,1 22,18A2,2 0 0,1 20,16C20,14.67 22,12.5 22,12.5M6,6H10A1,1 0 0,1 11,7A1,1 0 0,1 10,8H9V10H11C11.74,10 12.39,10.4 12.73,11L19.24,7.24L22.5,9.13C23,9.4 23.14,10 22.87,10.5C22.59,10.97 22,11.14 21.5,10.86L19.4,9.65L15.75,15.97C15.41,16.58 14.75,17 14,17H5A2,2 0 0,1 3,15V12A2,2 0 0,1 5,10H7V8H6A1,1 0 0,1 5,7A1,1 0 0,1 6,6M5,12V15H14L16.06,11.43L12.6,13.43L11.69,12H5M0.38,9.21L2.09,7.5C2.5,7.11 3.11,7.11 3.5,7.5C3.89,7.89 3.89,8.5 3.5,8.91L1.79,10.62C1.4,11 0.77,11 0.38,10.62C0,10.23 0,9.6 0.38,9.21Z" /></svg>`,
};

async function printReportPDF(historyId: any) {
  const history = await DatabaseService.getUserHistory(historyId);
  const historyCompKeys = Object.keys(history);
  const compKeys = Object.keys(Label.mainlabel).filter(
    (key) =>
      (historyCompKeys.includes(key) &&
        !Array.isArray(history[key]) &&
        Object.keys(history[key]).length > 0) ||
      (Array.isArray(history[key]) && history[key].length > 0)
  ); // Trích ra key có tồn tại trong history và không phải là mảng rỗng
  // console.log("compKeys:", compKeys);
  const renderAvailableComponent = compKeys
    .map((key) => {
      const content =
        iconForComponent[key as keyof typeof iconForComponent] === undefined
          ? ""
          : `<div class="container">
          ${iconForComponent[key as keyof typeof iconForComponent]}
          <p class="medTxt">${Label.mainlabel[key as keyof typeof Label.mainlabel]}</p>
        </div>`;
      return content;
    })
    .join("");

  const renderComponent = await Promise.all(
    compKeys.map(async (key) => {
      const component = history[key];
      return await renderStats(component, key);
    })
  );
  const report = `
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 20mm;
        }
        body {
          width: 210mm;
          height: 297mm;
          margin: 0;
          font-family: Arial, sans-serif;
          line-height: 1;
          box-sizing: border-box;
        }
        .container {
          display: flex;
          flex-direction: column;
          /* align-items: center; */
          justify-content: center;
        }
        h1.title {
          text-align: center;
          font-size: 40pt;
          font-weight: bold;
        }
        img.design {
          margin: auto;
          width: 160mm;
        }
        img.design-3 {
          margin: auto;
          width: 50mm;
        }
        h2.componentTitle {
          text-align: start;
          font-size: 20pt;
          font-weight: bold;
        }
        .page-break {
          page-break-before: always;
        }
        .medTxt {
          font-size: 11pt;
        }
        header.watermark {
          font-style: italic;
          color: gray;
        }
        .checklist {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
        }
        .grid-container {
          display: grid;
          grid-template-columns: repeat(30, 1fr);
          gap: 5pt;
          border: 1px solid black;
        }
        .grid-item-6 {
          border-bottom: 1px solid black;
          text-align: center;
          grid-column: span 5;
          margin: 0;
          padding: 6pt;
        }
        .grid-item-5 {
          border-bottom: 1px solid black;
          text-align: center;
          grid-column: span 6;
          margin: 0;
          padding: 6pt;
        }
        .grid-item-2-sm {
          border-bottom: 1px solid black;
          text-align: center;
          grid-column: span 10;
          margin: 0;
          padding: 6pt;
        }
        .grid-item-2-md {
          border-bottom: 1px solid black;
          text-align: center;
          grid-column: span 15;
          margin: 0;
          padding: 6pt;
        }
        .grid-item-2-lg {
          border-bottom: 1px solid black;
          text-align: center;
          grid-column: span 20;
          margin: 0;
          padding: 6pt;
        }
      </style>
    </head>
    <body>
      <header class="watermark">GearCalc - Bản thiết kế hoàn tất lúc ${history.time}</header>
      <h1 class="title">Thông số thiết kế</h1>
      <h2 class="componentTitle">Danh sách linh kiện thiết kế</h2>
      <div class="checklist">
        ${renderAvailableComponent}
      </div>
      <div class="container">
        ${renderComponent.join("")}
      </div>
    </body>
  </html>
        `;
  const { uri } = await Print.printToFileAsync({ html: report });
  // console.log("File has been saved to:", uri);
  await shareAsync(uri, { UTI: ".pdf", mimeType: "application/pdf" });
}

export default {
  CalcU_tv,
  getG0,
  getCoeffLoad,
  getBO,
  getSigmaAllowInShaft,
  getEpsilonSigmaAndTau,
  chooseRollerBearingType,
  getRollerCoeffi,
  getShaftBearing,
  ForceOnShaftDiagram,
  printReportPDF,
};
