import { useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Text } from '../../ui/Text';
import { Banner } from '@bettergov/kapwa/banner';
import type { Project, ProjectStatus } from '../../../data/yamlLoader';
import ProjectCard from './ProjectCard';

interface ProjectsListProps {
  projects: Project[];
}

const statusFilters: { value: ProjectStatus | ''; label: string }[] = [
  { value: '', label: 'All statuses' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'planned', label: 'Planned' },
  { value: 'completed', label: 'Completed' },
];

export default function ProjectsList({ projects }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | ''>('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = useMemo(
    () => [...new Set(projects.map(p => p.category))].sort(),
    [projects]
  );

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (statusFilter) {
      result = result.filter(p => p.status === statusFilter);
    }

    if (categoryFilter) {
      result = result.filter(p => p.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [projects, statusFilter, categoryFilter, searchQuery]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            aria-label="Search projects"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0">Status:</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e =>
                  setStatusFilter(e.target.value as ProjectStatus | '')
                }
                className="appearance-none min-h-[44px] pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                aria-label="Filter by status"
              >
                {statusFilters.map(option => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0">Category:</span>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="appearance-none min-h-[44px] pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                aria-label="Filter by category"
              >
                <option value="">All categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>

      <Text className="text-gray-500 mb-4 text-sm">
        Showing {filteredProjects.length} project
        {filteredProjects.length !== 1 ? 's' : ''}
      </Text>

      {filteredProjects.length === 0 ? (
        <Banner
          type="info"
          title="No projects found"
          description="Try adjusting your search or filters."
          icon
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
