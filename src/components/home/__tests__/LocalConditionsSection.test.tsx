import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LocalConditionsSection from '../LocalConditionsSection';

vi.mock('../Map', () => ({
  default: ({ embedded }: { embedded?: boolean }) => (
    <div data-testid="map-panel" data-embedded={String(embedded)} />
  ),
}));

vi.mock('../Weather', () => ({
  default: ({ embedded }: { embedded?: boolean }) => (
    <div data-testid="weather-panel" data-embedded={String(embedded)} />
  ),
}));

describe('LocalConditionsSection', () => {
  it('groups weather and map under one local context', () => {
    render(
      <MemoryRouter>
        <LocalConditionsSection />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { name: 'Cabanatuan today' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: 'Cabanatuan today' })
    ).toBeInTheDocument();
    expect(screen.getByTestId('map-panel')).toHaveAttribute(
      'data-embedded',
      'true'
    );
    expect(screen.getByTestId('weather-panel')).toHaveAttribute(
      'data-embedded',
      'true'
    );
  });

  it('provides an explicit action for opening City Hall in maps', () => {
    render(
      <MemoryRouter>
        <LocalConditionsSection />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('link', { name: 'Open City Hall in Google Maps' })
    ).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=15.4708053,120.9519476'
    );
  });

  it('places weather before the map in mobile reading order', () => {
    render(
      <MemoryRouter>
        <LocalConditionsSection />
      </MemoryRouter>
    );

    const weather = screen.getByTestId('weather-panel');
    const map = screen.getByTestId('map-panel');
    expect(
      weather.compareDocumentPosition(map) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });
});
