import { useState, useCallback } from 'react';

const STORAGE_KEY = 'timer-exercise:saved-workouts';

/**
 * Manages saved workouts in localStorage.
 * Each workout has: { id, name, exercises: [{name, duration}], cycles, createdAt }
 */
export function useSavedWorkouts() {
  const [workouts, setWorkouts] = useState(() => loadFromStorage());

  const saveWorkout = useCallback((name, exercises, cycles) => {
    const workout = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(),
      exercises,
      cycles,
      createdAt: Date.now(),
    };
    setWorkouts((prev) => {
      const next = [workout, ...prev];
      persistToStorage(next);
      return next;
    });
    return workout;
  }, []);

  const deleteWorkout = useCallback((id) => {
    setWorkouts((prev) => {
      const next = prev.filter((w) => w.id !== id);
      persistToStorage(next);
      return next;
    });
  }, []);

  const updateWorkout = useCallback((id, name, exercises, cycles) => {
    setWorkouts((prev) => {
      const next = prev.map((w) =>
        w.id === id ? { ...w, name: name.trim(), exercises, cycles } : w
      );
      persistToStorage(next);
      return next;
    });
  }, []);

  return { workouts, saveWorkout, deleteWorkout, updateWorkout };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistToStorage(workouts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workouts));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}
