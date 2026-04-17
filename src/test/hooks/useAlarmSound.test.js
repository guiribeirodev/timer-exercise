import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAlarmSound } from '../../hooks/useAlarmSound';

describe('useAlarmSound', () => {
  it('retorna uma função', () => {
    const { result } = renderHook(() => useAlarmSound());
    expect(typeof result.current).toBe('function');
  });

  it('cria AudioContext e chama createOscillator ao tocar', () => {
    const createOscSpy = vi.fn(() => ({
      type: '',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }));
    const createGainSpy = vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }));

    const OriginalAC = globalThis.AudioContext;
    globalThis.AudioContext = class {
      constructor() {
        this.currentTime = 0;
        this.destination = {};
        this.createOscillator = createOscSpy;
        this.createGain = createGainSpy;
      }
    };

    const { result } = renderHook(() => useAlarmSound());

    act(() => {
      result.current();
    });

    // 6 osciladores: 3 primeira rodada + 3 segunda rodada
    expect(createOscSpy).toHaveBeenCalledTimes(6);
    expect(createGainSpy).toHaveBeenCalledTimes(6);

    globalThis.AudioContext = OriginalAC;
  });

  it('reutiliza o mesmo AudioContext em chamadas subsequentes', () => {
    let instanceCount = 0;

    const OriginalAC = globalThis.AudioContext;
    globalThis.AudioContext = class {
      constructor() {
        instanceCount++;
        this.currentTime = 0;
        this.destination = {};
        this.createOscillator = () => ({
          type: '',
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        });
        this.createGain = () => ({
          gain: {
            setValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        });
      }
    };

    const { result } = renderHook(() => useAlarmSound());

    act(() => {
      result.current();
    });
    act(() => {
      result.current();
    });

    expect(instanceCount).toBe(1);

    globalThis.AudioContext = OriginalAC;
  });

  it('não falha se AudioContext não estiver disponível', () => {
    const original = globalThis.AudioContext;
    delete globalThis.AudioContext;

    const { result } = renderHook(() => useAlarmSound());

    expect(() => {
      act(() => {
        result.current();
      });
    }).not.toThrow();

    globalThis.AudioContext = original;
  });
});
