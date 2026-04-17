import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModeTabs from '../../components/ModeTabs';

describe('ModeTabs', () => {
  it('renderiza as duas tabs', () => {
    render(<ModeTabs mode="timer" onChangeMode={vi.fn()} />);
    expect(screen.getByText('Timer')).toBeInTheDocument();
    expect(screen.getByText('Ciclo de Exercícios')).toBeInTheDocument();
  });

  it('chama onChangeMode ao clicar na tab', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<ModeTabs mode="timer" onChangeMode={onChange} />);

    await user.click(screen.getByText('Ciclo de Exercícios'));
    expect(onChange).toHaveBeenCalledWith('cycle');

    await user.click(screen.getByText('Timer'));
    expect(onChange).toHaveBeenCalledWith('timer');
  });

  it('tem IDs corretos', () => {
    render(<ModeTabs mode="timer" onChangeMode={vi.fn()} />);
    expect(document.getElementById('tab-timer')).toBeInTheDocument();
    expect(document.getElementById('tab-cycle')).toBeInTheDocument();
  });
});
