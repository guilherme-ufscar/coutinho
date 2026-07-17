export interface ContinuityRingProps {
  /** 0 a 1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

/**
 * Elemento-assinatura da marca: o "C" vira um progress ring.
 * Reaparece em progresso de anamnese, ciclo de revisão de plano e evolução do cliente.
 */
export function ContinuityRing({ progress, size = 96, strokeWidth = 8, label }: ContinuityRingProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const gradientId = "couthealth-continuity-ring-gradient";

  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F7BE00" />
            <stop offset="100%" stopColor="#F5B335" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border-hairline)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset var(--motion-slow)" }}
        />
      </svg>
      {label && (
        <span style={{ position: "absolute", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "var(--fs-title-sm)" }}>
          {label}
        </span>
      )}
    </div>
  );
}
