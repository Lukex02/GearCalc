import { create, all } from "mathjs";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
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
  printReportPDF,
};
