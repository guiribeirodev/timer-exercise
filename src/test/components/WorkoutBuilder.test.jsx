import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkoutBuilder from '../../components/WorkoutBuilder';

describe('WorkoutBuilder', () => {
  it('renderiza o formulário de adicionar exercício', () => {
    render(<WorkoutBuilder onStart={vi.fn()} />);
    expect(screen.getByPlaceholderText('Nome do exercício')).toBeInTheDocument();
    expect(screen.getByText('+ Adicionar')).toBeInTheDocument();
    expect(screen.getByText('Monte seu treino')).toBeInTheDocument();
  });

  it('renderiza os presets de duração', () => {
    render(<WorkoutBuilder onStart={vi.fn()} />);
    expect(screen.getByText('30s')).toBeInTheDocument();
    expect(screen.getByText('1 min')).toBeInTheDocument();
    expect(screen.getByText('1:30')).toBeInTheDocument();
    expect(screen.getByText('2 min')).toBeInTheDocument();
  });

  it('adiciona exercício com preset de duração', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Flexão');
    await user.click(screen.getByText('30s'));
    await user.click(screen.getByText('+ Adicionar'));

    expect(screen.getByText('Flexão')).toBeInTheDocument();
    expect(screen.getByText('1.')).toBeInTheDocument();
  });

  it('adiciona exercício com duração customizada', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Prancha');
    await user.type(screen.getByPlaceholderText('min'), '1');
    await user.type(screen.getByPlaceholderText('seg'), '30');
    await user.click(screen.getByText('+ Adicionar'));

    expect(screen.getByText('Prancha')).toBeInTheDocument();
    // '1:30' aparece no preset E no exercício adicionado
    expect(screen.getAllByText('1:30').length).toBeGreaterThanOrEqual(2);
  });

  it('não adiciona exercício sem nome', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    await user.click(screen.getByText('30s'));
    await user.click(screen.getByText('+ Adicionar'));

    // Nenhum exercício adicionado → botão de iniciar não aparece
    expect(screen.queryByText(/Iniciar Treino/)).not.toBeInTheDocument();
  });

  it('não adiciona exercício sem duração', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Teste');
    await user.click(screen.getByText('+ Adicionar'));

    expect(screen.queryByText(/Iniciar Treino/)).not.toBeInTheDocument();
  });

  it('remove exercício ao clicar no botão ×', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    // Adiciona exercício
    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Flexão');
    await user.click(screen.getByText('30s'));
    await user.click(screen.getByText('+ Adicionar'));
    expect(screen.getByText('Flexão')).toBeInTheDocument();

    // Remove
    await user.click(screen.getByLabelText('Remover Flexão'));
    expect(screen.queryByText('Flexão')).not.toBeInTheDocument();
  });

  it('mostra seletor de ciclos e botão iniciar após adicionar exercício', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Flexão');
    await user.click(screen.getByText('30s'));
    await user.click(screen.getByText('+ Adicionar'));

    expect(screen.getByText('Número de ciclos')).toBeInTheDocument();
    expect(screen.getByText(/Iniciar Treino/)).toBeInTheDocument();
    expect(document.getElementById('cycle-1')).toBeInTheDocument();
    expect(document.getElementById('cycle-5')).toBeInTheDocument();
  });

  it('chama onStart com exercícios e ciclos corretos', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={onStart} />);

    // Adiciona 2 exercícios
    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Flexão');
    await user.click(screen.getByText('30s'));
    await user.click(screen.getByText('+ Adicionar'));

    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Prancha');
    await user.click(screen.getByText('1 min'));
    await user.click(screen.getByText('+ Adicionar'));

    // Seleciona 3 ciclos
    await user.click(document.getElementById('cycle-3'));

    // Inicia
    await user.click(screen.getByText(/Iniciar Treino/));

    expect(onStart).toHaveBeenCalledWith(
      [
        { name: 'Flexão', duration: 30 },
        { name: 'Prancha', duration: 60 },
      ],
      3
    );
  });

  it('adiciona exercício ao pressionar Enter no campo de nome', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    await user.type(screen.getByPlaceholderText('Nome do exercício'), 'Flexão');
    await user.click(screen.getByText('1 min'));
    // Focus no nome e Enter
    screen.getByPlaceholderText('Nome do exercício').focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Flexão')).toBeInTheDocument();
  });

  it('limpa os campos após adicionar exercício', async () => {
    const user = userEvent.setup();
    render(<WorkoutBuilder onStart={vi.fn()} />);

    const nameInput = screen.getByPlaceholderText('Nome do exercício');
    await user.type(nameInput, 'Flexão');
    await user.click(screen.getByText('30s'));
    await user.click(screen.getByText('+ Adicionar'));

    expect(nameInput).toHaveValue('');
  });
});
