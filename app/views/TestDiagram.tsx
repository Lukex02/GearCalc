import Utils, { ForceOnShaftDataPoint } from "@services/Utils";

export default function TestDiagram() {
  const data: ForceOnShaftDataPoint[] = [
    { x: 0, y: -326.82 },
    { x: 112, y: -326.82 },
    { x: 112, y: 1575.12 },
    { x: 112 + 113, y: 1575.12 },
    { x: 112 + 113, y: -565.019 },
    { x: 112 + 113 + 111, y: -565.019 },
  ];
  return <Utils.ForceOnShaftDiagram data={data} fillColor={"rgba(0, 0, 255, 0.2)"} lineColor={"blue"} />;
}
