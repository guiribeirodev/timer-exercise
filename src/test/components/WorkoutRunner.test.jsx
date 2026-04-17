import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutRunner from '../../components/WorkoutRunner';

const EXERCISES = [
  { name: 'Flexão', duration: 30 },
  { name: 'Agachamento', duration: 45 },
  { name: 'Prancha', duration: 60 },
];

const defaultProps = {
  currentExercise: EXERCISES[0],
  currentCycle: 0,
  totalCycles: 2,
  currentExIndex: 0,
  exercises: EXERCISES,
  remaining: 25,
  progress: 0.83,
  workoutStatus: 'running',
  timerStatus: 'running',
  onPause: vi.fn(),
  onResume: vi.fn(),
  onStop: vi.fn(),
};

describe('WorkoutRunner', () => {
  it('exibe badges de ciclo e exercício', () => {
    render(<WorkoutRunner {...defaultProps} />);
    expect(screen.getByText('Ciclo 1/2')).toBeInTheDocument();
    expect(screen.getByText('Exercício 1/3')).toBeInTheDocument();
  });

  it('exibe o nome do exercício atual', () => {
    render(<WorkoutRunner {...defaultProps} />);
    expect(screen.getByText('Flexão')).toBeInTheDocument();
  });

  it('exibe o timer display formatado', () => {
    render(<WorkoutRunner {...defaultProps} remaining={25} />);
    expect(screen.getByText('00:25')).toBeInTheDocument();
  });

  it('exibe exercise dots para múltiplos exercícios', () => {
    const { container } = render(<WorkoutRunner {...defaultProps} />);
    const dots = container.querySelectorAll('.rounded-full.w-2\\.5');
    expect(dots.length).toBe(3);
  });

  it('mostra botão Pausar quando running', () => {
    render(<WorkoutRunner {...defaultProps} workoutStatus="running" />);
    expect(screen.getByText('⏸ Pausar')).toBeInTheDocument();
    expect(screen.getByText('⏹ Parar Treino')).toBeInTheDocument();
  });

  it('mostra botão Continuar quando paused', () => {
    render(<WorkoutRunner {...defaultProps} workoutStatus="paused" />);
    expect(screen.getByText('▶ Continuar')).toBeInTheDocument();
    expect(screen.getByText('Pausado')).toBeInTheDocument();
  });

  it('mostra "Treino Finalizado!" e "Novo Treino" quando finished', () => {
    render(<WorkoutRunner {...defaultProps} workoutStatus="finished" remaining={0} />);
    expect(screen.getByText('Treino Finalizado! 🎉')).toBeInTheDocument();
    expect(screen.getByText('🔄 Novo Treino')).toBeInTheDocument();
    expect(screen.queryByText('⏸ Pausar')).not.toBeInTheDocument();
  });

  it('chama onPause ao clicar Pausar', async () => {
    const onPause = vi.fn();
    const user = userEvent.setup();
    render(<WorkoutRunner {...defaultProps} onPause={onPause} />);

    await user.click(screen.getByText('⏸ Pausar'));
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it('chama onResume ao clicar Continuar', async () => {
    const onResume = vi.fn();
    const user = userEvent.setup();
    render(<WorkoutRunner {...defaultProps} workoutStatus="paused" onResume={onResume} />);

    await user.click(screen.getByText('▶ Continuar'));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('chama onStop ao clicar Parar Treino', async () => {
    const onStop = vi.fn();
    const user = userEvent.setup();
    render(<WorkoutRunner {...defaultProps} onStop={onStop} />);

    await user.click(screen.getByText('⏹ Parar Treino'));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('chama onStop ao clicar Novo Treino quando finished', async () => {
    const onStop = vi.fn();
    const user = userEvent.setup();
    render(<WorkoutRunner {...defaultProps} workoutStatus="finished" onStop={onStop} />);

    await user.click(screen.getByText('🔄 Novo Treino'));
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it('atualiza badges conforme ciclo e exercício mudam', () => {
    render(
      <WorkoutRunner
        {...defaultProps}
        currentCycle={1}
        currentExIndex={2}
      />
    );
    expect(screen.getByText('Ciclo 2/2')).toBeInTheDocument();
    expect(screen.getByText('Exercício 3/3')).toBeInTheDocument();
  });

  it('tem IDs corretos nos botões', () => {
    render(<WorkoutRunner {...defaultProps} />);
    expect(document.getElementById('workout-pause-btn')).toBeInTheDocument();
    expect(document.getElementById('workout-stop-btn')).toBeInTheDocument();
  });
});
