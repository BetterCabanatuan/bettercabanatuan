import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DepartmentContactsSection from '../DepartmentContactsSection';
import {
  departmentContactsData,
  getContactsForDepartment,
  getDepartmentHref,
  getUnresolvedDepartmentSlugs,
} from '../../../data/departmentContacts';
import { allDepartments, getDepartmentBySlug } from '../../../data/yamlLoader';

describe('DepartmentContactsSection', () => {
  it('renders department contact directory with office hours', () => {
    renderWithProviders(<DepartmentContactsSection />);

    expect(
      screen.getByRole('heading', { name: 'Department Contact Numbers' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(departmentContactsData.officeHours)
    ).toBeInTheDocument();
    expect(screen.getByText("City Mayor's Office - Admin")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '0919-081-3749' })).toHaveAttribute(
      'href',
      'tel:+639190813749'
    );
  });

  it('filters offices by search query', async () => {
    const user = userEvent.setup();

    renderWithProviders(<DepartmentContactsSection />);

    await user.type(
      screen.getByRole('searchbox', { name: 'Search offices or numbers…' }),
      'Civil Registry'
    );

    expect(screen.getByText('Local Civil Registry Office')).toBeInTheDocument();
    expect(
      screen.queryByText("City Mayor's Office - Admin")
    ).not.toBeInTheDocument();
  });
});

describe('getContactsForDepartment', () => {
  it('returns all contact lines for a department slug', () => {
    const contacts = getContactsForDepartment('executive');

    expect(contacts).toHaveLength(2);
    expect(contacts.map(c => c.phone)).toEqual([
      '0919-081-3749',
      '0919-081-3983',
    ]);
  });

  it('returns the health office lines that point at the CHO page', () => {
    const contacts = getContactsForDepartment('cho');
    const expected = departmentContactsData.contacts.filter(
      contact => contact.departmentSlug === 'cho'
    );

    expect(contacts).toHaveLength(expected.length);
    expect(contacts).toHaveLength(2);
    expect(contacts.map(c => c.phone)).toEqual([
      '0919-081-1348',
      '0919-081-0167',
    ]);
  });
});

describe('department link integrity', () => {
  it('resolves every department slug used by the contact directory', () => {
    expect(getUnresolvedDepartmentSlugs()).toEqual([]);
  });

  it('only emits links for slugs that exist in the departments dataset', () => {
    departmentContactsData.contacts.forEach(contact => {
      const href = getDepartmentHref(contact.departmentSlug);

      if (!contact.departmentSlug) {
        expect(href).toBeUndefined();
        return;
      }

      expect(href).toBe(`/government/departments/${contact.departmentSlug}`);
      expect(getDepartmentBySlug(contact.departmentSlug!)).toBeDefined();
    });
  });

  it('points the City Legal Office at its own page, not CSWDO', () => {
    const legalOffice = departmentContactsData.contacts.find(
      contact => contact.name === 'City Legal Office'
    );

    expect(legalOffice).toBeDefined();
    expect(legalOffice!.phone).toBe('0919-081-0213');
    expect(legalOffice!.departmentSlug).toBe('city-legal-office');
    expect(getDepartmentHref(legalOffice!.departmentSlug)).toBe(
      '/government/departments/city-legal-office'
    );
    expect(getDepartmentBySlug('city-legal-office')?.name).toBe(
      'City Legal Office'
    );
  });

  it('keeps contact numbers for offices that have a department page', () => {
    const tourism = departmentContactsData.contacts.find(
      contact => contact.departmentSlug === 'tourism'
    );
    const ceepumo = departmentContactsData.contacts.find(
      contact => contact.departmentSlug === 'ceepumo'
    );

    expect(tourism?.phone).toBe('0998-500-2725');
    expect(ceepumo?.phone).toBe('0919-081-2785');
    expect(getDepartmentBySlug('tourism')).toBeDefined();
    expect(getDepartmentBySlug('ceepumo')).toBeDefined();
  });

  it('returns undefined for slugs that are not departments', () => {
    expect(getDepartmentHref('not-a-real-office')).toBeUndefined();
    expect(getDepartmentHref(undefined)).toBeUndefined();
  });

  it('has unique department slugs', () => {
    const slugs = allDepartments.map(department => department.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
