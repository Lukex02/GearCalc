import { create, all } from "mathjs";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import React, { useEffect } from "react";
import Svg, { Line, Path, Text } from "react-native-svg";
import { View, ColorValue } from "react-native";
import Animated, { useSharedValue, withTiming, useAnimatedReaction, runOnJS } from "react-native-reanimated";
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

async function printReportPDF() {
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
      src="/src/img/Engine_DK.jpeg"
      style="width: 90vw;" />
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
  ForceOnShaftDiagram,
  printReportPDF,
};
