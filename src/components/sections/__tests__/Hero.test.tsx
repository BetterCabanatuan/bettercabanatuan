import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Hero from '../Hero';

function LocationProbe() {
  const location = useLocation();
  return <output aria-label="Current location">{location.search}</output>;
}

describe('Hero', () => {
  it('sends a resident search to the portal search page', () => {
    render(
      <MemoryRouter>
        <Hero />
        <LocationProbe />
      </MemoryRouter>
    );

    fireEvent.change(
      screen.getByRole('searchbox', { name: 'Search the city portal' }),
      { target: { value: 'business permit' } }
    );
    fireEvent.submit(
      screen.getByRole('search', { name: 'Search the city portal' })
    );

    expect(screen.getByLabelText('Current location')).toHaveTextContent(
      '?q=business+permit'
    );
  });

  it('keeps the main civic destinations available as links', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: /Find a Service/i })
    ).toHaveAttribute('href', '/services');
    expect(
      screen.getByRole('link', { name: /Explore Barangays/i })
    ).toHaveAttribute('href', '/government/barangays');
  });
});
