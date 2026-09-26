import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import SectionJumpNav from '../SectionJumpNav';
import ResponsiveDisclosure from '../ResponsiveDisclosure';

describe('SectionJumpNav', () => {
  it('renders named anchor links for long-page sections', () => {
    render(
      <SectionJumpNav
        label="On this page"
        items={[
          { id: 'hotlines', label: 'Emergency hotlines' },
          { id: 'departments', label: 'Department contacts' },
        ]}
      />
    );

    expect(
      screen.getByRole('navigation', { name: 'On this page' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Emergency hotlines' })
    ).toHaveAttribute('href', '#hotlines');
  });
});

describe('ResponsiveDisclosure', () => {
  it('announces its item count and toggles expanded state', () => {
    render(
      <ResponsiveDisclosure title="Hospitals" count={6} defaultOpen={false}>
        <a href="/hospital">Hospital directory</a>
      </ResponsiveDisclosure>
    );

    const trigger = screen.getByRole('button', { name: /Hospitals, 6 items/ });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    const content = screen.getByTestId('responsive-disclosure-content');
    expect(content).toHaveClass('hidden');
    expect(screen.getByRole('link')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(content).not.toHaveClass('hidden');
  });
});
