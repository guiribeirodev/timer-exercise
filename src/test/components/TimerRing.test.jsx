import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TimerRing from '../../components/TimerRing';

const SIZE = 280;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

describe('TimerRing', () => {
  it('renderiza SVG com dimensões corretas', () => {
    const { container } = render(<TimerRing progress={1} status="running" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.getAttribute('width')).toBe(String(SIZE));
  });

  it('contém 3 circles', () => {
    const { container } = render(<TimerRing progress={0.5} status="running" />);
    expect(container.querySelectorAll('circle').length).toBe(3);
  });

  it('offset 0 quando progress=1', () => {
    const { container } = render(<TimerRing progress={1} status="running" />);
    const c = container.querySelectorAll('circle')[2];
    expect(parseFloat(c.getAttribute('stroke-dashoffset'))).toBeCloseTo(0, 0);
  });

  it('offset correto quando progress=0.5', () => {
    const { container } = render(<TimerRing progress={0.5} status="running" />);
    const c = container.querySelectorAll('circle')[2];
    expect(parseFloat(c.getAttribute('stroke-dashoffset'))).toBeCloseTo(CIRCUMFERENCE / 2, 0);
  });

  it('cor rose quando finished', () => {
    const { container } = render(<TimerRing progress={0} status="finished" />);
    const c = container.querySelectorAll('circle')[2];
    expect(c.getAttribute('stroke')).toBe('#fb7185');
  });

  it('gradiente quando progress>0.5', () => {
    const { container } = render(<TimerRing progress={0.8} status="running" />);
    const c = container.querySelectorAll('circle')[2];
    expect(c.getAttribute('stroke')).toContain('url(#');
  });

  it('amber quando progress entre 0.2 e 0.5', () => {
    const { container } = render(<TimerRing progress={0.35} status="running" />);
    const c = container.querySelectorAll('circle')[2];
    expect(c.getAttribute('stroke')).toBe('#fbbf24');
  });

  it('glow opacity 0.3 quando running', () => {
    const { container } = render(<TimerRing progress={0.5} status="running" />);
    expect(container.querySelectorAll('circle')[1].getAttribute('opacity')).toBe('0.3');
  });

  it('glow opacity 0 quando paused', () => {
    const { container } = render(<TimerRing progress={0.5} status="paused" />);
    expect(container.querySelectorAll('circle')[1].getAttribute('opacity')).toBe('0');
  });

  it('contém gradiente SVG', () => {
    const { container } = render(<TimerRing progress={1} status="running" />);
    const g = container.querySelector('linearGradient');
    expect(g).toBeInTheDocument();
    expect(g.id).toBe('timer-gradient');
  });
});
