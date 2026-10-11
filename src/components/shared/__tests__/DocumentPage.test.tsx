import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import i18n from 'i18next';
import { renderWithProviders } from '../../../test/test-utils';
import DocumentPage from '../DocumentPage';
import en from '../../../../public/locales/en/common.json';
import fil from '../../../../public/locales/fil/common.json';

/**
 * The loader is mocked so this test does not depend on which Markdown pages
 * exist under content/ at any given moment. Content is edited independently
 * of the component, and a missing slug should fail a content check, not this.
 */
vi.mock('../../../lib/markdownLoader', () => ({
  loadMarkdownContent: vi.fn(async () => ({
    title: 'Sample service',
    description: 'What you can get and what to bring.',
    content:
      '# Sample service\n\nWhat you can get and what to bring.\n\n## Requirements\n\n- One valid ID\n',
  })),
}));

function renderServiceDocument() {
  return renderWithProviders(<DocumentPage categoryType="service" />, {
    route: '/services/business/sample-service',
    routePattern: '/services/:categoryId/:documentSlugId',
  });
}

describe('DocumentPage complaint footer', () => {
  it('links every service page to the complaints section of Contact', async () => {
    // RA 11032 s.6(g): the complaint procedure is published with the charter.
    renderServiceDocument();

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sample service' })
    ).toBeInTheDocument();

    expect(
      screen.getByText(en.documentPage.complaintPrompt, { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: en.documentPage.complaintLink })
    ).toHaveAttribute('href', '/contact#complaints');
  });

  it('renders the link after the document body, not inside it', async () => {
    renderServiceDocument();
    await screen.findByRole('heading', { level: 1, name: 'Sample service' });

    const link = screen.getByRole('link', {
      name: en.documentPage.complaintLink,
    });
    const body = document.querySelector('.markdown-content');
    expect(body).not.toBeNull();
    expect(body!.contains(link)).toBe(false);
    // DOCUMENT_POSITION_FOLLOWING: the link comes after the body card.
    expect(
      body!.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('omits the footer on government pages', async () => {
    renderWithProviders(<DocumentPage categoryType="government" />, {
      route: '/government/departments/sample-service',
      routePattern: '/government/:categoryId/:documentSlugId',
    });
    await screen.findByRole('heading', { level: 1, name: 'Sample service' });

    expect(
      screen.queryByRole('link', { name: en.documentPage.complaintLink })
    ).not.toBeInTheDocument();
  });

  describe('in Filipino', () => {
    beforeAll(async () => {
      await i18n.changeLanguage('fil');
    });

    afterAll(async () => {
      await i18n.changeLanguage('en');
    });

    it('reads the footer from the fil bundle', async () => {
      renderServiceDocument();
      await screen.findByRole('heading', { level: 1, name: 'Sample service' });

      expect(
        screen.getByRole('link', { name: fil.documentPage.complaintLink })
      ).toHaveAttribute('href', '/contact#complaints');
    });
  });
});
