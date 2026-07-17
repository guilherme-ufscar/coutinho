export interface LineChartPoint {
  label: string;
  value: number;
}

/** Gráfico de linha minimalista (design-stitch.md §4: "uma cor de destaque, grade discreta"). */
export function LineChart({ data, height = 160 }: { data: LineChartPoint[]; height?: number }) {
  if (data.length === 0) {
    return (
      <div style={{ height, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-tertiary)", fontSize: "var(--fs-body-sm)" }}>
        Sem dados registrados ainda.
      </div>
    );
  }

  const width = 480;
  const padding = 24;
  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
    const y = height - padding - ((d.value - min) / range) * (height - padding * 2);
    return { x, y, ...d };
  });

  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={padding} x2={width - padding} y1={padding + f * (height - padding * 2)} y2={padding + f * (height - padding * 2)} stroke="var(--border-hairline)" strokeWidth={1} />
      ))}
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r={3} fill="var(--accent)" />
      ))}
    </svg>
  );
}
