import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for countdown timer logic.
 * @param {Function} onFinish - called when timer reaches 0
 * @returns timer state & controls
 */
export function useTimer(onFinish) {
  const [totalSeconds, setTotalSeconds] = useState(0);   // total chosen
  const [remaining, setRemaining] = useState(0);          // seconds left
  const [status, setStatus] = useState('idle');            // idle | running | paused | finished
  const intervalRef = useRef(null);
  const endTimeRef = useRef(null);
  const onFinishRef = useRef(onFinish);

  // Keep ref in sync so tick always calls the latest callback
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    const left = Math.round((endTimeRef.current - Date.now()) / 1000);
    if (left <= 0) {
      setRemaining(0);
      setStatus('finished');
      clearTimer();
      onFinishRef.current?.();
    } else {
      setRemaining(left);
    }
  }, [clearTimer]);

  const start = useCallback((seconds) => {
    clearTimer();
    setTotalSeconds(seconds);
    setRemaining(seconds);
    endTimeRef.current = Date.now() + seconds * 1000;
    setStatus('running');
    intervalRef.current = setInterval(tick, 200); // 200ms for smoother UX
  }, [clearTimer, tick]);

  const resume = useCallback(() => {
    if (status !== 'paused') return;
    clearTimer();
    endTimeRef.current = Date.now() + remaining * 1000;
    setStatus('running');
    intervalRef.current = setInterval(tick, 200);
  }, [status, remaining, clearTimer, tick]);

  const pause = useCallback(() => {
    if (status !== 'running') return;
    clearTimer();
    setStatus('paused');
  }, [status, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setRemaining(0);
    setTotalSeconds(0);
    setStatus('idle');
  }, [clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  const progress = totalSeconds > 0 ? remaining / totalSeconds : 1;

  return { remaining, totalSeconds, status, progress, start, pause, resume, reset };
}
