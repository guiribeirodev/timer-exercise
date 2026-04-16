/**
 * Formats seconds into MM:SS display string.
 */
export default function TimerDisplay({ seconds, status }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div
      className={`
        font-mono text-7xl font-bold tracking-wider select-none
        transition-colors duration-300
        ${status === 'finished' ? 'text-accent-rose animate-shake' : 'text-text-primary'}
      `}
    >
      {display}
    </div>
  );
}
