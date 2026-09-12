import { cn } from '@/lib/utils';

const TEAL = '#01618D';
const NAVY = '#000000';
const BRASS = '#01557A';
const MINT = '#b8cddc';

export function AreaChart({
  values,
  labels,
  className,
}: {
  values: number[];
  labels: string[];
  className?: string;
}) {
  const width = 560;
  const height = 200;
  const pad = { l: 8, r: 8, t: 16, b: 28 };
  const max = Math.max(...values, 1);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const points = values.map((value, index) => {
    const x = pad.l + (values.length === 1 ? innerW / 2 : (index / (values.length - 1)) * innerW);
    const y = pad.t + innerH - (value / max) * innerH;
    return { x, y };
  });
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${line} L ${points[points.length - 1]?.x ?? pad.l} ${height - pad.b} L ${pad.l} ${height - pad.b} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('h-48 w-full', className)} role="img" aria-label="Sales trend">
      <defs>
        <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.28" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((frac) => (
        <line
          key={frac}
          x1={pad.l}
          x2={width - pad.r}
          y1={pad.t + innerH * frac}
          y2={pad.t + innerH * frac}
          stroke="#d7e2de"
          strokeDasharray="4 6"
        />
      ))}
      <path d={area} fill="url(#salesFill)" />
      <path d={line} fill="none" stroke={TEAL} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="#fff" stroke={TEAL} strokeWidth="2">
          <title>
            {labels[i]}: {values[i]}
          </title>
        </circle>
      ))}
      {labels.map((label, i) =>
        i % 2 === 0 || i === labels.length - 1 ? (
          <text key={label + i} x={points[i].x} y={height - 6} textAnchor="middle" className="fill-ink/45" fontSize="11">
            {label}
          </text>
        ) : null,
      )}
    </svg>
  );
}

export function BarChart({
  values,
  labels,
  className,
}: {
  values: number[];
  labels: string[];
  className?: string;
}) {
  const width = 560;
  const height = 200;
  const pad = { l: 8, r: 8, t: 12, b: 28 };
  const max = Math.max(...values, 1);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;
  const gap = 6;
  const barW = Math.max(8, innerW / values.length - gap);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn('h-48 w-full', className)} role="img" aria-label="Orders by day">
      {values.map((value, index) => {
        const h = (value / max) * innerH;
        const x = pad.l + index * (innerW / values.length) + gap / 2;
        const y = pad.t + innerH - h;
        return (
          <g key={labels[index] + index}>
            <rect x={x} y={y} width={barW} height={Math.max(h, 2)} rx="5" fill={index === values.length - 1 ? TEAL : NAVY} opacity={index === values.length - 1 ? 1 : 0.72}>
              <title>
                {labels[index]}: {value}
              </title>
            </rect>
            {index % 2 === 0 || index === values.length - 1 ? (
              <text x={x + barW / 2} y={height - 6} textAnchor="middle" className="fill-ink/45" fontSize="11">
                {labels[index]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

export function DonutChart({
  slices,
  className,
}: {
  slices: Array<{ label: string; value: number; color: string }>;
  className?: string;
}) {
  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const r = 54;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={cn('flex items-center gap-5', className)}>
      <svg viewBox="0 0 140 140" className="size-36 shrink-0" role="img" aria-label="Order status mix">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#eef3f1" strokeWidth="16" />
        {slices.map((slice) => {
          const len = (slice.value / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={slice.label}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={slice.color}
              strokeWidth="16"
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 70 70)"
            />
          );
          offset += len;
          return el;
        })}
        <text x="70" y="66" textAnchor="middle" className="fill-navy" fontSize="18" fontWeight="700">
          {slices.reduce((sum, s) => sum + s.value, 0)}
        </text>
        <text x="70" y="84" textAnchor="middle" className="fill-ink/45" fontSize="10">
          orders
        </text>
      </svg>
      <ul className="min-w-0 space-y-2 text-sm">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-ink/70">
              <span className="size-2.5 rounded-full" style={{ background: slice.color }} />
              {slice.label}
            </span>
            <span className="font-semibold text-navy">{slice.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HorizontalBars({
  rows,
  className,
}: {
  rows: Array<{ label: string; value: number; hint?: string }>;
  className?: string;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className={cn('space-y-3', className)}>
      {rows.map((row, index) => (
        <li key={row.label}>
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium text-navy">{row.label}</span>
            <span className="shrink-0 text-ink/50">{row.hint ?? row.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-mist">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.max(6, (row.value / max) * 100)}%`,
                background: index === 0 ? TEAL : index === 1 ? NAVY : BRASS,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export { TEAL, NAVY, BRASS, MINT };
