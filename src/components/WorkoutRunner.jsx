import TimerRing from './TimerRing';
import TimerDisplay from './TimerDisplay';

/**
 * Active workout view: exercise info, cycle progress, timer ring, controls.
 */
export default function WorkoutRunner({
  currentExercise,
  currentCycle,
  totalCycles,
  currentExIndex,
  exercises,
  remaining,
  progress,
  workoutStatus,
  timerStatus,
  onPause,
  onResume,
  onStop,
}) {
  const isFinished = workoutStatus === 'finished';
  const isPaused = workoutStatus === 'paused';
  const displayStatus = isFinished ? 'finished' : isPaused ? 'paused' : timerStatus;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress info */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-accent-purple/15 text-accent-purple text-xs font-semibold">
            Ciclo {currentCycle + 1}/{totalCycles}
          </span>
          <span className="px-3 py-1 rounded-full bg-accent-indigo/15 text-accent-indigo text-xs font-semibold">
            Exercício {currentExIndex + 1}/{exercises.length}
          </span>
        </div>
        {currentExercise && !isFinished && (
          <h2 className="text-xl font-bold text-text-primary mt-2">{currentExercise.name}</h2>
        )}
        {isFinished && (
          <h2 className="text-xl font-bold text-accent-green mt-2">Treino Finalizado! 🎉</h2>
        )}
      </div>

      {/* Timer ring + display */}
      <div className="relative flex items-center justify-center">
        <TimerRing progress={isFinished ? 0 : progress} status={displayStatus} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <TimerDisplay seconds={remaining} status={displayStatus} />
          {isPaused && (
            <p className="text-accent-amber text-sm font-medium mt-2 animate-pulse">Pausado</p>
          )}
        </div>
      </div>

      {/* Exercise dots */}
      {exercises.length > 1 && (
        <div className="flex items-center gap-1.5">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={`
                w-2.5 h-2.5 rounded-full transition-all duration-300
                ${i < currentExIndex
                  ? 'bg-accent-green'
                  : i === currentExIndex
                    ? 'bg-accent-purple scale-125'
                    : 'bg-bg-elevated border border-white/10'
                }
              `}
            />
          ))}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isFinished && (
          <button
            id="workout-pause-btn"
            onClick={isPaused ? onResume : onPause}
            className="
              h-14 px-8 rounded-xl font-semibold text-sm
              bg-bg-elevated border border-white/10 text-text-primary
              hover:border-accent-cyan/40 hover:bg-accent-cyan/10
              active:scale-95 transition-all duration-200 cursor-pointer
            "
          >
            {isPaused ? '▶ Continuar' : '⏸ Pausar'}
          </button>
        )}
        <button
          id="workout-stop-btn"
          onClick={onStop}
          className="
            h-14 px-8 rounded-xl font-semibold text-sm
            bg-bg-elevated border border-white/10 text-text-secondary
            hover:border-accent-rose/40 hover:bg-accent-rose/10 hover:text-accent-rose
            active:scale-95 transition-all duration-200 cursor-pointer
          "
        >
          {isFinished ? '🔄 Novo Treino' : '⏹ Parar Treino'}
        </button>
      </div>
    </div>
  );
}
