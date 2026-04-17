import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSavedWorkouts } from '../../hooks/useSavedWorkouts';

const STORAGE_KEY = 'timer-exercise:saved-workouts';

describe('useSavedWorkouts', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('inicia com array vazio quando localStorage está vazio', () => {
    const { result } = renderHook(() => useSavedWorkouts());
    expect(result.current.workouts).toEqual([]);
  });

  it('carrega treinos existentes do localStorage', () => {
    const saved = [
      { id: 'abc', name: 'Treino A', exercises: [{ name: 'Flexão', duration: 30 }], cycles: 2, createdAt: 1000 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const { result } = renderHook(() => useSavedWorkouts());
    expect(result.current.workouts).toEqual(saved);
  });

  it('saveWorkout adiciona treino e persiste no localStorage', () => {
    const { result } = renderHook(() => useSavedWorkouts());
    const exercises = [{ name: 'Flexão', duration: 30 }];

    act(() => {
      result.current.saveWorkout('Meu Treino', exercises, 3);
    });

    expect(result.current.workouts).toHaveLength(1);
    expect(result.current.workouts[0].name).toBe('Meu Treino');
    expect(result.current.workouts[0].exercises).toEqual(exercises);
    expect(result.current.workouts[0].cycles).toBe(3);
    expect(result.current.workouts[0].id).toBeTruthy();
    expect(result.current.workouts[0].createdAt).toBeTruthy();

    // Verifica localStorage
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0].name).toBe('Meu Treino');
  });

  it('novos treinos são adicionados no início da lista', () => {
    const { result } = renderHook(() => useSavedWorkouts());

    act(() => {
      result.current.saveWorkout('Treino 1', [{ name: 'A', duration: 10 }], 1);
    });
    act(() => {
      result.current.saveWorkout('Treino 2', [{ name: 'B', duration: 20 }], 2);
    });

    expect(result.current.workouts).toHaveLength(2);
    expect(result.current.workouts[0].name).toBe('Treino 2');
    expect(result.current.workouts[1].name).toBe('Treino 1');
  });

  it('deleteWorkout remove treino e atualiza localStorage', () => {
    const saved = [
      { id: 'a1', name: 'Treino A', exercises: [], cycles: 1, createdAt: 1000 },
      { id: 'b2', name: 'Treino B', exercises: [], cycles: 1, createdAt: 2000 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const { result } = renderHook(() => useSavedWorkouts());

    act(() => {
      result.current.deleteWorkout('a1');
    });

    expect(result.current.workouts).toHaveLength(1);
    expect(result.current.workouts[0].id).toBe('b2');

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
  });

  it('updateWorkout atualiza treino existente', () => {
    const saved = [
      { id: 'x1', name: 'Antigo', exercises: [{ name: 'A', duration: 10 }], cycles: 1, createdAt: 1000 },
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

    const { result } = renderHook(() => useSavedWorkouts());

    act(() => {
      result.current.updateWorkout('x1', 'Novo Nome', [{ name: 'B', duration: 20 }], 3);
    });

    expect(result.current.workouts[0].name).toBe('Novo Nome');
    expect(result.current.workouts[0].exercises).toEqual([{ name: 'B', duration: 20 }]);
    expect(result.current.workouts[0].cycles).toBe(3);
  });

  it('lida com JSON inválido no localStorage', () => {
    localStorage.setItem(STORAGE_KEY, 'not-json');

    const { result } = renderHook(() => useSavedWorkouts());
    expect(result.current.workouts).toEqual([]);
  });

  it('lida com dados não-array no localStorage', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'array' }));

    const { result } = renderHook(() => useSavedWorkouts());
    expect(result.current.workouts).toEqual([]);
  });

  it('saveWorkout faz trim no nome', () => {
    const { result } = renderHook(() => useSavedWorkouts());

    act(() => {
      result.current.saveWorkout('  Meu Treino  ', [{ name: 'A', duration: 10 }], 1);
    });

    expect(result.current.workouts[0].name).toBe('Meu Treino');
  });
});
