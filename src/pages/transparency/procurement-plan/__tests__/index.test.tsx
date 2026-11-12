import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import ProcurementPlanPage from '../index';
import { officeCodes, procurementPlan } from '../../../../data/procurementPlan';

const PATH = '/transparency/procurement-plan';

function itemsRegion() {
  const heading = screen.getByRole('heading', { level: 2, name: 'All items' });
  const region = heading.closest('section');
  if (!region) throw new Error('no <section> wraps the items heading');
  return within(region);
}

describe('ProcurementPlanPage', () => {
  it('says the amounts are planned estimates and links the source PDF', () => {
    renderWithProviders(<ProcurementPlanPage />, { route: PATH });

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Annual Procurement Plan 2026',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('These are planned estimates, not contracts.')
    ).toBeInTheDocument();

    const pdf = screen.getByRole('link', { name: /Open the PDF/ });
    expect(pdf).toHaveAttribute('href', procurementPlan.source.url);
    expect(pdf).toHaveAttribute('target', '_blank');
  });

  it('shows the whole plan and its total before any filter', () => {
    renderWithProviders(<ProcurementPlanPage />, { route: PATH });

    expect(
      screen.getByText('500 items, ₱5,697,991,404 in planned budget')
    ).toBeInTheDocument();
  });

  it('filters to one office from the URL, counting rows it shares', () => {
    renderWithProviders(<ProcurementPlanPage />, {
      route: `${PATH}?office=CHO`,
    });

    const expected = procurementPlan.items.filter(item =>
      officeCodes(item.office).includes('CHO')
    ).length;
    expect(
      itemsRegion().getByText(new RegExp(`^${expected} items match`))
    ).toBeInTheDocument();
    expect(itemsRegion().getByLabelText('Office')).toHaveValue('CHO');
  });

  it('explains an empty search and clears it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProcurementPlanPage />, {
      route: `${PATH}?q=zzzz-no-such-item`,
    });

    expect(itemsRegion().getByText('No items match')).toBeInTheDocument();
    await user.click(
      itemsRegion().getByRole('button', { name: 'Clear filters' })
    );
    expect(
      screen.getByText('500 items, ₱5,697,991,404 in planned budget')
    ).toBeInTheDocument();
  });

  it('filters the table when an office is picked from the breakdown', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProcurementPlanPage />, { route: PATH });

    const button = screen.getByRole('button', {
      name: 'Show the items for Office of the City Engineer',
    });
    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(itemsRegion().getByLabelText('Office')).toHaveValue('CEO');
  });
});
