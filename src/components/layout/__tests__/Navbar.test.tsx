import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Navbar from '../Navbar';

describe('Navbar', () => {
  it('gives every language selector an accessible name', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const selectors = screen.getAllByRole('combobox', { name: /language/i });
    expect(selectors).toHaveLength(2);
  });

  it('opens the desktop Services menu by click and closes it with Escape', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const trigger = screen.getByRole('button', {
      name: 'Toggle Services menu',
    });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the desktop menu when clicking outside it', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const trigger = screen.getByRole('button', {
      name: 'Toggle Services menu',
    });
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('keeps ordinary mobile destinations as links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link', { name: 'Government' });
    expect(links).toHaveLength(2);
    links.forEach(link => expect(link).toHaveAttribute('href', '/government'));
  });
});
