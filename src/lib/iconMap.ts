import type { LucideIcon } from 'lucide-react';
import {
  Ambulance,
  BadgeCheck,
  Banknote,
  Book,
  Briefcase,
  Building2,
  Bus,
  Calculator,
  ChartBar,
  ClipboardList,
  Coins,
  Crown,
  Database,
  Droplets,
  FileText,
  Gavel,
  Globe,
  GraduationCap,
  Hammer,
  HardHat,
  Heart,
  HeartPulse,
  Home,
  Landmark,
  LandPlot,
  LayoutGrid,
  Leaf,
  LifeBuoy,
  Mail,
  Map,
  MapPin,
  MessagesSquare,
  Monitor,
  Newspaper,
  Phone,
  PiggyBank,
  PieChart,
  Scale,
  School,
  Shield,
  Siren,
  Sprout,
  Store,
  Sun,
  Trash2,
  TreePine,
  TrendingUp,
  Users,
  Wallet,
  Wheat,
  Wrench,
} from 'lucide-react';

/**
 * The icon vocabulary.
 *
 * Every icon name that may appear in a YAML `icon:` field. Keeping an explicit
 * map rather than reaching into `lucide-react` dynamically is deliberate: a
 * tree-shaken import list keeps the bundle from pulling all 5,800 icons, and it
 * makes the allowed set reviewable.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Ambulance,
  BadgeCheck,
  Banknote,
  Book,
  Briefcase,
  Building2,
  Bus,
  Calculator,
  ChartBar,
  ClipboardList,
  Coins,
  Crown,
  Database,
  Droplets,
  FileText,
  Gavel,
  Globe,
  GraduationCap,
  Hammer,
  HardHat,
  Heart,
  HeartPulse,
  Home,
  Landmark,
  LandPlot,
  LayoutGrid,
  Leaf,
  LifeBuoy,
  Mail,
  Map,
  MapPin,
  MessagesSquare,
  Monitor,
  Newspaper,
  Phone,
  PiggyBank,
  PieChart,
  Scale,
  School,
  Shield,
  Siren,
  Sprout,
  Store,
  Sun,
  Trash2,
  TreePine,
  TrendingUp,
  Users,
  Wallet,
  Wheat,
  Wrench,
};

/**
 * Fallback icon per content domain.
 *
 * A single generic fallback made a deliberate choice and a typo look identical,
 * because both rendered the same building. Splitting by domain means a
 * mis-typed service icon reads as "a service", which is a much cheaper mistake
 * to spot, and a mis-typed government icon reads as "a government body".
 */
export type IconDomain = 'service' | 'government' | 'neutral';

const DOMAIN_FALLBACK: Record<IconDomain, LucideIcon> = {
  service: ClipboardList,
  government: Landmark,
  neutral: LayoutGrid,
};

export interface ResolveIconOptions {
  domain?: IconDomain;
  /**
   * Log a warning for an unrecognised name. On in development, off in
   * production, where a missing icon is not the reader's problem.
   */
  warn?: boolean;
}

/**
 * Resolve a YAML icon name to a component.
 *
 * An unknown name never throws and never renders blank — it falls back to the
 * domain default, so the card still has a visual anchor.
 */
export function getIconComponent(
  iconName?: string,
  { domain = 'neutral', warn }: ResolveIconOptions = {}
): LucideIcon {
  const name = iconName?.trim();
  if (name && ICON_MAP[name]) return ICON_MAP[name];

  if (warn ?? import.meta.env.DEV) {
    if (name) {
      console.warn(
        `[iconMap] Unknown icon "${name}". Add it to ICON_MAP in src/lib/iconMap.ts, ` +
          `or use one of: ${Object.keys(ICON_MAP).sort().join(', ')}`
      );
    }
  }

  return DOMAIN_FALLBACK[domain];
}

/** True when the name resolves to a real entry rather than a fallback. */
export function isKnownIcon(iconName?: string): boolean {
  return Boolean(iconName?.trim() && ICON_MAP[iconName.trim()]);
}
