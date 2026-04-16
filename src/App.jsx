import { useCallback } from 'react';
import TimePicker from './components/TimePicker';
import TimerRing from './components/TimerRing';
import TimerDisplay from './components/TimerDisplay';
import TimerControls from './components/TimerControls';
import { useTimer } from './hooks/useTimer';
import { useAlarmSound } from './hooks/useAlarmSound';

export default function App() {
  const playAlarm = useAlarmSound();
  const { remaining, status, progress, start, pause, resume, reset } = useTimer(playAlarm);

  const handleStart = useCallback((seconds) => {
    start(seconds);
  }, [start]);

  const isActive = status !== 'idle';

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

        {!isActive ? (
          /* ── Idle: show time picker ───────── */
          <TimePicker onStart={handleStart} />
        ) : (
          /* ── Active: show timer ──────────── */
          <div className="flex flex-col items-center gap-8">
            {/* Ring + display overlay */}
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

            {/* Controls */}
            <TimerControls
              status={status}
              onPause={pause}
              onResume={resume}
              onReset={reset}
            />
          </div>
        )}
      </div>
    </div>
  );
}
