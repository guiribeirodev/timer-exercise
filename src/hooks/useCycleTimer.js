import { useState, useRef, useCallback } from 'react';
import { useTimer } from './useTimer';

/**
 * Manages a workout composed of multiple exercises repeated over cycles.
 * Composes useTimer internally for the countdown of each exercise.
 *
 * @param {Function} onExerciseFinish - called after each exercise ends
 * @param {Function} onWorkoutFinish  - called when the entire workout ends
 */
export function useCycleTimer(onExerciseFinish, onWorkoutFinish) {
  const [exercises, setExercises] = useState([]);
  const [totalCycles, setTotalCycles] = useState(1);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [workoutStatus, setWorkoutStatus] = useState('idle'); // idle | running | paused | finished

  // Refs to avoid stale closures inside handleTimerFinish
  const exercisesRef = useRef([]);
  const totalCyclesRef = useRef(1);
  const currentCycleRef = useRef(0);
  const currentExIndexRef = useRef(0);
  const timerStartRef = useRef(null);

  const handleTimerFinish = useCallback(() => {
    onExerciseFinish?.();

    const exIdx = currentExIndexRef.current;
    const cycleIdx = currentCycleRef.current;
    const exs = exercisesRef.current;
    const cycles = totalCyclesRef.current;

    if (exIdx + 1 < exs.length) {
      // Next exercise in same cycle
      const next = exIdx + 1;
      currentExIndexRef.current = next;
      setCurrentExIndex(next);
      timerStartRef.current?.(exs[next].duration);
    } else if (cycleIdx + 1 < cycles) {
      // Next cycle
      const nextCycle = cycleIdx + 1;
      currentCycleRef.current = nextCycle;
      currentExIndexRef.current = 0;
      setCurrentCycle(nextCycle);
      setCurrentExIndex(0);
      timerStartRef.current?.(exs[0].duration);
    } else {
      // Workout complete
      setWorkoutStatus('finished');
      onWorkoutFinish?.();
    }
  }, [onExerciseFinish, onWorkoutFinish]);

  const timer = useTimer(handleTimerFinish);
  timerStartRef.current = timer.start;

  const startWorkout = useCallback((exs, cycles) => {
    if (!exs || exs.length === 0) return;
    exercisesRef.current = exs;
    totalCyclesRef.current = cycles;
    setExercises(exs);
    setTotalCycles(cycles);
    setCurrentCycle(0);
    setCurrentExIndex(0);
    currentCycleRef.current = 0;
    currentExIndexRef.current = 0;
    setWorkoutStatus('running');
    timer.start(exs[0].duration);
  }, [timer]);

  const pauseWorkout = useCallback(() => {
    if (workoutStatus !== 'running') return;
    timer.pause();
    setWorkoutStatus('paused');
  }, [timer, workoutStatus]);

  const resumeWorkout = useCallback(() => {
    if (workoutStatus !== 'paused') return;
    timer.resume();
    setWorkoutStatus('running');
  }, [timer, workoutStatus]);

  const stopWorkout = useCallback(() => {
    timer.reset();
    setWorkoutStatus('idle');
    setExercises([]);
    setTotalCycles(1);
    setCurrentCycle(0);
    setCurrentExIndex(0);
    currentCycleRef.current = 0;
    currentExIndexRef.current = 0;
  }, [timer]);

  const currentExercise = exercises[currentExIndex] || null;
  const totalExercisesInWorkout = exercises.length * totalCycles;
  const completedExercises = currentCycle * exercises.length + currentExIndex;
  const overallProgress = totalExercisesInWorkout > 0
    ? completedExercises / totalExercisesInWorkout
    : 0;

  return {
    // Current exercise timer
    remaining: timer.remaining,
    progress: timer.progress,
    timerStatus: timer.status,

    // Cycle state
    exercises,
    totalCycles,
    currentCycle,
    currentExIndex,
    currentExercise,
    workoutStatus,
    overallProgress,

    // Controls
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    stopWorkout,
  };
}
