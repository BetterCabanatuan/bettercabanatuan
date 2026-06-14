import { useMemo, useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import { Banner } from '@bettergov/kapwa/banner';
import type { Department } from '../../../data/yamlLoader';
import DepartmentCard from './DepartmentCard';

interface DepartmentsListProps {
  departments: Department[];
}

export default function DepartmentsList({ departments }: DepartmentsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  const branches = useMemo(
    () => [...new Set(departments.map(d => d.branch))].sort(),
    [departments]
  );

  const filteredDepartments = useMemo(() => {
    let result = [...departments];

    if (branchFilter) {
      result = result.filter(d => d.branch === branchFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        d =>
          d.name.toLowerCase().includes(q) ||
          d.acronym.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          d.branch.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => a.name.localeCompare(b.name));
  }, [departments, branchFilter, searchQuery]);

  const groupedDepartments = useMemo(() => {
    if (branchFilter || searchQuery.trim()) {
      return [{ branch: null as string | null, items: filteredDepartments }];
    }

    const groups = new Map<string, Department[]>();
    filteredDepartments.forEach(department => {
      const list = groups.get(department.branch) ?? [];
      list.push(department);
      groups.set(department.branch, list);
    });

    return [...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([branch, items]) => ({ branch, items }));
  }, [filteredDepartments, branchFilter, searchQuery]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search departments..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full min-h-[44px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            aria-label="Search departments"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 shrink-0">Branch:</span>
          <div className="relative">
            <select
              value={branchFilter}
              onChange={e => setBranchFilter(e.target.value)}
              className="appearance-none min-h-[44px] pl-3 pr-8 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
              aria-label="Filter by branch"
            >
              <option value="">All branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>
                  {branch}
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

      <Text className="text-gray-500 mb-6 text-sm">
        Showing {filteredDepartments.length} of {departments.length} offices
      </Text>

      {filteredDepartments.length === 0 ? (
        <Banner
          type="info"
          title="No departments found"
          description="Try adjusting your search or branch filter."
          icon
        />
      ) : (
        <div className="space-y-10">
          {groupedDepartments.map(group => (
            <section
              key={group.branch ?? 'all'}
              aria-labelledby={
                group.branch ? `branch-${group.branch}` : undefined
              }
            >
              {group.branch && (
                <Heading
                  level={3}
                  id={`branch-${group.branch}`}
                  className="text-lg mb-4 pb-2 border-b border-gray-200"
                >
                  {group.branch}
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({group.items.length})
                  </span>
                </Heading>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {group.items.map(department => (
                  <DepartmentCard
                    key={department.slug}
                    department={department}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
