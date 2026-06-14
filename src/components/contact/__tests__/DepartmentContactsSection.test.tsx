import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DepartmentContactsSection from '../DepartmentContactsSection';
import {
  departmentContactsData,
  getContactsForDepartment,
} from '../../../data/departmentContacts';

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

  it('returns health office lines for CHO', () => {
    const contacts = getContactsForDepartment('cho');

    expect(contacts).toHaveLength(3);
  });
});
