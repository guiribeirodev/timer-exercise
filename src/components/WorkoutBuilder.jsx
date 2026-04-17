import { useState, useRef } from 'react';

const DURATION_PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1 min', seconds: 60 },
  { label: '1:30', seconds: 90 },
  { label: '2 min', seconds: 120 },
];

const CYCLE_OPTIONS = [1, 2, 3, 4, 5];

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}min`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * UI to build a workout: add exercises with name + duration, set cycles, start.
 * Supports saving/loading workouts.
 */
export default function WorkoutBuilder({ onStart, onSave, initialExercises, initialCycles }) {
  const [exercises, setExercises] = useState(initialExercises || []);
  const [cycles, setCycles] = useState(initialCycles || 1);
  const [name, setName] = useState('');
  const [durMin, setDurMin] = useState('');
  const [durSec, setDurSec] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [workoutName, setWorkoutName] = useState('');
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const nameRef = useRef(null);

  const getDuration = () => {
    if (selectedPreset) return selectedPreset;
    return (parseInt(durMin) || 0) * 60 + (parseInt(durSec) || 0);
  };

  const addExercise = () => {
    const duration = getDuration();
    if (!name.trim() || duration <= 0) return;
    setExercises((prev) => [...prev, { name: name.trim(), duration }]);
    setName('');
    setDurMin('');
    setDurSec('');
    setSelectedPreset(null);
    nameRef.current?.focus();
  };

  const removeExercise = (index) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addExercise();
  };

  const handleStart = () => {
    if (exercises.length === 0) return;
    onStart(exercises, cycles);
  };

  const handleSave = () => {
    if (!workoutName.trim() || exercises.length === 0) return;
    onSave?.(workoutName.trim(), exercises, cycles);
    setWorkoutName('');
    setShowSaveForm(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <p className="text-text-secondary text-sm uppercase tracking-widest font-medium">
        Monte seu treino
      </p>

      {/* Exercise list */}
      {exercises.length > 0 && (
        <div className="w-full flex flex-col gap-2" id="exercise-list">
          {exercises.map((ex, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-elevated border border-white/5 group"
            >
              <span className="text-accent-purple font-bold text-sm min-w-6">{i + 1}.</span>
              <span className="flex-1 text-text-primary text-sm font-medium truncate">{ex.name}</span>
              <span className="text-text-secondary text-sm font-mono">{formatDuration(ex.duration)}</span>
              <button
                onClick={() => removeExercise(i)}
                className="
                  opacity-0 group-hover:opacity-100 text-text-muted hover:text-accent-rose
                  transition-all duration-200 cursor-pointer text-lg leading-none
                "
                aria-label={`Remover ${ex.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add exercise form */}
      <div className="w-full flex flex-col gap-3 p-4 rounded-xl bg-bg-card border border-white/5">
        <input
          id="exercise-name"
          ref={nameRef}
          type="text"
          placeholder="Nome do exercício"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="
            w-full h-12 px-4 rounded-lg bg-bg-elevated border border-white/10
            text-sm text-text-primary placeholder:text-text-muted
            focus:outline-none focus:border-accent-purple/60 focus:ring-2 focus:ring-accent-purple/20
            transition-all duration-200
          "
        />

        {/* Duration presets */}
        <div className="flex gap-2">
          {DURATION_PRESETS.map(({ label, seconds }) => (
            <button
              key={seconds}
              onClick={() => {
                setSelectedPreset(seconds);
                setDurMin('');
                setDurSec('');
              }}
              className={`
                flex-1 py-2 rounded-lg text-xs font-semibold cursor-pointer
                transition-all duration-200 border
                ${selectedPreset === seconds
                  ? 'bg-accent-purple/20 border-accent-purple/40 text-accent-purple'
                  : 'bg-bg-elevated border-white/5 text-text-secondary hover:border-accent-purple/30'
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Custom duration */}
        <div className="flex items-center gap-2">
          <span className="text-text-muted text-xs">Ou:</span>
          <input
            id="exercise-dur-min"
            type="number"
            min="0"
            max="99"
            placeholder="min"
            value={durMin}
            onChange={(e) => { setDurMin(e.target.value); setSelectedPreset(null); }}
            onKeyDown={handleKeyDown}
            className="
              w-16 h-10 rounded-lg bg-bg-elevated border border-white/10
              text-center text-sm font-mono text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-accent-purple/60 focus:ring-2 focus:ring-accent-purple/20
              transition-all duration-200
            "
          />
          <span className="text-text-muted">:</span>
          <input
            id="exercise-dur-sec"
            type="number"
            min="0"
            max="59"
            placeholder="seg"
            value={durSec}
            onChange={(e) => { setDurSec(e.target.value); setSelectedPreset(null); }}
            onKeyDown={handleKeyDown}
            className="
              w-16 h-10 rounded-lg bg-bg-elevated border border-white/10
              text-center text-sm font-mono text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-accent-purple/60 focus:ring-2 focus:ring-accent-purple/20
              transition-all duration-200
            "
          />
          <button
            id="add-exercise-btn"
            onClick={addExercise}
            className="
              h-10 px-4 rounded-lg font-semibold text-xs
              bg-accent-purple/20 text-accent-purple border border-accent-purple/30
              hover:bg-accent-purple/30 active:scale-95
              transition-all duration-200 cursor-pointer
            "
          >
            + Adicionar
          </button>
        </div>
      </div>

      {/* Cycles selector */}
      {exercises.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          <p className="text-text-secondary text-xs uppercase tracking-widest font-medium text-center">
            Número de ciclos
          </p>
          <div className="flex justify-center gap-2">
            {CYCLE_OPTIONS.map((n) => (
              <button
                key={n}
                id={`cycle-${n}`}
                onClick={() => setCycles(n)}
                className={`
                  w-11 h-11 rounded-lg font-bold text-sm cursor-pointer
                  transition-all duration-200 border
                  ${cycles === n
                    ? 'bg-gradient-to-r from-accent-purple to-accent-indigo text-white border-transparent shadow-lg shadow-accent-purple/20'
                    : 'bg-bg-elevated border-white/5 text-text-secondary hover:border-accent-purple/30'
                  }
                `}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      {exercises.length > 0 && (
        <div className="w-full flex flex-col gap-3">
          {/* Start button */}
          <button
            id="start-workout-btn"
            onClick={handleStart}
            className="
              w-full h-14 rounded-xl font-semibold text-sm
              bg-gradient-to-r from-accent-purple to-accent-indigo
              text-white shadow-lg shadow-accent-purple/20
              hover:shadow-accent-purple/40 hover:scale-[1.02]
              active:scale-95
              transition-all duration-200 cursor-pointer
            "
          >
            Iniciar Treino — {exercises.length} exercício{exercises.length > 1 ? 's' : ''} × {cycles} ciclo{cycles > 1 ? 's' : ''}
          </button>

          {/* Save / Success feedback */}
          {saveSuccess ? (
            <p className="text-accent-green text-sm font-medium text-center animate-pulse">
              ✓ Treino salvo!
            </p>
          ) : !showSaveForm ? (
            <button
              id="show-save-btn"
              onClick={() => setShowSaveForm(true)}
              className="
                w-full h-10 rounded-xl font-semibold text-xs
                bg-bg-elevated border border-white/10 text-text-secondary
                hover:border-accent-cyan/30 hover:text-accent-cyan
                active:scale-95
                transition-all duration-200 cursor-pointer
              "
            >
              💾 Salvar treino
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                id="workout-name-input"
                type="text"
                placeholder="Nome do treino"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                autoFocus
                className="
                  flex-1 h-10 px-3 rounded-lg bg-bg-elevated border border-white/10
                  text-sm text-text-primary placeholder:text-text-muted
                  focus:outline-none focus:border-accent-cyan/60 focus:ring-2 focus:ring-accent-cyan/20
                  transition-all duration-200
                "
              />
              <button
                id="confirm-save-btn"
                onClick={handleSave}
                className="
                  h-10 px-4 rounded-lg font-semibold text-xs
                  bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30
                  hover:bg-accent-cyan/30 active:scale-95
                  transition-all duration-200 cursor-pointer
                "
              >
                Salvar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
