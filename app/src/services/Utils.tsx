import { create, all } from "mathjs";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
const math = create(all);

export function CalcU_tv(u_h: number, tan_gamma: number, initialGuess = 1): number {
  // Giải u_tv theo thuật toán Newton-Raphson
  const f = (u_tv: number) =>
    math.evaluate(`8 - (${tan_gamma}^2 * ${u_h}^2 * (1 + (${u_h}/x))) / (x * ${tan_gamma} + 1)^3`, { x: u_tv });

  const fPrime = (u_tv: number) =>
    math.derivative(`8 - (${tan_gamma}^2 * ${u_h}^2 * (1 + (${u_h}/x))) / (x * ${tan_gamma} + 1)^3`, "x").evaluate({ x: u_tv });

  let x = initialGuess;
  for (let i = 0; i < 10; i++) {
    x = x - f(x) / fPrime(x);
    if (Math.abs(f(x)) < 1e-6) break;
  }

  return x;
}

export async function printReportPDF() {
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
  printReportPDF,
};
