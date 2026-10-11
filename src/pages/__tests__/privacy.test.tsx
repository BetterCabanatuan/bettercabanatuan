import { afterEach, describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import i18n from 'i18next';
import { renderWithProviders } from '../../test/test-utils';
import PrivacyPage, { NPC_CIRCULAR_16_01_URL, RA_10173_URL } from '../privacy';
import { siteConfig } from '../../lib/siteConfig';
import { VOLUNTEER_PROMPT_KEY } from '../../lib/volunteerPrompt';
import { sitemapGroups } from '../../data/sitemap';

/**
 * The notice is a statement of fact about this codebase. These tests pin the
 * facts it states to the code that makes them true, so a change to either side
 * surfaces here instead of on a live page.
 */
describe('PrivacyPage', () => {
  afterEach(async () => {
    await i18n.changeLanguage('en');
  });

  it('renders the notice with its single top-level heading', async () => {
    renderWithProviders(<PrivacyPage />, { route: '/privacy' });

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Privacy Notice' })
    ).toBeInTheDocument();
  });

  it('states the DPO line verbatim and without placeholder brackets', () => {
    renderWithProviders(<PrivacyPage />, { route: '/privacy' });

    const line = screen.getByText(
      'Data Protection Officer: to be confirmed by the City Government'
    );
    expect(line).toBeInTheDocument();
    expect(line.textContent).not.toMatch(/[[\]]/);
  });

  it('links the legal basis to its primary sources', () => {
    renderWithProviders(<PrivacyPage />, { route: '/privacy' });

    const law = screen.getByRole('link', { name: /RA 10173/ });
    expect(law).toHaveAttribute('href', RA_10173_URL);
    expect(law).toHaveAttribute('rel', 'noopener noreferrer');
    expect(RA_10173_URL).toMatch(/^https:\/\/lawphil\.net\//);

    const circular = screen.getByRole('link', { name: /Circular 16-01/ });
    expect(circular).toHaveAttribute('href', NPC_CIRCULAR_16_01_URL);
    expect(NPC_CIRCULAR_16_01_URL).toMatch(/^https:\/\/privacy\.gov\.ph\//);
  });

  it('names every localStorage key the site actually writes', () => {
    renderWithProviders(<PrivacyPage />, { route: '/privacy' });

    const text = document.body.textContent ?? '';
    // i18next-browser-languagedetector default; src/i18n.ts sets no override.
    expect(text).toContain('i18nextLng');
    expect(text).toContain(VOLUNTEER_PROMPT_KEY);
  });

  it('offers the portal volunteers’ email, not a form', () => {
    renderWithProviders(<PrivacyPage />, { route: '/privacy' });

    const mail = screen.getByRole('link', {
      name: 'Email the volunteers about privacy',
    });
    expect(mail.getAttribute('href')).toMatch(
      new RegExp(`^mailto:${siteConfig.portalEmail}\\?subject=`)
    );
    expect(document.querySelector('form')).toBeNull();
  });

  it('says the portal is community-run and links to the contact page', () => {
    renderWithProviders(<PrivacyPage />, { route: '/privacy' });

    expect(
      screen.getByRole('heading', { name: 'Not the official city website' })
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      '/contact'
    );
  });

  it('renders in Tagalog when the language is switched', async () => {
    await i18n.changeLanguage('fil');
    renderWithProviders(<PrivacyPage />, { route: '/privacy' });

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Paunawa sa Privacy',
      })
    ).toBeInTheDocument();
    // The DPO line is deliberately identical in both languages.
    expect(
      screen.getByText(
        'Data Protection Officer: to be confirmed by the City Government'
      )
    ).toBeInTheDocument();
  });

  it('is listed in the sitemap main group beside Accessibility', () => {
    const main = sitemapGroups.find(group => group.id === 'main');
    const hrefs = main?.links.map(link => link.href) ?? [];

    expect(hrefs).toContain('/privacy');
    expect(hrefs.indexOf('/privacy')).toBe(hrefs.indexOf('/accessibility') + 1);
  });
});
