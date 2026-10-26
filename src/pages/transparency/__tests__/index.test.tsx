import { describe, expect, it } from 'vitest';
import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import TransparencyPage from '../index';
import { transparencyData } from '../../../data/yamlLoader';

// The badge labels the page renders. Pinned as literals so a copy change is a
// deliberate edit here, not an accident that passes.
const POSTED = 'Posted';
const NOT_YET_LOCATED = 'Not yet located';

function sectionRegion(id: string) {
  const heading = screen.getByRole('heading', {
    level: 2,
    name: transparencyData.sections.find(s => s.id === id)?.title ?? '',
  });
  const region = heading.closest('section');
  if (!region) throw new Error(`no <section> wraps heading for ${id}`);
  return within(region);
}

describe('TransparencyPage', () => {
  it('renders every section heading from transparency.yaml', () => {
    renderWithProviders(<TransparencyPage />, { route: '/transparency' });

    for (const section of transparencyData.sections) {
      expect(
        screen.getByRole('heading', { level: 2, name: section.title })
      ).toBeInTheDocument();
    }
  });

  it("links the Citizen's Charter PDF as an external resource", () => {
    renderWithProviders(<TransparencyPage />, { route: '/transparency' });

    const charter = sectionRegion('charter');
    const link = charter.getByRole('link', {
      name: /Citizen's Charter 2022 \(2nd Edition\)/,
    });
    expect(link).toHaveAttribute(
      'href',
      'https://www.cabanatuancity.gov.ph/uploads/photos/detail/61d7d8890742f0.14414526.pdf'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
  });

  it('shows a status badge on every Full Disclosure Policy row', () => {
    renderWithProviders(<TransparencyPage />, { route: '/transparency' });

    const fdp = sectionRegion('full-disclosure');
    const documents =
      transparencyData.sections.find(s => s.id === 'full-disclosure')
        ?.documents ?? [];
    const items = fdp.getAllByRole('listitem');
    expect(items).toHaveLength(documents.length);

    const posted = fdp.getAllByText(POSTED);
    const notLocated = fdp.getAllByText(NOT_YET_LOCATED);
    expect(posted.length + notLocated.length).toBe(documents.length);
    expect(posted).toHaveLength(
      documents.filter(d => d.status === 'posted').length
    );
  });

  it('links a posted row to its document and gives an unlocated row no link', () => {
    renderWithProviders(<TransparencyPage />, { route: '/transparency' });

    const fdp = sectionRegion('full-disclosure');

    const appRow = fdp
      .getByRole('heading', { level: 3, name: 'Annual procurement plan' })
      .closest('li')!;
    const appLink = within(appRow).getByRole('link', {
      name: /View resource/,
    });
    expect(appLink).toHaveAttribute(
      'href',
      'https://www.cabanatuancity.gov.ph/uploads/files/procurement/6a5878e43d7118.12679050.pdf'
    );
    expect(
      within(appRow).getByRole('link', { name: 'Browse on this portal' })
    ).toHaveAttribute('href', '/transparency/procurement-plan');
    expect(within(appRow).getByText(/posted 2026-02-13/)).toBeInTheDocument();

    const manpowerRow = fdp
      .getByRole('heading', { level: 3, name: 'Manpower complement' })
      .closest('li')!;
    expect(within(manpowerRow).queryByRole('link')).toBeNull();
    expect(within(manpowerRow).getByText(NOT_YET_LOCATED)).toBeInTheDocument();
  });

  it('states the GAA applicability caveat on the Transparency Seal section', () => {
    renderWithProviders(<TransparencyPage />, { route: '/transparency' });

    const seal = sectionRegion('transparency-seal');
    expect(seal.getByRole('note')).toHaveTextContent(/not confirmed/i);
    expect(
      seal.getByRole('link', { name: /GAA FY 2026, section 112/ })
    ).toHaveAttribute('href', 'https://www.phcc.gov.ph/transparency-seal');
  });

  it('keeps the existing resource cards rendering', () => {
    renderWithProviders(<TransparencyPage />, { route: '/transparency' });

    expect(
      screen.getByRole('link', { name: 'Flood Control Projects' })
    ).toHaveAttribute('href', '/transparency/flood-controls');
    expect(
      screen.getByRole('link', { name: 'Freedom of Information (FOI)' })
    ).toHaveAttribute('href', 'https://www.foi.gov.ph');
  });
});
