import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

  it('renderiza botões Carregar para cada treino', () => {
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getAllByText('Carregar')).toHaveLength(2);
  });

  // ── Delete confirmation modal tests ──────────────────────

  it('abre o modal de confirmação ao clicar no botão de excluir', async () => {
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={vi.fn()} />);

    // Modal should not be visible initially
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();

    // Click the delete button for the first workout
    await user.click(screen.getByLabelText('Excluir Treino Upper'));

    // Modal should now be visible
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    expect(screen.getByText('Excluir treino')).toBeInTheDocument();
    expect(screen.getByText(/Tem certeza que deseja excluir "Treino Upper"\?/)).toBeInTheDocument();
  });

  it('não chama onDelete imediatamente ao clicar ×', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('Excluir Treino Upper'));

    // onDelete should NOT have been called yet
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('chama onDelete ao confirmar a exclusão no modal', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={onDelete} />);

    // Open the confirmation modal
    await user.click(screen.getByLabelText('Excluir Treino Upper'));

    // Click the confirm button
    await user.click(screen.getByText('Excluir'));

    expect(onDelete).toHaveBeenCalledWith('w1');
  });

  it('fecha o modal e não exclui ao clicar Cancelar', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={onDelete} />);

    // Open the confirmation modal
    await user.click(screen.getByLabelText('Excluir Treino Upper'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

    // Click cancel
    await user.click(screen.getByText('Cancelar'));

    // Modal should be closed
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    // onDelete should NOT have been called
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('fecha o modal ao clicar no backdrop', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('Excluir Treino Lower'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

    // Click the backdrop
    await user.click(screen.getByTestId('confirm-modal-backdrop'));

    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('fecha o modal ao pressionar Escape', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('Excluir Treino Upper'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

    // Press Escape
    await user.keyboard('{Escape}');

    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it('exibe o nome correto do treino no modal para cada treino', async () => {
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={vi.fn()} />);

    // Delete the second workout
    await user.click(screen.getByLabelText('Excluir Treino Lower'));

    expect(screen.getByText(/Tem certeza que deseja excluir "Treino Lower"\?/)).toBeInTheDocument();
  });

  it('fecha o modal após confirmar a exclusão', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<SavedWorkouts workouts={WORKOUTS} onLoad={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByLabelText('Excluir Treino Upper'));
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();

    // Confirm deletion
    await user.click(screen.getByText('Excluir'));

    // Modal should be closed after confirmation
    expect(screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
  });
});
