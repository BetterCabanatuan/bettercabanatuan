import { useMemo } from 'react';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Building2, Landmark, Wallet } from 'lucide-react';
import type { Department } from '../../../data/yamlLoader';

interface DepartmentsOverviewProps {
  departments: Department[];
}

export default function DepartmentsOverview({
  departments,
}: DepartmentsOverviewProps) {
  const stats = useMemo(() => {
    const branches = new Set(departments.map(d => d.branch));
    const legislative = departments.filter(d => d.branch === 'Legislative').length;
    const finance = departments.filter(d => d.branch === 'Finance').length;

    return {
      total: departments.length,
      branches: branches.size,
      legislative,
      finance,
    };
  }, [departments]);

  const cards = [
    {
      label: 'Total Offices',
      value: String(stats.total),
      note: 'City departments listed',
      icon: Building2,
      border: 'border-primary-500',
      bg: 'bg-primary-50 text-primary-600',
    },
    {
      label: 'Branch Groups',
      value: String(stats.branches),
      note: 'Organized by function',
      icon: Landmark,
      border: 'border-accent-500',
      bg: 'bg-accent-50 text-accent-600',
    },
    {
      label: 'Finance Offices',
      value: String(stats.finance),
      note: 'Accounting, budget, treasury',
      icon: Wallet,
      border: 'border-success-500',
      bg: 'bg-success-50 text-success-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
      {cards.map(card => (
        <Card key={card.label} className={`border-t-4 ${card.border} h-full`}>
          <CardContent className="p-5">
            <span
              className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.bg} mb-3`}
            >
              <card.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-2xl font-bold text-gray-900 tabular-nums mb-1">
              {card.value}
            </p>
            <p className="text-sm font-medium text-gray-900">{card.label}</p>
            <p className="text-xs text-gray-500 mt-1">{card.note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
