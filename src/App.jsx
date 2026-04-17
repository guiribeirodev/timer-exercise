import { useState, useCallback } from 'react';
import ModeTabs from './components/ModeTabs';
import TimePicker from './components/TimePicker';
import TimerRing from './components/TimerRing';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import WorkoutBuilder from './components/WorkoutBuilder';
import WorkoutRunner from './components/WorkoutRunner';
import SavedWorkouts from './components/SavedWorkouts';
import { useTimer } from './hooks/useTimer';
import { useCycleTimer } from './hooks/useCycleTimer';
import { useAlarmSound } from './hooks/useAlarmSound';
import { useSavedWorkouts } from './hooks/useSavedWorkouts';

export default function App() {
  const [mode, setMode] = useState('timer'); // 'timer' | 'cycle'
  const [loadedWorkout, setLoadedWorkout] = useState(null); // {exercises, cycles} from a saved workout

  const playAlarm = useAlarmSound();

  // ── Simple timer ────────────────────────────
  const { remaining, status, progress, start, pause, resume, reset } = useTimer(playAlarm);

  const handleStart = useCallback((seconds) => {
    start(seconds);
  }, [start]);

  const isTimerActive = status !== 'idle';

  // ── Cycle timer ─────────────────────────────
  const cycle = useCycleTimer(playAlarm, playAlarm);

  const handleStartWorkout = useCallback((exercises, cycles) => {
    cycle.startWorkout(exercises, cycles);
  }, [cycle]);

  const isCycleActive = cycle.workoutStatus !== 'idle';

  // ── Saved workouts ──────────────────────────
  const { workouts, saveWorkout, deleteWorkout } = useSavedWorkouts();

  const handleLoadWorkout = useCallback((workout) => {
    setLoadedWorkout({ exercises: workout.exercises, cycles: workout.cycles });
  }, []);

  const handleSaveWorkout = useCallback((name, exercises, cycles) => {
    saveWorkout(name, exercises, cycles);
  }, [saveWorkout]);

  // Reset loaded workout when cycle stops (key forces remount of WorkoutBuilder)
  const builderKey = loadedWorkout
    ? `loaded-${JSON.stringify(loadedWorkout)}`
    : 'default';

  // Hide tabs when any timer is actively running
  const showTabs = !isTimerActive && !isCycleActive;

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Background ambient gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Header */}
        <header className="text-center mb-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-purple via-accent-indigo to-accent-cyan bg-clip-text text-transparent">
            Timer Exercise
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Temporizador para seus exercícios
          </p>
        </header>

        {/* Mode tabs (hidden when a timer is running) */}
        {showTabs && <ModeTabs mode={mode} onChangeMode={setMode} />}

        {/* ── Simple Timer mode ────────── */}
        {mode === 'timer' && (
          <>
            {!isTimerActive ? (
              <TimePicker onStart={handleStart} />
            ) : (
              <div className="flex flex-col items-center gap-8">
                <div className="relative flex items-center justify-center">
                  <TimerRing progress={progress} status={status} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <TimerDisplay seconds={remaining} status={status} />
                    {status === 'finished' && (
                      <p className="text-accent-rose text-sm font-medium mt-2 animate-pulse">
                        Tempo finalizado!
                      </p>
                    )}
                    {status === 'paused' && (
                      <p className="text-accent-amber text-sm font-medium mt-2 animate-pulse">
                        Pausado
                      </p>
                    )}
                  </div>
                </div>
                <TimerControls
                  status={status}
                  onPause={pause}
                  onResume={resume}
                  onReset={reset}
                />
              </div>
            )}
          </>
        )}

        {/* ── Cycle Workout mode ────────── */}
        {mode === 'cycle' && (
          <>
            {!isCycleActive ? (
              <div className="flex flex-col items-center gap-6 w-full max-w-md">
                <WorkoutBuilder
                  key={builderKey}
                  onStart={handleStartWorkout}
                  onSave={handleSaveWorkout}
                  initialExercises={loadedWorkout?.exercises}
                  initialCycles={loadedWorkout?.cycles}
                />
                <SavedWorkouts
                  workouts={workouts}
                  onLoad={handleLoadWorkout}
                  onDelete={deleteWorkout}
                />
              </div>
            ) : (
              <WorkoutRunner
                currentExercise={cycle.currentExercise}
                currentCycle={cycle.currentCycle}
                totalCycles={cycle.totalCycles}
                currentExIndex={cycle.currentExIndex}
                exercises={cycle.exercises}
                remaining={cycle.remaining}
                progress={cycle.progress}
                workoutStatus={cycle.workoutStatus}
                timerStatus={cycle.timerStatus}
                onPause={cycle.pauseWorkout}
                onResume={cycle.resumeWorkout}
                onStop={cycle.stopWorkout}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
