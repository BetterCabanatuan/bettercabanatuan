import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmergencyHotlinesSection from '../EmergencyHotlinesSection';

describe('EmergencyHotlinesSection', () => {
  it('renders emergency hotlines section with agencies', () => {
    render(<EmergencyHotlinesSection />);

    expect(
      screen.getByRole('heading', { name: 'Emergency Hotlines' })
    ).toBeInTheDocument();
    expect(screen.getByText('PNP Cabanatuan')).toBeInTheDocument();
    expect(screen.getByText('CDRRMO Rescue Team')).toBeInTheDocument();
  });

  it('provides tel links for emergency numbers', () => {
    render(<EmergencyHotlinesSection />);

    expect(screen.getByRole('link', { name: '(044)-940-0161' })).toHaveAttribute(
      'href',
      'tel:+63449400161'
    );
  });
});
