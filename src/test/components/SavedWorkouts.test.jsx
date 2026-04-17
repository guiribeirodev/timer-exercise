import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SavedWorkouts from '../../components/SavedWorkouts';

const WORKOUTS = [
  {
    id: 'w1',
    name: 'Treino Upper',
    exercises: [
      { name: 'Flexão', duration: 30 },
      { name: 'Prancha', duration: 60 },
    ],
    cycles: 3,
    createdAt: 1000,
  },
  {
    id: 'w2',
    name: 'Treino Lower',
    exercises: [{ name: 'Agachamento', duration: 45 }],
    cycles: 2,
    createdAt: 2000,
  },
];

describe('SavedWorkouts', () => {
  it('não renderiza nada se workouts está vazio', () => {
    const { container } = render(
      <SavedWorkouts workouts={[]} onLoad={vi.fn()} onDelete={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renderiza a lista de treinos salvos', () => {
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText('Treinos salvos')).toBeInTheDocument();
    expect(screen.getByText('Treino Upper')).toBeInTheDocument();
    expect(screen.getByText('Treino Lower')).toBeInTheDocument();
  });

  it('exibe informações de cada treino', () => {
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={vi.fn()} />);

    // Treino Upper: 2 exercícios × 3 ciclos
    expect(screen.getByText(/2 exercícios × 3 ciclos/)).toBeInTheDocument();
    // Treino Lower: 1 exercício × 2 ciclos
    expect(screen.getByText(/1 exercício × 2 ciclos/)).toBeInTheDocument();
  });

  it('chama onLoad ao clicar Carregar', async () => {
    const onLoad = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={onLoad} onDelete={vi.fn()} />);

    const buttons = screen.getAllByText('Carregar');
    await user.click(buttons[0]);

    expect(onLoad).toHaveBeenCalledWith(WORKOUTS[0]);
  });

  it('chama onDelete ao clicar ×', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('Excluir Treino Upper'));
    expect(onDelete).toHaveBeenCalledWith('w1');
  });

  it('renderiza botões Carregar para cada treino', () => {
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getAllByText('Carregar')).toHaveLength(2);
  });
});
