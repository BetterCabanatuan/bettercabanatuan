import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import VolunteerDialog from '../VolunteerDialog';
import { VOLUNTEER_PROMPT_KEY } from '../../../lib/volunteerPrompt';

const renderDialog = () => renderWithProviders(<VolunteerDialog />);

describe('VolunteerDialog', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('shows on a first visit', () => {
    renderDialog();

    expect(
      screen.getByRole('dialog', { name: /Be Part of Something Greater/ })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/deserves a world-class digital government/)
    ).toBeInTheDocument();
  });

  it('stays hidden when the stored value is 0', () => {
    localStorage.setItem(VOLUNTEER_PROMPT_KEY, '0');

    renderDialog();

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders every volunteer role from the reference design', () => {
    renderDialog();

    [
      'Software Dev',
      'UI/UX Design',
      'Graphic Design',
      'Content Creation',
      'Digital Marketing',
      'Research',
    ].forEach(role => {
      expect(screen.getByText(role)).toBeInTheDocument();
    });
  });

  it('links the call to action to the volunteer mailbox', () => {
    renderDialog();

    const cta = screen.getByRole('link', { name: /I Want to Volunteer/ });
    expect(cta).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:bettercabanatuan@gmail.com')
    );
  });

  it('stores 0 when dismissed via "Maybe Later"', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Maybe Later' }));

    expect(localStorage.getItem(VOLUNTEER_PROMPT_KEY)).toBe('0');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('stores 0 when dismissed via the close button', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(
      screen.getByRole('button', { name: 'Close volunteer invitation' })
    );

    expect(localStorage.getItem(VOLUNTEER_PROMPT_KEY)).toBe('0');
  });

  it('stores 0 when the volunteer link is followed', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('link', { name: /I Want to Volunteer/ }));

    expect(localStorage.getItem(VOLUNTEER_PROMPT_KEY)).toBe('0');
  });

  it('closes on Escape and stores 0', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(localStorage.getItem(VOLUNTEER_PROMPT_KEY)).toBe('0');
  });

  it('is announced as a modal dialog with a name and description', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');

    const labelledBy = dialog.getAttribute('aria-labelledby')!;
    const describedBy = dialog.getAttribute('aria-describedby')!;
    expect(document.getElementById(labelledBy)).toBeInTheDocument();
    expect(document.getElementById(describedBy)).toBeInTheDocument();
  });

  it('moves focus into the dialog when it opens', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('traps Tab inside the dialog', async () => {
    const user = userEvent.setup();
    renderDialog();

    const dialog = screen.getByRole('dialog');
    // Tab past every control; focus must never leave the dialog.
    for (let i = 0; i < 8; i++) {
      await user.tab();
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });

  it('returns focus to the previously focused element on close', async () => {
    const opener = document.createElement('button');
    opener.textContent = 'opener';
    document.body.appendChild(opener);
    opener.focus();

    const { unmount } = renderDialog();

    expect(document.activeElement).not.toBe(opener);
    unmount();
    expect(document.activeElement).toBe(opener);

    opener.remove();
  });

  it('locks background scrolling while open and restores it after', async () => {
    document.body.style.overflow = 'auto';
    renderDialog();

    expect(document.body.style.overflow).toBe('hidden');

    await userEvent.keyboard('{Escape}');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('does not show the literal Trans markup in the body copy', () => {
    renderDialog();

    const dialog = screen.getByRole('dialog');
    expect(dialog.textContent).not.toMatch(/<\/?\d>/);
    expect(within(dialog).getByText('Cabanatueños')).toBeInTheDocument();
  });

  it('gives the close button a 44px touch target', () => {
    renderDialog();

    const close = screen.getByRole('button', {
      name: 'Close volunteer invitation',
    });
    expect(close.className).toContain('w-11');
    expect(close.className).toContain('h-11');
  });
});
