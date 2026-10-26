import type { LucideIcon } from 'lucide-react';
import {
  Shield,
  Flame,
  LifeBuoy,
  Users,
  Heart,
  Hospital,
  HeartHandshake,
} from 'lucide-react';

export interface HotlinePhone {
  number: string;
}

export interface EmergencyHotline {
  id: string;
  name: string;
  shortLabel: string;
  phones: HotlinePhone[];
  icon: LucideIcon;
  /** Shown in the red strip under the navbar. The full list is on /hotlines. */
  inBanner: boolean;
}

/**
 * Sources: CDRRMO, City Health Office, MV Gallego hospital, CSWDO and
 * Community Affairs numbers are from the City Government of Cabanatuan
 * Citizen's Charter 2022 (2nd Edition), pp. 229 and 342-345, accessed
 * 2026-10-11. The PNP and BFP numbers predate that check and have not been
 * matched to an official source yet (see slice A3 in
 * docs/superpowers/specs/2026-10-11-charter-content-integration-slices.md).
 */
export const emergencyHotlines: EmergencyHotline[] = [
  {
    id: 'pnp',
    name: 'PNP Cabanatuan',
    shortLabel: 'PNP',
    icon: Shield,
    inBanner: true,
    phones: [
      { number: '(044)-463-1111' },
      { number: '0920-611-2000' },
      { number: '0935-522-2227' },
    ],
  },
  {
    id: 'bfp',
    name: 'BFP Cabanatuan',
    shortLabel: 'BFP',
    icon: Flame,
    inBanner: true,
    phones: [
      { number: '(044)-958-3701' },
      { number: '(044)-600-5696' },
      { number: '0943-303-4279' },
    ],
  },
  {
    id: 'cdrrmo',
    name: 'CDRRMO Rescue Team',
    shortLabel: 'CDRRMO',
    icon: LifeBuoy,
    inBanner: true,
    phones: [
      { number: '0908-881-1010' },
      { number: '0917-851-1320' },
      { number: '(044)-940-0161' },
    ],
  },
  {
    id: 'community-affairs',
    name: 'Community Affairs Office',
    shortLabel: 'Community Affairs',
    icon: Users,
    inBanner: true,
    phones: [{ number: '0919-081-3983' }],
  },
  {
    id: 'cho',
    name: 'City Health Office',
    shortLabel: 'CHO',
    icon: Heart,
    inBanner: false,
    phones: [{ number: '0919-081-1348' }, { number: '(044)-463-5900' }],
  },
  {
    id: 'mvg-hospital',
    name: 'MV Gallego Cabanatuan City General Hospital',
    shortLabel: 'City Hospital',
    icon: Hospital,
    inBanner: false,
    phones: [{ number: '0919-089-9880' }, { number: '(044)-958-9774' }],
  },
  {
    id: 'cswdo',
    name: 'CSWDO Crisis and Assistance Lines',
    shortLabel: 'CSWDO',
    icon: HeartHandshake,
    inBanner: false,
    phones: [{ number: '0919-081-1345' }, { number: '0919-081-0246' }],
  },
];

/** Entries shown in the header strip. */
export const bannerHotlines = emergencyHotlines.filter(h => h.inBanner);

/** Normalize Philippine phone numbers for tel: links */
export function formatPhoneForTel(display: string): string {
  const digits = display.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `+63${digits.slice(1)}`;
  }
  if (digits.startsWith('63')) {
    return `+${digits}`;
  }
  return digits;
}
