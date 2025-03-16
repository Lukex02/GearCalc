import { create, all } from "mathjs";
const math = create(all);

export function CalcU_tv(
  u_h: number,
  tan_gamma: number,
  initialGuess = 1
): number {
  // Giải u_tv theo thuật toán Newton-Raphson
  const f = (u_tv: number) =>
    math.evaluate(
      `8 - (${tan_gamma}^2 * ${u_h}^2 * (1 + (${u_h}/x))) / (x * ${tan_gamma} + 1)^3`,
      { x: u_tv }
    );

  const fPrime = (u_tv: number) =>
    math
      .derivative(
        `8 - (${tan_gamma}^2 * ${u_h}^2 * (1 + (${u_h}/x))) / (x * ${tan_gamma} + 1)^3`,
        "x"
      )
      .evaluate({ x: u_tv });

  let x = initialGuess;
  for (let i = 0; i < 10; i++) {
    x = x - f(x) / fPrime(x);
    if (Math.abs(f(x)) < 1e-6) break;
  }

  return x;
}
