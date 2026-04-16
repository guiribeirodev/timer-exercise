import { useState, useRef } from 'react';

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1 min', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2 min', seconds: 120 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
];

/**
 * Time picker: preset buttons + custom minute:second inputs.
 */
export default function TimePicker({ onStart }) {
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');
  const secRef = useRef(null);

  const handleCustomStart = () => {
    const total = (parseInt(customMin) || 0) * 60 + (parseInt(customSec) || 0);
    if (total > 0) onStart(total);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleCustomStart();
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md">
      {/* Section label */}
      <p className="text-text-secondary text-sm uppercase tracking-widest font-medium">
        Escolha o tempo
      </p>

      {/* Preset grid */}
      <div className="grid grid-cols-3 gap-3 w-full">
        {PRESETS.map(({ label, seconds }) => (
          <button
            key={seconds}
            id={`preset-${seconds}`}
            onClick={() => onStart(seconds)}
            className="
              group relative px-4 py-3.5 rounded-xl font-semibold text-sm
              bg-bg-elevated text-text-primary
              border border-white/5
              hover:border-accent-purple/40 hover:bg-accent-purple/10
              active:scale-95
              transition-all duration-200 cursor-pointer
              overflow-hidden
            "
          >
            {/* hover shine */}
            <span className="
              absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent
              translate-x-[-200%] group-hover:translate-x-[200%]
              transition-transform duration-700
            " />
            <span className="relative">{label}</span>
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 w-full">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-text-muted text-xs uppercase tracking-widest">ou</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Custom input */}
      <div className="flex items-center gap-3">
        <input
          id="custom-minutes"
          type="number"
          min="0"
          max="99"
          placeholder="min"
          value={customMin}
          onChange={(e) => {
            setCustomMin(e.target.value);
            if (e.target.value.length >= 2) secRef.current?.focus();
          }}
          onKeyDown={handleKeyDown}
          className="
            w-20 h-14 rounded-xl bg-bg-elevated border border-white/10
            text-center text-xl font-mono text-text-primary placeholder:text-text-muted
            focus:outline-none focus:border-accent-purple/60 focus:ring-2 focus:ring-accent-purple/20
            transition-all duration-200
          "
        />
        <span className="text-text-muted text-2xl font-light">:</span>
        <input
          id="custom-seconds"
          ref={secRef}
          type="number"
          min="0"
          max="59"
          placeholder="seg"
          value={customSec}
          onChange={(e) => setCustomSec(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            w-20 h-14 rounded-xl bg-bg-elevated border border-white/10
            text-center text-xl font-mono text-text-primary placeholder:text-text-muted
            focus:outline-none focus:border-accent-purple/60 focus:ring-2 focus:ring-accent-purple/20
            transition-all duration-200
          "
        />
        <button
          id="custom-start-btn"
          onClick={handleCustomStart}
          className="
            h-14 px-6 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-accent-purple to-accent-indigo
            text-white shadow-lg shadow-accent-purple/20
            hover:shadow-accent-purple/40 hover:scale-105
            active:scale-95
            transition-all duration-200 cursor-pointer
          "
        >
          Iniciar
        </button>
      </div>
    </div>
  );
}
