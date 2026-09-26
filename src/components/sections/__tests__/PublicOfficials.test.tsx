import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import PublicOfficials from '../PublicOfficials';
import SearchResults from '../../search/SearchResults';
import { suggestedSearches } from '../../../data/searchIndex';

describe('PublicOfficials cards (P3-3)', () => {
  it('shows a neutral placeholder where no official photo exists', () => {
    renderWithProviders(<PublicOfficials />);

    const placeholders = screen.getAllByRole('img', {
      name: /No official photo available for/i,
    });
    expect(placeholders.length).toBeGreaterThan(0);
  });

  it('labels the placeholder so it reads as a placeholder', () => {
    renderWithProviders(<PublicOfficials />);
    expect(
      screen.getAllByRole('img', {
        name: /No official photo available for/i,
      })[0]
    ).toHaveAttribute(
      'aria-label',
      expect.stringContaining('No official photo available')
    );
  });

  it('shows the ballot name where it differs from the formal name', () => {
    renderWithProviders(<PublicOfficials />);

    expect(screen.getAllByText('On the ballot:').length).toBeGreaterThan(0);
    expect(screen.getByText('KUYA ELLORIN MATIAS')).toBeInTheDocument();
  });

  it('keeps the councilor cards in the same layout as the Mayor card', () => {
    renderWithProviders(<PublicOfficials />);

    // Every official gets the same name + role badge pairing.
    const mayor = screen.getByText('Myca Elizabeth R. Vergara');
    const councilor = screen.getByText('Emmanuel Liwag');
    expect(mayor).toBeInTheDocument();
    expect(councilor).toBeInTheDocument();

    expect(screen.getByText('Mayor')).toBeInTheDocument();
    expect(screen.getAllByText('Councilor')).toHaveLength(10);
  });

  it('does not repeat the old boilerplate bio across councilors', () => {
    renderWithProviders(<PublicOfficials />);
    // The former shared text was "…is a member of the Sangguniang Panlungsod
    // for the 2025-2028 term." It must no longer appear at all.
    expect(
      screen.queryAllByText(/is a member of the Sangguniang/i)
    ).toHaveLength(0);
  });
});

describe('search suggestion chips (P3-6)', () => {
  const noop = () => {};

  it('renders every term as a real button', () => {
    renderWithProviders(
      <SearchResults
        results={[]}
        query=""
        onSuggestedSearch={noop}
        suggestedSearches={suggestedSearches}
      />
    );

    suggestedSearches.forEach(term => {
      const button = screen.getByRole('button', {
        name: `Search for "${term}"`,
      });
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  it('groups the chips under an accessible label', () => {
    renderWithProviders(
      <SearchResults
        results={[]}
        query=""
        onSuggestedSearch={noop}
        suggestedSearches={suggestedSearches}
      />
    );

    expect(
      screen.getByRole('group', { name: 'Popular search terms' })
    ).toBeInTheDocument();
  });

  it('runs the matching search when a chip is activated', async () => {
    const user = userEvent.setup();
    let chosen = '';

    renderWithProviders(
      <SearchResults
        results={[]}
        query=""
        onSuggestedSearch={term => {
          chosen = term;
        }}
        suggestedSearches={suggestedSearches}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Search for "health services"' })
    );
    expect(chosen).toBe('health services');
  });

  it('is reachable and activatable by keyboard', async () => {
    const user = userEvent.setup();
    let chosen = '';

    renderWithProviders(
      <SearchResults
        results={[]}
        query=""
        onSuggestedSearch={term => {
          chosen = term;
        }}
        suggestedSearches={suggestedSearches}
      />
    );

    const chip = screen.getByRole('button', { name: 'Search for "barangay"' });
    await user.tab();

    // Walk forward until the chip has focus, then activate it.
    for (let i = 0; i < 12 && document.activeElement !== chip; i++) {
      await user.tab();
    }
    expect(document.activeElement).toBe(chip);

    await user.keyboard('{Enter}');
    expect(chosen).toBe('barangay');
  });

  it('keeps a stable hit area so hover/focus causes no layout shift', () => {
    renderWithProviders(
      <SearchResults
        results={[]}
        query=""
        onSuggestedSearch={noop}
        suggestedSearches={suggestedSearches}
      />
    );

    const chip = screen.getByRole('button', { name: 'Search for "contact"' });
    // Fixed padding + min-height, and colour-only transitions: no reflow.
    expect(chip.className).toContain('min-h-[44px]');
    expect(chip.className).toContain('transition-colors');
    expect(chip.className).not.toMatch(/transition-all/);
    expect(chip.className).not.toMatch(/scale-/);
  });
});
