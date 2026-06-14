import { Link } from 'react-router-dom';
import { ArrowRight, Building2 } from 'lucide-react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import type { Department } from '../../../data/yamlLoader';

interface DepartmentCardProps {
  department: Department;
}

export default function DepartmentCard({ department }: DepartmentCardProps) {
  return (
    <Link
      to={`/government/departments/${department.slug}`}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-xl"
    >
      <Card
        hoverable
        className="h-full border-t-4 border-primary-500 transition-transform duration-200 group-hover:-translate-y-0.5"
      >
        <CardContent className="p-6 flex flex-col h-full">
          <div className="flex items-start justify-between gap-3 mb-4">
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary-50 text-primary-600 shrink-0">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">
              {department.acronym}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-700 transition-colors duration-200 mb-2">
            {department.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
            {department.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">{department.branch}</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:gap-2 transition-all duration-200">
              View details
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
