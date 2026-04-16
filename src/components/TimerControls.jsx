/**
 * Control buttons for the active timer: pause/resume & reset.
 */
export default function TimerControls({ status, onPause, onResume, onReset }) {
  return (
    <div className="flex items-center gap-4">
      {/* Pause / Resume */}
      {(status === 'running' || status === 'paused') && (
        <button
          id="pause-resume-btn"
          onClick={status === 'running' ? onPause : onResume}
          className="
            group relative h-14 px-8 rounded-xl font-semibold text-sm
            bg-bg-elevated border border-white/10
            text-text-primary
            hover:border-accent-cyan/40 hover:bg-accent-cyan/10
            active:scale-95
            transition-all duration-200 cursor-pointer
          "
        >
          {status === 'running' ? (
            <span className="flex items-center gap-2">
              <PauseIcon /> Pausar
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <PlayIcon /> Continuar
            </span>
          )}
        </button>
      )}

      {/* Reset */}
      <button
        id="reset-btn"
        onClick={onReset}
        className="
          h-14 px-8 rounded-xl font-semibold text-sm
          bg-bg-elevated border border-white/10
          text-text-secondary
          hover:border-accent-rose/40 hover:bg-accent-rose/10 hover:text-accent-rose
          active:scale-95
          transition-all duration-200 cursor-pointer
        "
      >
        <span className="flex items-center gap-2">
          <ResetIcon /> {status === 'finished' ? 'Novo Timer' : 'Resetar'}
        </span>
      </button>
    </div>
  );
}

/* ── Inline SVG icons ─────────────────────── */

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" rx="1" />
      <rect x="14" y="4" width="4" height="16" rx="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
