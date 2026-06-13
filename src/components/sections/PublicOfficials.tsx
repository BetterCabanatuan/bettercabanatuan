import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Text } from '../ui/Text';
import { Card, CardContent } from '@bettergov/kapwa/card';
import { Banner } from '@bettergov/kapwa/banner';
import { publicOfficials } from '../../data/publicOfficials';
import {
  Crown,
  Gavel,
  Landmark,
  Search,
  ChevronDown,
  Building2,
} from 'lucide-react';

export default function PublicOfficials() {
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'position'>('position');

  const filteredOfficials = useMemo(() => {
    let result = [...publicOfficials];

    if (positionFilter !== 'all') {
      if (positionFilter === 'executive') {
        result = result.filter(
          o => o.position === 'City Mayor' || o.position === 'Vice Mayor'
        );
      } else if (positionFilter === 'councilor') {
        result = result.filter(o =>
          o.position.includes('Sangguniang Panlungsod')
        );
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        o =>
          o.name.toLowerCase().includes(q) ||
          o.position.toLowerCase().includes(q) ||
          (o.description && o.description.toLowerCase().includes(q)) ||
          (o.committees && o.committees.some(c => c.toLowerCase().includes(q)))
      );
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.lastName.localeCompare(b.lastName));
    } else if (sortBy === 'position') {
      const positionOrder = [
        'City Mayor',
        'Vice Mayor',
        'Sangguniang Panlungsod Member (City Councilor)',
      ];
      result.sort((a, b) => {
        const aIndex = positionOrder.indexOf(a.position);
        const bIndex = positionOrder.indexOf(b.position);
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.lastName.localeCompare(b.lastName);
      });
    }

    return result;
  }, [positionFilter, searchQuery, sortBy]);

  const getIcon = (position: string) => {
    if (position === 'City Mayor') {
      return <Crown className="h-5 w-5 text-yellow-600" />;
    }
    if (position === 'Vice Mayor') {
      return <Landmark className="h-5 w-5 text-primary-600" />;
    }
    return <Gavel className="h-5 w-5 text-blue-600" />;
  };

  const getBadgeClass = (position: string) => {
    if (position === 'City Mayor') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (position === 'Vice Mayor') {
      return 'bg-primary-100 text-primary-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search officials by name, position, or committee..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'name' | 'position')}
              className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
            >
              <option value="name">Name</option>
              <option value="position">Position</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Position filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setPositionFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            positionFilter === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Officials
        </button>
        <button
          onClick={() => setPositionFilter('executive')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            positionFilter === 'executive'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Mayor & Vice Mayor
        </button>
        <button
          onClick={() => setPositionFilter('councilor')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            positionFilter === 'councilor'
              ? 'bg-primary-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          City Councilors
        </button>
      </div>

      {/* Results count */}
      <Text className="text-gray-500 mb-4 text-sm">
        Showing {filteredOfficials.length} official
        {filteredOfficials.length !== 1 ? 's' : ''}
      </Text>

      {/* Grid */}
      {filteredOfficials.length === 0 ? (
        <Banner
          type="info"
          title="No officials found"
          description="Try adjusting your search or filters."
          icon
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOfficials.map(official => (
            <Card hoverable className="h-full border-t-4 border-primary-500">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getIcon(official.position)}
                    <h4 className="text-lg font-medium text-gray-900">
                      {official.name}
                    </h4>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getBadgeClass(
                      official.position
                    )}`}
                  >
                    {official.position === 'City Mayor'
                      ? 'Mayor'
                      : official.position === 'Vice Mayor'
                        ? 'Vice Mayor'
                        : 'Councilor'}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {official.description}
                </p>

                {official.committees && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {official.committees.slice(0, 2).map(committee => (
                      <span
                        key={committee}
                        className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700"
                      >
                        {committee}
                      </span>
                    ))}
                    {official.committees.length > 2 && (
                      <span className="inline-block px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                        +{official.committees.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center text-xs text-gray-500">
                  <Building2 className="h-3 w-3 mr-1" />
                  Term: {official.term}
                </div>
                {official.contact?.email ||
                official.contact?.office ||
                official.contact?.phone ? (
                  <div className="flex flex-col gap-1">
                    {official?.contact?.email && (
                      <span className="text-xs text-gray-500">
                        Email:
                        <Link
                          to={`mailto:${official?.contact.email}`}
                          className="text-xs text-primary-600 hover:underline"
                        >
                          {official.contact.email}
                        </Link>
                      </span>
                    )}
                    {official?.contact?.phone && (
                      <span className="text-xs text-gray-500">
                        Phone:{' '}
                        <Link
                          to={`tel:${official?.contact.phone}`}
                          className="text-xs text-primary-600 hover:underline"
                        >
                          {official.contact.phone}
                        </Link>
                      </span>
                    )}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      Office Address:
                      {official?.contact?.office && (
                        <span className="text-xs text-gray-700">
                          {official.contact.office}
                        </span>
                      )}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 mt-3">
                    No contact information available
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
