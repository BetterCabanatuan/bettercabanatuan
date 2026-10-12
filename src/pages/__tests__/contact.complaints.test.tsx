import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import i18n from 'i18next';
import { renderWithProviders } from '../../test/test-utils';
import ContactPage from '../contact';
import en from '../../../public/locales/en/common.json';
import fil from '../../../public/locales/fil/common.json';

/**
 * Slice C3: the Contact page publishes the charter's feedback and complaints
 * mechanism (Citizen's Charter 2022, 2nd Edition, pp. 340-341). RA 11032
 * s.6(g) requires the complaint procedure to be published with the charter, so
 * these tests pin the seven channels, their contact links and the source line.
 */

function getComplaintsRegion() {
  return screen.getByRole('region', {
    name: en.contact.complaints.title,
  });
}

describe('Contact page complaints and feedback', () => {
  it('renders the section under its own heading with a captioned table', () => {
    renderWithProviders(<ContactPage />, { route: '/contact' });

    const region = getComplaintsRegion();
    expect(
      within(region).getByRole('heading', {
        level: 3,
        name: en.contact.complaints.title,
      })
    ).toBeInTheDocument();

    // The caption is the table's accessible name, so a screen reader hears
    // what the table is for before it reads the first cell.
    const table = within(region).getByRole('table', {
      name: en.contact.complaints.tableCaption,
    });
    expect(table).toBeInTheDocument();
  });

  it('lists exactly the seven charter channels as rows', () => {
    renderWithProviders(<ContactPage />, { route: '/contact' });

    const table = within(getComplaintsRegion()).getByRole('table');
    // Each channel is a row header, so the count excludes the column header row.
    const rowHeaders = within(table).getAllByRole('rowheader');
    expect(rowHeaders.map(h => h.textContent)).toEqual([
      en.contact.complaints.channels.feedbackForm.title,
      en.contact.complaints.channels.complaintForm.title,
      en.contact.complaints.channels.textLine.title,
      en.contact.complaints.channels.mayorsOffice.title,
      en.contact.complaints.channels.arta.title,
      en.contact.complaints.channels.pcc.title,
      en.contact.complaints.channels.ccb.title,
    ]);

    const columns = within(table).getAllByRole('columnheader');
    expect(columns.map(c => c.textContent)).toEqual([
      en.contact.complaints.columns.channel,
      en.contact.complaints.columns.audience,
      en.contact.complaints.columns.reach,
    ]);
  });

  it('links each number and address exactly as the charter prints it', () => {
    renderWithProviders(<ContactPage />, { route: '/contact' });
    const region = getComplaintsRegion();

    // Complaints by text (p.340): an sms: link, not tel:, because the charter
    // says "txt message".
    expect(
      within(region).getByRole('link', { name: /0917 813 3247/ })
    ).toHaveAttribute('href', 'sms:+639178133247');

    // Office of the City Mayor (p.340).
    expect(
      within(region).getByRole('link', { name: '0919 081 3749' })
    ).toHaveAttribute('href', 'tel:+639190813749');
    expect(
      within(region).getByRole('link', { name: 'cabanatuan.lgu@gmail.com' })
    ).toHaveAttribute('href', 'mailto:cabanatuan.lgu@gmail.com');

    // ARTA, PCC and CCB (pp.340-341).
    expect(
      within(region).getByRole('link', { name: 'complaints@arta.gov.ph' })
    ).toHaveAttribute('href', 'mailto:complaints@arta.gov.ph');
    expect(
      within(region).getByRole('link', { name: 'pcc@malacanang.gov.ph' })
    ).toHaveAttribute('href', 'mailto:pcc@malacanang.gov.ph');
    expect(within(region).getByRole('link', { name: '8888' })).toHaveAttribute(
      'href',
      'tel:8888'
    );
    expect(
      within(region).getByRole('link', {
        name: 'email@contactcenterngbayan.gov.ph',
      })
    ).toHaveAttribute('href', 'mailto:email@contactcenterngbayan.gov.ph');
    expect(
      within(region).getByRole('link', { name: '0908 881 6565' })
    ).toHaveAttribute('href', 'tel:+639088816565');
  });

  it('shows the ARTA landline as text rather than guessing an area code', () => {
    renderWithProviders(<ContactPage />, { route: '/contact' });
    const region = getComplaintsRegion();

    expect(within(region).getByText('8-478-5093')).toBeInTheDocument();
    expect(
      within(region).queryByRole('link', { name: '8-478-5093' })
    ).not.toBeInTheDocument();
  });

  it('cites the charter pages the section is drawn from', () => {
    renderWithProviders(<ContactPage />, { route: '/contact' });

    expect(
      within(getComplaintsRegion()).getByText(
        /Citizen's Charter 2022, pp\. 340-341/
      )
    ).toBeInTheDocument();
  });

  it('is reachable from the on-page jump navigation', () => {
    renderWithProviders(<ContactPage />, { route: '/contact' });

    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(
      within(nav).getByRole('link', { name: en.contact.complaints.navLabel })
    ).toHaveAttribute('href', '#complaints');
    expect(document.getElementById('complaints')).toBe(getComplaintsRegion());
  });

  describe('arriving via /contact#complaints', () => {
    const scrollIntoView = vi.fn();
    const original = Element.prototype.scrollIntoView;

    beforeAll(() => {
      // jsdom does not implement scrollIntoView; the page calls it optionally.
      Element.prototype.scrollIntoView = scrollIntoView;
    });

    afterEach(() => {
      scrollIntoView.mockClear();
    });

    afterAll(() => {
      Element.prototype.scrollIntoView = original;
    });

    it('scrolls to and focuses the section the hash names', async () => {
      // ScrollToTop resets the window on every pathname change and ignores the
      // hash, so the service-page footer link would otherwise land at the top.
      renderWithProviders(<ContactPage />, { route: '/contact#complaints' });

      const region = getComplaintsRegion();
      await waitFor(() => {
        expect(scrollIntoView).toHaveBeenCalledTimes(1);
      });
      expect(scrollIntoView.mock.instances[0]).toBe(region);
      expect(document.activeElement).toBe(region);
    });

    it('does nothing when there is no hash', async () => {
      renderWithProviders(<ContactPage />, { route: '/contact' });

      // Give a queued animation frame the chance to run before asserting.
      await new Promise(resolve => requestAnimationFrame(resolve));
      expect(scrollIntoView).not.toHaveBeenCalled();
    });
  });

  describe('in Filipino', () => {
    beforeAll(async () => {
      await i18n.changeLanguage('fil');
    });

    afterAll(async () => {
      await i18n.changeLanguage('en');
    });

    it('renders every visible string from the fil bundle', () => {
      renderWithProviders(<ContactPage />, { route: '/contact' });

      const region = screen.getByRole('region', {
        name: fil.contact.complaints.title,
      });
      const table = within(region).getByRole('table', {
        name: fil.contact.complaints.tableCaption,
      });
      expect(
        within(table)
          .getAllByRole('rowheader')
          .map(h => h.textContent)
      ).toContain(fil.contact.complaints.channels.complaintForm.title);
      expect(
        within(region).getByRole('link', { name: /0917 813 3247/ })
      ).toHaveTextContent(fil.contact.complaints.textPrefix);
      expect(
        within(region).getByText(fil.contact.complaints.source)
      ).toBeInTheDocument();
      // Proper nouns stay as printed in the charter.
      expect(
        within(region).getByText('Contact Center ng Bayan (CCB)')
      ).toBeInTheDocument();
    });
  });
});
