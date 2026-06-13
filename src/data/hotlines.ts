import type { LucideIcon } from 'lucide-react';
import { Shield, Flame, LifeBuoy, Users } from 'lucide-react';

export interface HotlinePhone {
  number: string;
}

export interface EmergencyHotline {
  id: string;
  name: string;
  shortLabel: string;
  phones: HotlinePhone[];
  icon: LucideIcon;
}

export const emergencyHotlines: EmergencyHotline[] = [
  {
    id: 'pnp',
    name: 'PNP Cabanatuan',
    shortLabel: 'PNP',
    icon: Shield,
    phones: [{ number: '(044)-463-1111' }, { number: '0920-611-2000' }],
  },
  {
    id: 'bfp',
    name: 'BFP Cabanatuan',
    shortLabel: 'BFP',
    icon: Flame,
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
    phones: [
      { number: '(044)-940-0161' },
      { number: '0918-881-1010' },
      { number: '0917-851-1320' },
    ],
  },
  {
    id: 'community-affairs',
    name: 'Community Affairs Office',
    shortLabel: 'Community Affairs',
    icon: Users,
    phones: [{ number: '0919-081-3983' }],
  },
];

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
