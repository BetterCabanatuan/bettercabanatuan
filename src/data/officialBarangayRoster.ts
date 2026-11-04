import roster from './officialBarangayRoster.json';

export interface OfficialBarangayRecord {
  barangaySlug: string;
  barangayName: string;
  position: string;
  termInPosition: string;
  lastName: string;
  firstName: string;
  middleName: string;
  suffix: string;
}

export const officialBarangayRosterSource = roster.source;
export const officialBarangayRosterRecords =
  roster.records as OfficialBarangayRecord[];

export function getOfficialBarangayRoster(
  barangaySlug: string
): OfficialBarangayRecord[] {
  return officialBarangayRosterRecords.filter(
    record => record.barangaySlug === barangaySlug
  );
}

export function formatOfficialName(record: OfficialBarangayRecord): string {
  return [record.firstName, record.middleName, record.lastName, record.suffix]
    .filter(Boolean)
    .join(' ');
}
