import { Card, CardContent } from '../../ui/Card';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import {
  formatOfficialName,
  getOfficialBarangayRoster,
  officialBarangayRosterSource,
} from '../../../data/officialBarangayRoster';

interface OfficialBarangayRosterProps {
  barangaySlug: string;
}

export function OfficialBarangayRoster({
  barangaySlug,
}: OfficialBarangayRosterProps) {
  const officials = getOfficialBarangayRoster(barangaySlug);
  if (officials.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <Heading level={3} className="mb-4">
          Barangay officials
        </Heading>
        <p className="text-sm text-gray-500 mb-4">
          Term: {officialBarangayRosterSource.term}
        </p>
        <ul className="divide-y divide-gray-200">
          {officials.map((official, index) => (
            <li
              key={`${official.position}-${official.termInPosition}-${index}`}
              className="grid grid-cols-1 sm:grid-cols-[minmax(10rem,1fr)_2fr] gap-1 sm:gap-4 py-3 first:pt-0 last:pb-0"
            >
              <span className="text-sm font-medium text-gray-700">
                {official.position}
              </span>
              <span className="text-sm text-gray-900">
                {formatOfficialName(official)}
              </span>
            </li>
          ))}
        </ul>
        <Text size="sm" className="text-xs text-gray-500 mt-4 mb-0">
          Reference:{' '}
          <a
            href="https://www.dilg.gov.ph/barangay-officials-directory"
            target="_blank"
            rel="noreferrer"
          >
            DILG Barangay Officials Directory
          </a>
          . Roster data is based on the provided workbook (term{' '}
          {officialBarangayRosterSource.term}) and has not been independently
          verified against DILG. Telephone values are not shown.
        </Text>
      </CardContent>
    </Card>
  );
}
