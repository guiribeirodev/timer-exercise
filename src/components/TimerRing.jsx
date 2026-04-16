import { useMemo } from 'react';

const SIZE = 280;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Circular SVG ring that shows timer progress.
 */
export default function TimerRing({ progress, status }) {
  const offset = CIRCUMFERENCE * (1 - progress);

  const gradientId = 'timer-gradient';

  const ringColor = useMemo(() => {
    if (status === 'finished') return '#fb7185'; // rose
    if (progress > 0.5) return 'url(#' + gradientId + ')';
    if (progress > 0.2) return '#fbbf24'; // amber
    return '#fb7185'; // rose
  }, [progress, status]);

  const glowOpacity = status === 'running' ? 0.3 : 0;

  return (
    <svg
      width={SIZE}
      height={SIZE}
      className="drop-shadow-lg"
      style={{ filter: status === 'finished' ? 'drop-shadow(0 0 20px rgba(251,113,133,0.5))' : undefined }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>

      {/* Background track */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke="#1e1e30"
        strokeWidth={STROKE}
      />

      {/* Glow layer */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={ringColor}
        strokeWidth={STROKE + 12}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        opacity={glowOpacity}
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        style={{
          transition: 'stroke-dashoffset 0.4s ease, opacity 0.3s ease',
          filter: 'blur(10px)',
        }}
      />

      {/* Progress arc */}
      <circle
        cx={SIZE / 2}
        cy={SIZE / 2}
        r={RADIUS}
        fill="none"
        stroke={ringColor}
        strokeWidth={STROKE}
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        style={{ transition: 'stroke-dashoffset 0.4s ease' }}
      />
    </svg>
  );
}
