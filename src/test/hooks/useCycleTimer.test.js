import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCycleTimer } from '../../hooks/useCycleTimer';

const EXERCISES = [
  { name: 'Flexão', duration: 5 },
  { name: 'Agachamento', duration: 3 },
  { name: 'Prancha', duration: 4 },
];

describe('useCycleTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia com workoutStatus idle', () => {
    const { result } = renderHook(() => useCycleTimer());
    expect(result.current.workoutStatus).toBe('idle');
    expect(result.current.exercises).toEqual([]);
    expect(result.current.currentCycle).toBe(0);
    expect(result.current.currentExIndex).toBe(0);
  });

  it('startWorkout configura exercícios e ciclos e inicia o timer', () => {
    const { result } = renderHook(() => useCycleTimer());

    act(() => {
      result.current.startWorkout(EXERCISES, 2);
    });

    expect(result.current.workoutStatus).toBe('running');
    expect(result.current.exercises).toEqual(EXERCISES);
    expect(result.current.totalCycles).toBe(2);
    expect(result.current.currentCycle).toBe(0);
    expect(result.current.currentExIndex).toBe(0);
    expect(result.current.currentExercise).toEqual(EXERCISES[0]);
    expect(result.current.remaining).toBe(5);
  });

  it('não inicia se exercises estiver vazio', () => {
    const { result } = renderHook(() => useCycleTimer());

    act(() => {
      result.current.startWorkout([], 1);
    });

    expect(result.current.workoutStatus).toBe('idle');
  });

  it('avança para o próximo exercício ao finalizar o atual', () => {
    const onExFinish = vi.fn();
    const { result } = renderHook(() => useCycleTimer(onExFinish));

    act(() => {
      result.current.startWorkout(EXERCISES, 1);
    });

    // Finaliza o primeiro exercício (5s)
    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(onExFinish).toHaveBeenCalledTimes(1);
    expect(result.current.currentExIndex).toBe(1);
    expect(result.current.currentExercise).toEqual(EXERCISES[1]);
    // O remaining é <= duração do 2o exercício (algum tempo já passou no tick que disparou a transição)
    expect(result.current.remaining).toBeGreaterThan(0);
    expect(result.current.remaining).toBeLessThanOrEqual(3);
    expect(result.current.workoutStatus).toBe('running');
  });

  it('avança para o próximo ciclo ao terminar todos os exercícios', () => {
    const onExFinish = vi.fn();
    const { result } = renderHook(() => useCycleTimer(onExFinish));

    act(() => {
      result.current.startWorkout(EXERCISES, 2);
    });

    // Finaliza exercício 1 (5s)
    act(() => { vi.advanceTimersByTime(5500); });
    // Finaliza exercício 2 (3s)
    act(() => { vi.advanceTimersByTime(3500); });
    // Finaliza exercício 3 (4s) → deve avançar para ciclo 2
    act(() => { vi.advanceTimersByTime(4500); });

    expect(result.current.currentCycle).toBe(1);
    expect(result.current.currentExIndex).toBe(0);
    expect(result.current.currentExercise).toEqual(EXERCISES[0]);
    expect(result.current.workoutStatus).toBe('running');
    expect(onExFinish).toHaveBeenCalledTimes(3);
  });

  it('finaliza o treino ao completar todos os ciclos', () => {
    const onExFinish = vi.fn();
    const onWorkoutFinish = vi.fn();
    const { result } = renderHook(() => useCycleTimer(onExFinish, onWorkoutFinish));

    act(() => {
      result.current.startWorkout(EXERCISES, 1);
    });

    // Finaliza todos: 5s + 3s + 4s
    act(() => { vi.advanceTimersByTime(5500); }); // ex1 done
    act(() => { vi.advanceTimersByTime(3500); }); // ex2 done
    act(() => { vi.advanceTimersByTime(4500); }); // ex3 done → workout done

    expect(result.current.workoutStatus).toBe('finished');
    expect(onWorkoutFinish).toHaveBeenCalledTimes(1);
    expect(onExFinish).toHaveBeenCalledTimes(3);
  });

  it('pausa e retoma o treino', () => {
    const { result } = renderHook(() => useCycleTimer());

    act(() => {
      result.current.startWorkout(EXERCISES, 1);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.pauseWorkout();
    });

    expect(result.current.workoutStatus).toBe('paused');
    const remainingAtPause = result.current.remaining;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Remaining não muda durante pausa
    expect(result.current.remaining).toBe(remainingAtPause);

    act(() => {
      result.current.resumeWorkout();
    });

    expect(result.current.workoutStatus).toBe('running');
  });

  it('stopWorkout reseta tudo para idle', () => {
    const { result } = renderHook(() => useCycleTimer());

    act(() => {
      result.current.startWorkout(EXERCISES, 2);
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.stopWorkout();
    });

    expect(result.current.workoutStatus).toBe('idle');
    expect(result.current.exercises).toEqual([]);
    expect(result.current.currentCycle).toBe(0);
    expect(result.current.currentExIndex).toBe(0);
  });

  it('pauseWorkout é no-op se não estiver running', () => {
    const { result } = renderHook(() => useCycleTimer());

    act(() => {
      result.current.pauseWorkout();
    });

    expect(result.current.workoutStatus).toBe('idle');
  });

  it('resumeWorkout é no-op se não estiver paused', () => {
    const { result } = renderHook(() => useCycleTimer());

    act(() => {
      result.current.startWorkout(EXERCISES, 1);
    });

    act(() => {
      result.current.resumeWorkout();
    });

    expect(result.current.workoutStatus).toBe('running');
  });

  it('calcula overallProgress corretamente', () => {
    const { result } = renderHook(() => useCycleTimer());

    act(() => {
      result.current.startWorkout(EXERCISES, 2);
    });

    // 3 exercises × 2 cycles = 6 total. Currently at exercise 0, cycle 0 → 0/6
    expect(result.current.overallProgress).toBe(0);

    // Complete first exercise
    act(() => { vi.advanceTimersByTime(5500); });
    // Now at exercise 1, cycle 0 → 1/6
    expect(result.current.overallProgress).toBeCloseTo(1 / 6, 5);
  });

  it('2 ciclos completos com 2 exercícios', () => {
    const onWorkoutFinish = vi.fn();
    const exercises = [
      { name: 'A', duration: 3 },
      { name: 'B', duration: 2 },
    ];
    const { result } = renderHook(() => useCycleTimer(vi.fn(), onWorkoutFinish));

    act(() => {
      result.current.startWorkout(exercises, 2);
    });

    // Ciclo 1: A(3s), B(2s)
    act(() => { vi.advanceTimersByTime(3500); }); // A done
    expect(result.current.currentExIndex).toBe(1);

    act(() => { vi.advanceTimersByTime(2500); }); // B done → ciclo 2
    expect(result.current.currentCycle).toBe(1);
    expect(result.current.currentExIndex).toBe(0);

    // Ciclo 2: A(3s), B(2s)
    act(() => { vi.advanceTimersByTime(3500); }); // A done
    act(() => { vi.advanceTimersByTime(2500); }); // B done → finished

    expect(result.current.workoutStatus).toBe('finished');
    expect(onWorkoutFinish).toHaveBeenCalledTimes(1);
  });
});
