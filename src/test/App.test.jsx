import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('App (integração)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia com a tela de seleção de tempo', () => {
    render(<App />);
    expect(screen.getByText('Timer Exercise')).toBeInTheDocument();
    expect(screen.getByText('Escolha o tempo')).toBeInTheDocument();
    expect(screen.getByText('30s')).toBeInTheDocument();
  });

  it('ao clicar num preset, mostra o timer rodando', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByText('1 min'));

    expect(screen.getByText('Pausar')).toBeInTheDocument();
    expect(screen.getByText('Resetar')).toBeInTheDocument();
    // Não mostra mais o picker
    expect(screen.queryByText('Escolha o tempo')).not.toBeInTheDocument();
  });

  it('ao clicar Resetar, volta à tela de seleção', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByText('30s'));
    expect(screen.queryByText('Escolha o tempo')).not.toBeInTheDocument();

    await user.click(screen.getByText('Resetar'));
    expect(screen.getByText('Escolha o tempo')).toBeInTheDocument();
  });

  it('mostra "Pausado" ao pausar', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByText('1 min'));
    await user.click(screen.getByText('Pausar'));

    expect(screen.getByText('Pausado')).toBeInTheDocument();
    expect(screen.getByText('Continuar')).toBeInTheDocument();
  });

  it('resume ao clicar Continuar', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.click(screen.getByText('1 min'));
    await user.click(screen.getByText('Pausar'));
    await user.click(screen.getByText('Continuar'));

    expect(screen.getByText('Pausar')).toBeInTheDocument();
    expect(screen.queryByText('Pausado')).not.toBeInTheDocument();
  });

  it('exibe header em todas as telas', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    // Na tela de seleção
    expect(screen.getByText('Timer Exercise')).toBeInTheDocument();
    expect(screen.getByText('Temporizador para seus exercícios')).toBeInTheDocument();

    // Na tela do timer
    await user.click(screen.getByText('30s'));
    expect(screen.getByText('Timer Exercise')).toBeInTheDocument();
  });

  it('custom input inicia o timer corretamente', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<App />);

    await user.type(screen.getByPlaceholderText('min'), '1');
    await user.type(screen.getByPlaceholderText('seg'), '30');
    await user.click(screen.getByText('Iniciar'));

    expect(screen.getByText('Pausar')).toBeInTheDocument();
    expect(screen.queryByText('Escolha o tempo')).not.toBeInTheDocument();
  });
});
