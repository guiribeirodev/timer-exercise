import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimerControls from '../../components/TimerControls';

describe('TimerControls', () => {
  const defaultProps = {
    status: 'running',
    onPause: vi.fn(),
    onResume: vi.fn(),
    onReset: vi.fn(),
  };

  it('mostra "Pausar" e "Resetar" quando status é running', () => {
    render(<TimerControls {...defaultProps} status="running" />);

    expect(screen.getByText('Pausar')).toBeInTheDocument();
    expect(screen.getByText('Resetar')).toBeInTheDocument();
  });

  it('mostra "Continuar" quando status é paused', () => {
    render(<TimerControls {...defaultProps} status="paused" />);

    expect(screen.getByText('Continuar')).toBeInTheDocument();
    expect(screen.getByText('Resetar')).toBeInTheDocument();
  });

  it('mostra "Novo Timer" quando status é finished', () => {
    render(<TimerControls {...defaultProps} status="finished" />);

    expect(screen.getByText('Novo Timer')).toBeInTheDocument();
    // Não mostra pause/resume quando finished
    expect(screen.queryByText('Pausar')).not.toBeInTheDocument();
    expect(screen.queryByText('Continuar')).not.toBeInTheDocument();
  });

  it('chama onPause ao clicar em Pausar', async () => {
    const onPause = vi.fn();
    const user = userEvent.setup();
    render(<TimerControls {...defaultProps} onPause={onPause} status="running" />);

    await user.click(screen.getByText('Pausar'));
    expect(onPause).toHaveBeenCalledTimes(1);
  });

  it('chama onResume ao clicar em Continuar', async () => {
    const onResume = vi.fn();
    const user = userEvent.setup();
    render(<TimerControls {...defaultProps} onResume={onResume} status="paused" />);

    await user.click(screen.getByText('Continuar'));
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it('chama onReset ao clicar em Resetar', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<TimerControls {...defaultProps} onReset={onReset} status="running" />);

    await user.click(screen.getByText('Resetar'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('chama onReset ao clicar em Novo Timer', async () => {
    const onReset = vi.fn();
    const user = userEvent.setup();
    render(<TimerControls {...defaultProps} onReset={onReset} status="finished" />);

    await user.click(screen.getByText('Novo Timer'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('tem IDs corretos nos botões', () => {
    render(<TimerControls {...defaultProps} status="running" />);

    expect(document.getElementById('pause-resume-btn')).toBeInTheDocument();
    expect(document.getElementById('reset-btn')).toBeInTheDocument();
  });
});
