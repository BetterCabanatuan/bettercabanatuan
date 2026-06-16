import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../test/test-utils';
import ProjectCard from '../ProjectCard';
import ProjectStatusBadge from '../ProjectStatusBadge';
import ProjectsList from '../ProjectsList';
import { allProjects } from '../../../../data/yamlLoader';

describe('ProjectStatusBadge', () => {
  it.each([
    ['ongoing', 'Ongoing'],
    ['planned', 'Planned'],
    ['completed', 'Completed'],
  ] as const)('renders %s status label', (status, label) => {
    render(<ProjectStatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it('renders custom status labels', () => {
    render(<ProjectStatusBadge status="under review" />);
    expect(screen.getByText('Under Review')).toBeInTheDocument();
  });

  it('renders nothing when status is omitted', () => {
    const { container } = render(<ProjectStatusBadge />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('ProjectCard', () => {
  it('links to project detail page', () => {
    const project = allProjects[0];

    renderWithProviders(<ProjectCard project={project} />);

    const link = document.querySelector(
      `a[href="/government/projects/${project.slug}"]`
    );
    expect(link).not.toBeNull();
    expect(link).toHaveTextContent(project.name);
  });
});

describe('ProjectsList', () => {
  it('renders all projects by default', () => {
    renderWithProviders(<ProjectsList projects={allProjects} />);

    expect(
      screen.getByText(`Showing ${allProjects.length} projects`)
    ).toBeInTheDocument();
    allProjects.forEach(project => {
      expect(screen.getByText(project.name)).toBeInTheDocument();
    });
  });
});
