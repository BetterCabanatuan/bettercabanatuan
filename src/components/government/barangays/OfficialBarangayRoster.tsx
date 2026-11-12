import { Card, CardContent } from '../../ui/Card';
import { Heading } from '../../ui/Heading';
import { Text } from '../../ui/Text';
import InitialsAvatar from '../../ui/InitialsAvatar';
import StatusBadge from '../../ui/StatusBadge';
import { cn } from '../../../lib/utils';
import {
  formatOfficialName,
  formatTerm,
  getOfficialBarangayRoster,
  officialBarangayRosterSource,
  type OfficialBarangayRecord,
} from '../../../data/officialBarangayRoster';

const GROUPS = [
  {
    title: 'Barangay Council',
    lead: 'Punong Barangay',
    members: 'Sangguniang Barangay Member',
    membersTitle: 'Kagawad (council members)',
    staff: ['Barangay Secretary', 'Barangay Treasurer'],
  },
  {
    title: 'Sangguniang Kabataan (SK)',
    lead: 'SK Chairperson',
    members: 'SK Member',
    membersTitle: 'SK members',
    staff: ['SK Secretary', 'SK Treasurer'],
  },
];

const KNOWN = new Set(GROUPS.flatMap(g => [g.lead, g.members, ...g.staff]));

function Person({
  official,
  detail,
  lead = false,
}: {
  official: OfficialBarangayRecord;
  detail: string;
  lead?: boolean;
}) {
  const name = formatOfficialName(official);
  return (
    <li
      className={cn(
        'flex items-center gap-3 rounded-lg p-3',
        lead ? 'bg-primary-50 ring-1 ring-inset ring-primary-100' : 'bg-gray-50'
      )}
    >
      <InitialsAvatar name={name} size={lead ? 'md' : 'sm'} />
      <div className="min-w-0">
        {lead && (
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
            {official.position}
          </p>
        )}
        <p
          className={cn(
            'font-medium text-gray-900',
            lead ? 'text-base' : 'text-sm'
          )}
        >
          {name}
        </p>
        {detail && <p className="text-xs text-gray-600">{detail}</p>}
      </div>
    </li>
  );
}

function SubList({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      {title && (
        <h5 className="mb-2 text-sm font-medium text-gray-700">{title}</h5>
      )}
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</ul>
    </div>
  );
}

interface OfficialBarangayRosterProps {
  barangaySlug: string;
}

export function OfficialBarangayRoster({
  barangaySlug,
}: OfficialBarangayRosterProps) {
  const officials = getOfficialBarangayRoster(barangaySlug);
  if (officials.length === 0) return null;

  const byPosition = (position: string) =>
    officials.filter(o => o.position === position);
  const others = officials.filter(o => !KNOWN.has(o.position));

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <Heading level={3} className="mb-0">
            Barangay officials
          </Heading>
          <StatusBadge tone="neutral">
            Term {officialBarangayRosterSource.term}
          </StatusBadge>
        </div>

        {GROUPS.map(group => {
          const leads = byPosition(group.lead);
          const members = byPosition(group.members);
          const staff = group.staff.flatMap(byPosition);
          if (leads.length + members.length + staff.length === 0) return null;
          return (
            <section key={group.title} className="mt-6">
              <h4 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">
                {group.title}
              </h4>
              {leads.length > 0 && (
                <SubList>
                  {leads.map((o, i) => (
                    <Person
                      key={i}
                      official={o}
                      detail={formatTerm(o.termInPosition)}
                      lead
                    />
                  ))}
                </SubList>
              )}
              {members.length > 0 && (
                <SubList title={`${group.membersTitle} · ${members.length}`}>
                  {members.map((o, i) => (
                    <Person
                      key={i}
                      official={o}
                      detail={formatTerm(o.termInPosition)}
                    />
                  ))}
                </SubList>
              )}
              {staff.length > 0 && (
                <SubList title="Appointed officers">
                  {staff.map((o, i) => (
                    <Person key={i} official={o} detail={o.position} />
                  ))}
                </SubList>
              )}
            </section>
          );
        })}

        {others.length > 0 && (
          <section className="mt-6">
            <h4 className="border-b border-gray-200 pb-2 text-base font-semibold text-gray-900">
              Other officials
            </h4>
            <SubList>
              {others.map((o, i) => (
                <Person key={i} official={o} detail={o.position} />
              ))}
            </SubList>
          </section>
        )}

        <Text size="sm" className="text-xs text-gray-500 mt-6 mb-0">
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
