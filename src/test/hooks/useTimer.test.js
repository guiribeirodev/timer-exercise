import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimer } from '../../hooks/useTimer';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia com status idle e remaining 0', () => {
    const { result } = renderHook(() => useTimer());

    expect(result.current.status).toBe('idle');
    expect(result.current.remaining).toBe(0);
    expect(result.current.totalSeconds).toBe(0);
    expect(result.current.progress).toBe(1);
  });

  it('transiciona para running ao chamar start', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start(60);
    });

    expect(result.current.status).toBe('running');
    expect(result.current.remaining).toBe(60);
    expect(result.current.totalSeconds).toBe(60);
  });

  it('decrementa remaining conforme o tempo avança', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start(10);
    });

    // Avança 3 segundos (o tick roda a cada 200ms)
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.remaining).toBe(7);
    expect(result.current.status).toBe('running');
  });

  it('pausa o timer corretamente', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start(30);
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.status).toBe('paused');
    const remainingAtPause = result.current.remaining;

    // Avança mais tempo — remaining NÃO deve mudar
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.remaining).toBe(remainingAtPause);
    expect(result.current.status).toBe('paused');
  });

  it('retoma o timer corretamente após pause', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start(30);
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    act(() => {
      result.current.pause();
    });

    const remainingAtPause = result.current.remaining;

    act(() => {
      result.current.resume();
    });

    expect(result.current.status).toBe('running');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.remaining).toBe(remainingAtPause - 3);
  });

  it('finaliza e chama onFinish quando o tempo acaba', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() => useTimer(onFinish));

    act(() => {
      result.current.start(5);
    });

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(result.current.status).toBe('finished');
    expect(result.current.remaining).toBe(0);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('reset volta ao estado idle', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start(60);
    });

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.remaining).toBe(0);
    expect(result.current.totalSeconds).toBe(0);
  });

  it('pause é no-op se o status não for running', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.pause();
    });

    expect(result.current.status).toBe('idle');
  });

  it('resume é no-op se o status não for paused', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start(30);
    });

    act(() => {
      result.current.resume(); // status é running, não paused
    });

    expect(result.current.status).toBe('running');
  });

  it('calcula progress corretamente', () => {
    const { result } = renderHook(() => useTimer());

    act(() => {
      result.current.start(100);
    });

    // No início: remaining = 100, total = 100 → progress = 1
    expect(result.current.progress).toBe(1);

    act(() => {
      vi.advanceTimersByTime(50000);
    });

    // Metade: remaining = 50, total = 100 → progress = 0.5
    expect(result.current.progress).toBe(0.5);
  });

  it('pode iniciar um novo timer após o anterior finalizar', () => {
    const onFinish = vi.fn();
    const { result } = renderHook(() => useTimer(onFinish));

    act(() => {
      result.current.start(3);
    });

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(result.current.status).toBe('finished');
    expect(onFinish).toHaveBeenCalledTimes(1);

    // Inicia novo timer
    act(() => {
      result.current.start(10);
    });

    expect(result.current.status).toBe('running');
    expect(result.current.remaining).toBe(10);
    expect(result.current.totalSeconds).toBe(10);
  });

  it('limpa o interval ao desmontar', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { result, unmount } = renderHook(() => useTimer());

    act(() => {
      result.current.start(60);
    });

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
