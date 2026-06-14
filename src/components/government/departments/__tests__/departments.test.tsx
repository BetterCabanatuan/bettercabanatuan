import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../test/test-utils';
import DepartmentCard from '../DepartmentCard';
import DepartmentsList from '../DepartmentsList';
import DepartmentsOverview from '../DepartmentsOverview';
import { allDepartments } from '../../../../data/yamlLoader';

describe('DepartmentCard', () => {
  it('links to department detail page', () => {
    const department = allDepartments.find(d => d.slug === 'bplo')!;

    renderWithProviders(<DepartmentCard department={department} />);

    expect(screen.getByText('BPLO')).toBeInTheDocument();
    const link = document.querySelector(
      'a[href="/government/departments/bplo"]'
    );
    expect(link).not.toBeNull();
    expect(link).toHaveTextContent('Business Permits and Licensing Office');
  });
});

describe('DepartmentsOverview', () => {
  it('shows department statistics', () => {
    renderWithProviders(<DepartmentsOverview departments={allDepartments} />);

    expect(screen.getByText('Total Offices')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });
});

describe('DepartmentsList', () => {
  it('filters departments by search query', async () => {
    const user = userEvent.setup();

    renderWithProviders(<DepartmentsList departments={allDepartments} />);

    expect(screen.getByText(/Showing 18 of 18 offices/)).toBeInTheDocument();

    await user.type(
      screen.getByRole('searchbox', { name: 'Search departments' }),
      'CDRRMO'
    );

    expect(screen.getByText(/Showing 1 of 18 offices/)).toBeInTheDocument();
    expect(
      screen.getByText('City Disaster Risk Reduction and Management Office')
    ).toBeInTheDocument();
  });

  it('filters departments by branch', async () => {
    const user = userEvent.setup();

    renderWithProviders(<DepartmentsList departments={allDepartments} />);

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Filter by branch' }),
      'Legislative'
    );

    expect(screen.getByText(/Showing 1 of 18 offices/)).toBeInTheDocument();
    expect(screen.getByText('Sangguniang Panlungsod')).toBeInTheDocument();
  });
});
