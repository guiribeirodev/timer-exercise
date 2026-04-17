function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}min`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function totalTime(exercises, cycles) {
  const singleCycle = exercises.reduce((sum, ex) => sum + ex.duration, 0);
  return formatDuration(singleCycle * cycles);
}

/**
 * Displays saved workouts as cards with load and delete actions.
 */
export default function SavedWorkouts({ workouts, onLoad, onDelete }) {
  if (workouts.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center gap-4 w-full">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-text-muted text-xs uppercase tracking-widest">Treinos salvos</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="flex flex-col gap-2" id="saved-workouts-list">
        {workouts.map((w) => (
          <div
            key={w.id}
            className="
              flex items-center gap-3 px-4 py-3 rounded-xl
              bg-bg-elevated border border-white/5 group
              hover:border-accent-purple/20 transition-all duration-200
            "
          >
            <div className="flex-1 min-w-0">
              <p className="text-text-primary text-sm font-semibold truncate">{w.name}</p>
              <p className="text-text-muted text-xs mt-0.5">
                {w.exercises.length} exercício{w.exercises.length > 1 ? 's' : ''} × {w.cycles} ciclo{w.cycles > 1 ? 's' : ''} · {totalTime(w.exercises, w.cycles)}
              </p>
            </div>

            <button
              onClick={() => onLoad(w)}
              className="
                px-3 py-1.5 rounded-lg text-xs font-semibold
                bg-accent-purple/15 text-accent-purple border border-accent-purple/20
                hover:bg-accent-purple/25 active:scale-95
                transition-all duration-200 cursor-pointer
              "
            >
              Carregar
            </button>

            <button
              onClick={() => onDelete(w.id)}
              aria-label={`Excluir ${w.name}`}
              className="
                opacity-0 group-hover:opacity-100
                text-text-muted hover:text-accent-rose
                transition-all duration-200 cursor-pointer text-lg leading-none
              "
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
