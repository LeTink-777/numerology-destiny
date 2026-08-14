type Props = {
  className?: string;
};

const R = 90;
const CX = 200;
const CY = 200;

/** Шесть узлов «цветка жизни» вокруг центра. */
const RING = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 2;
  return {
    x: +(CX + R * Math.cos(angle)).toFixed(3),
    y: +(CY + R * Math.sin(angle)).toFixed(3),
  };
});

const OUTER = Array.from({ length: 6 }, (_, i) => {
  const angle = (Math.PI / 3) * i - Math.PI / 2;
  return {
    x: +(CX + R * 1.732 * Math.cos(angle + Math.PI / 6)).toFixed(3),
    y: +(CY + R * 1.732 * Math.sin(angle + Math.PI / 6)).toFixed(3),
  };
});

export default function SacredGeometry({ className }: Props) {
  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="#1B2B4B"
      strokeWidth="0.75"
    >
      <circle cx={CX} cy={CY} r={R} />
      {RING.map((p, i) => (
        <circle key={`ring-${i}`} cx={p.x} cy={p.y} r={R} />
      ))}
      {OUTER.map((p, i) => (
        <circle key={`outer-${i}`} cx={p.x} cy={p.y} r={R} />
      ))}

      <circle cx={CX} cy={CY} r={R * 2} />
      <circle cx={CX} cy={CY} r={R * 2.1} />

      {/* Гексаграмма — два наложенных треугольника */}
      <polygon
        points={`${CX},${CY - R * 1.9} ${CX + R * 1.645},${CY + R * 0.95} ${CX - R * 1.645},${CY + R * 0.95}`}
      />
      <polygon
        points={`${CX},${CY + R * 1.9} ${CX + R * 1.645},${CY - R * 0.95} ${CX - R * 1.645},${CY - R * 0.95}`}
      />

      {RING.map((p, i) => (
        <line key={`spoke-${i}`} x1={CX} y1={CY} x2={p.x} y2={p.y} />
      ))}
    </svg>
  );
}
