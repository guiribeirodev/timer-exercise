import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimePicker from '../../components/TimePicker';

describe('TimePicker', () => {
  it('renderiza todos os 6 presets', () => {
    render(<TimePicker onStart={vi.fn()} />);

    expect(screen.getByText('30s')).toBeInTheDocument();
    expect(screen.getByText('1 min')).toBeInTheDocument();
    expect(screen.getByText('1:30')).toBeInTheDocument();
    expect(screen.getByText('2 min')).toBeInTheDocument();
    expect(screen.getByText('3 min')).toBeInTheDocument();
    expect(screen.getByText('5 min')).toBeInTheDocument();
  });

  it('renderiza os inputs customizados e o botão Iniciar', () => {
    render(<TimePicker onStart={vi.fn()} />);

    expect(screen.getByPlaceholderText('min')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seg')).toBeInTheDocument();
    expect(screen.getByText('Iniciar')).toBeInTheDocument();
  });

  it('chama onStart com os segundos corretos ao clicar num preset', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onStart={onStart} />);

    await user.click(screen.getByText('30s'));
    expect(onStart).toHaveBeenCalledWith(30);

    await user.click(screen.getByText('1 min'));
    expect(onStart).toHaveBeenCalledWith(60);

    await user.click(screen.getByText('1:30'));
    expect(onStart).toHaveBeenCalledWith(90);

    await user.click(screen.getByText('2 min'));
    expect(onStart).toHaveBeenCalledWith(120);

    await user.click(screen.getByText('3 min'));
    expect(onStart).toHaveBeenCalledWith(180);

    await user.click(screen.getByText('5 min'));
    expect(onStart).toHaveBeenCalledWith(300);
  });

  it('chama onStart com valor customizado ao digitar e clicar Iniciar', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onStart={onStart} />);

    const minInput = screen.getByPlaceholderText('min');
    const secInput = screen.getByPlaceholderText('seg');

    await user.type(minInput, '2');
    await user.type(secInput, '30');
    await user.click(screen.getByText('Iniciar'));

    expect(onStart).toHaveBeenCalledWith(150); // 2*60 + 30
  });

  it('chama onStart com valor customizado ao pressionar Enter', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onStart={onStart} />);

    const secInput = screen.getByPlaceholderText('seg');
    await user.type(secInput, '45');
    await user.keyboard('{Enter}');

    expect(onStart).toHaveBeenCalledWith(45);
  });

  it('NÃO chama onStart se o valor customizado for 0', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onStart={onStart} />);

    await user.click(screen.getByText('Iniciar'));
    expect(onStart).not.toHaveBeenCalled();

    // Digita 0 nos dois campos
    await user.type(screen.getByPlaceholderText('min'), '0');
    await user.type(screen.getByPlaceholderText('seg'), '0');
    await user.click(screen.getByText('Iniciar'));
    expect(onStart).not.toHaveBeenCalled();
  });

  it('aceita somente minutos', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onStart={onStart} />);

    await user.type(screen.getByPlaceholderText('min'), '3');
    await user.click(screen.getByText('Iniciar'));

    expect(onStart).toHaveBeenCalledWith(180); // 3*60
  });

  it('aceita somente segundos', async () => {
    const onStart = vi.fn();
    const user = userEvent.setup();
    render(<TimePicker onStart={onStart} />);

    await user.type(screen.getByPlaceholderText('seg'), '15');
    await user.click(screen.getByText('Iniciar'));

    expect(onStart).toHaveBeenCalledWith(15);
  });

  it('tem IDs corretos nos botões preset para acessibilidade', () => {
    render(<TimePicker onStart={vi.fn()} />);

    expect(document.getElementById('preset-30')).toBeInTheDocument();
    expect(document.getElementById('preset-60')).toBeInTheDocument();
    expect(document.getElementById('preset-90')).toBeInTheDocument();
    expect(document.getElementById('preset-120')).toBeInTheDocument();
    expect(document.getElementById('preset-180')).toBeInTheDocument();
    expect(document.getElementById('preset-300')).toBeInTheDocument();
  });
});
