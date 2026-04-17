/**
 * Tab switcher between simple timer and cycle workout modes.
 */
export default function ModeTabs({ mode, onChangeMode }) {
  const tabs = [
    { id: 'timer', label: 'Timer' },
    { id: 'cycle', label: 'Ciclo de Exercícios' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-elevated border border-white/5 mb-6">
      {tabs.map(({ id, label }) => (
        <button
          key={id}
          id={`tab-${id}`}
          onClick={() => onChangeMode(id)}
          className={`
            px-5 py-2.5 rounded-lg text-sm font-medium cursor-pointer
            transition-all duration-200
            ${mode === id
              ? 'bg-gradient-to-r from-accent-purple to-accent-indigo text-white shadow-lg shadow-accent-purple/20'
              : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
