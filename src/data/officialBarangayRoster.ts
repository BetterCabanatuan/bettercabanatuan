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

const ROMAN = /^(II|III|IV|V|VI)$/;

/** "DELA CRUZ" → "Dela Cruz", "AR-JAY" → "Ar-Jay"; the workbook is all caps. */
function titleCase(value: string): string {
  return value
    .toLowerCase()
    .replace(/(^|[\s\-'.])(\p{L})/gu, (_, sep, ch) => sep + ch.toUpperCase());
}

function formatSuffix(raw: string): string {
  const s = raw.replace(/[.,\s]+$/, '').toUpperCase();
  if (!s || s === 'NONE') return '';
  if (ROMAN.test(s)) return s;
  if (s === 'JR' || s === 'SR') return `${titleCase(s)}.`;
  return titleCase(s);
}

export function formatOfficialName(record: OfficialBarangayRecord): string {
  return [record.firstName, record.middleName, record.lastName]
    .map(part =>
      titleCase(part.replace(/[,\\`]+$/, '').replace(/\.{2,}/g, '.'))
    )
    .concat(formatSuffix(record.suffix))
    .filter(Boolean)
    .join(' ');
}

/** "3RD" → "3rd term"; blank for appointed posts that have no elective term. */
export function formatTerm(termInPosition: string): string {
  return termInPosition ? `${termInPosition.toLowerCase()} term` : '';
}
