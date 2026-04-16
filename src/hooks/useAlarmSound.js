import { useCallback, useRef } from 'react';

/**
 * Generates a pleasant alarm sound using Web Audio API.
 * No external audio files needed.
 */
export function useAlarmSound() {
  const ctxRef = useRef(null);

  const play = useCallback(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;

    // Play a sequence of 3 short beeps at ascending frequencies
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
    const now = ctx.currentTime;

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now + i * 0.22);
      gain.gain.linearRampToValueAtTime(0.35, now + i * 0.22 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.22);
      osc.stop(now + i * 0.22 + 0.25);
    });

    // Second round (repeat) after a short gap
    const gap = 0.9;
    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + gap);

      gain.gain.setValueAtTime(0, now + gap + i * 0.22);
      gain.gain.linearRampToValueAtTime(0.35, now + gap + i * 0.22 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + gap + i * 0.22 + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + gap + i * 0.22);
      osc.stop(now + gap + i * 0.22 + 0.25);
    });
  }, []);

  return play;
}
