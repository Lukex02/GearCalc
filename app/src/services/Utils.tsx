import { create, all } from "mathjs";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import React, { useEffect } from "react";
import Svg, { Line, Path, Text } from "react-native-svg";
import { View, ColorValue } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedReaction, runOnJS } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

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

const d_bOTables = [15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 47];
function getBO(d: number): number {
  const idx = d_bOTables.indexOf(d);
  return d_bOTables[idx];
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
  data: ForceOnShaftDataPoint[];
  fillColor: ColorValue;
  lineColor: ColorValue;
}

export interface ForceOnShaftDataPoint {
  x: number;
  y: number;
}

const ForceOnShaftDiagram = ({ data, fillColor, lineColor }: ForceOnShaftDataProps) => {
  const diagramWidth = 350;
  const diagramHeight = 200;
  const padding = 30;
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
    progress.value = withTiming(1, { duration: 1500 });
  }, []);
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
          stroke="black"
          strokeWidth={1}
        />

        {/* Trục y */}
        <Line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={diagramHeight - padding}
          stroke="black"
          strokeWidth={1}
        />

        {/* Giá trị  */}
        {data.map((point, index) => {
          const x = padding + point.x * scaleX;
          const y = originY - point.y * scaleY;

          return (
            <React.Fragment key={`label-${index}`}>
              <Text x={padding - 40} y={y + 4} fontSize={10} fill="black">
                {point.y.toFixed(2)}
              </Text>
              <Text x={x + 4} y={originY + 15} fontSize={10} fill="black">
                {Math.round(point.x)}
              </Text>
            </React.Fragment>
          );
        })}

        {/* Ký hiệu trục */}
        <Text x={diagramWidth - padding - 40} y={padding - 5} fontSize={10} fill={lineColor}>
          (N)
        </Text>
      </Svg>
    </View>
  );
};

function chooseRollerBearingType(F_a: number, maxFr: number) {
  if (F_a / maxFr < 0.3) return "single_row_ball"; // Ổ bi một dãy
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

// async function imageToBase64(uri: string): Promise<string> {
//   try {
//     const response = await fetch(uri);
//     const blob = await response.blob();
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result as string);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   } catch (error) {
//     console.error("Lỗi chuyển đổi ảnh sang Base64:", error);
//     return "";
//   }
// }

async function printReportPDF() {
  const asset = Asset.fromModule(require("../../../assets/images/Engine_DK.jpeg"));
  await asset.downloadAsync();
  const filename = asset.name || "image.jpeg";
  const newPath = FileSystem.documentDirectory + filename;
  await FileSystem.copyAsync({
    from: asset.localUri!,
    to: newPath,
  });
  const base64Img = await FileSystem.readAsStringAsync(newPath!, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const report = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Test Print!
    </h1>
    <img
      src="data:image/jpeg;base64,${base64Img}" style="width: 90vw;" />
    </body>
    </html>
    `;
  const { uri } = await Print.printToFileAsync({ html: report });
  console.log("File has been saved to:", uri);
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
