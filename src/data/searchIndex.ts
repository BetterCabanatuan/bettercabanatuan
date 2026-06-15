import type { LucideIcon } from 'lucide-react';
import { Home, Heart, Landmark, MapPin, ExternalLink } from 'lucide-react';
import { sitemapGroups, type SitemapLink } from './sitemap';
import { siteConfig } from '../lib/siteConfig';

export type SearchContentType =
  | 'main'
  | 'services'
  | 'government'
  | 'barangays'
  | 'resources';

export interface SearchItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  type: SearchContentType;
  typeLabel: string;
  external?: boolean;
}

const typeLabels: Record<SearchContentType, string> = {
  main: 'Main Pages',
  services: 'Services',
  government: 'Government',
  barangays: 'Barangays',
  resources: 'External',
};

const typeIcons: Record<SearchContentType, LucideIcon> = {
  main: Home,
  services: Heart,
  government: Landmark,
  barangays: MapPin,
  resources: ExternalLink,
};

function linkToSearchItem(
  link: SitemapLink,
  type: SearchContentType,
  index: number
): SearchItem {
  return {
    id: `${type}-${link.href}-${index}`,
    label: link.label,
    description: link.description,
    href: link.href,
    type,
    typeLabel: typeLabels[type],
    external: link.external,
  };
}

export const searchIndex: SearchItem[] = sitemapGroups.flatMap(group =>
  group.links.map((link, index) =>
    linkToSearchItem(link, group.id as SearchContentType, index)
  )
);

export const searchFilters: Array<{
  id: SearchContentType | 'all';
  label: string;
  icon: LucideIcon;
}> = [
  { id: 'all', label: 'All', icon: Home },
  { id: 'services', label: typeLabels.services, icon: typeIcons.services },
  {
    id: 'government',
    label: typeLabels.government,
    icon: typeIcons.government,
  },
  { id: 'barangays', label: typeLabels.barangays, icon: typeIcons.barangays },
  { id: 'main', label: typeLabels.main, icon: typeIcons.main },
];

export const suggestedSearches = [
  'health services',
  'business permits',
  'barangay',
  'departments',
  'education',
  'contact',
];

export function getSearchTypeIcon(type: SearchContentType): LucideIcon {
  return typeIcons[type];
}

export function getSearchCanonicalUrl(query?: string, type?: string): string {
  const base =
    siteConfig.prodOrigin ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const params = new URLSearchParams();
  if (query?.trim()) params.set('q', query.trim());
  if (type && type !== 'all') params.set('type', type);
  const queryString = params.toString();
  const path = queryString ? `/search?${queryString}` : '/search';
  return base ? `${base.replace(/\/$/, '')}${path}` : path;
}

export const searchSeo = {
  title: 'Search',
  description: `Search the ${siteConfig.governmentName} community portal for services, government sections, barangays, and guides.`,
  keywords: `search, ${siteConfig.governmentName}, government services, barangays, local government`,
};
