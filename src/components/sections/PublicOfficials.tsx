import { useState, useMemo } from 'react';
import { Text } from '../ui/Text';
import { Card, CardContent } from '../ui/Card';
import { Banner } from '@bettergov/kapwa/banner';
import CardGrid, { CardGridItem } from '../ui/CardGrid';
import OfficialPortrait from '../ui/OfficialPortrait';
import StatusBadge, { type BadgeTone } from '../ui/StatusBadge';
import {
  publicOfficials,
  hasBallotNameDifference,
} from '../../data/publicOfficials';
import { Search, ChevronDown, Building2 } from 'lucide-react';

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

  const getBadgeTone = (position: string): BadgeTone => {
    if (position === 'City Mayor') return 'accent';
    if (position === 'Vice Mayor') return 'info';
    return 'neutral';
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
        <CardGrid label="Public officials">
          {filteredOfficials.map(official => (
            <CardGridItem key={official.id}>
              <Card hoverable className="h-full ring-1 ring-black/[0.06]">
                <CardContent className="flex h-full flex-col p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <OfficialPortrait
                      src={official.avatar}
                      name={official.name}
                      position={official.position}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-medium text-gray-900">
                        {official.name}
                      </h4>
                      <StatusBadge
                        tone={getBadgeTone(official.position)}
                        size="sm"
                        className="mt-1"
                      >
                        {official.position === 'City Mayor'
                          ? 'Mayor'
                          : official.position === 'Vice Mayor'
                            ? 'Vice Mayor'
                            : 'Councilor'}
                      </StatusBadge>
                    </div>
                  </div>

                  {official.description && (
                    <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                      {official.description}
                    </p>
                  )}

                  {hasBallotNameDifference(official) && (
                    <p className="mb-3 text-xs text-gray-500">
                      <span className="font-medium text-gray-600">
                        On the ballot:
                      </span>{' '}
                      {official.ballotName}
                    </p>
                  )}

                  {official.committees && official.committees.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1">
                      {official.committees.slice(0, 2).map(committee => (
                        <span
                          key={committee}
                          className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                        >
                          {committee}
                        </span>
                      ))}
                      {official.committees.length > 2 && (
                        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          +{official.committees.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="mb-2 flex items-center text-xs text-gray-500">
                      <Building2
                        className="mr-1 size-3 shrink-0"
                        aria-hidden="true"
                      />
                      Term: {official.term}
                    </div>

                    {official.contact?.email ||
                    official.contact?.office ||
                    official.contact?.phone ? (
                      <dl className="flex flex-col gap-1 text-xs">
                        {official.contact.email && (
                          <div className="flex gap-1">
                            <dt className="shrink-0 text-gray-500">Email:</dt>
                            <dd className="min-w-0">
                              <a
                                href={`mailto:${official.contact.email}`}
                                className="break-all text-primary-600 hover:underline"
                              >
                                {official.contact.email}
                              </a>
                            </dd>
                          </div>
                        )}
                        {official.contact.phone && (
                          <div className="flex gap-1">
                            <dt className="shrink-0 text-gray-500">Phone:</dt>
                            <dd className="min-w-0">
                              <a
                                href={`tel:${official.contact.phone}`}
                                className="text-primary-600 hover:underline"
                              >
                                {official.contact.phone}
                              </a>
                            </dd>
                          </div>
                        )}
                        {official.contact.office && (
                          <div className="flex gap-1">
                            <dt className="shrink-0 text-gray-500">Office:</dt>
                            <dd className="min-w-0 text-gray-700">
                              {official.contact.office}
                            </dd>
                          </div>
                        )}
                      </dl>
                    ) : (
                      <p className="text-xs text-gray-500">
                        No contact information available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardGridItem>
          ))}
        </CardGrid>
      )}
    </div>
  );
}
