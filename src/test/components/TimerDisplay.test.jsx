import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimerDisplay from '../../components/TimerDisplay';

describe('TimerDisplay', () => {
  it('formata 0 como 00:00', () => {
    render(<TimerDisplay seconds={0} status="running" />);
    expect(screen.getByText('00:00')).toBeInTheDocument();
  });

  it('formata 90 como 01:30', () => {
    render(<TimerDisplay seconds={90} status="running" />);
    expect(screen.getByText('01:30')).toBeInTheDocument();
  });

  it('formata 300 como 05:00', () => {
    render(<TimerDisplay seconds={300} status="running" />);
    expect(screen.getByText('05:00')).toBeInTheDocument();
  });

  it('formata 59 como 00:59', () => {
    render(<TimerDisplay seconds={59} status="running" />);
    expect(screen.getByText('00:59')).toBeInTheDocument();
  });

  it('formata 3661 como 61:01', () => {
    render(<TimerDisplay seconds={3661} status="running" />);
    expect(screen.getByText('61:01')).toBeInTheDocument();
  });

  it('aplica classe de shake quando status é finished', () => {
    const { container } = render(<TimerDisplay seconds={0} status="finished" />);
    const display = container.firstChild;
    expect(display.className).toContain('animate-shake');
  });

  it('NÃO aplica classe de shake quando status é running', () => {
    const { container } = render(<TimerDisplay seconds={30} status="running" />);
    const display = container.firstChild;
    expect(display.className).not.toContain('animate-shake');
  });
});
