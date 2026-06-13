import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hotline } from '../Hotline';

describe('Hotline', () => {
  it('renders emergency hotline region with agency labels', () => {
    render(<Hotline />);

    expect(
      screen.getByRole('region', { name: 'Emergency hotlines' })
    ).toBeInTheDocument();
    expect(screen.getByText('PNP:')).toBeInTheDocument();
    expect(screen.getByText('CDRRMO:')).toBeInTheDocument();
  });

  it('renders tel links for hotline numbers', () => {
    render(<Hotline />);

    const pnpLink = screen.getByRole('link', { name: '(044)-463-1111' });
    expect(pnpLink).toHaveAttribute('href', 'tel:+63444631111');
  });
});
