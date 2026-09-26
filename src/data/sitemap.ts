import type { LucideIcon } from 'lucide-react';
import { Home, Heart, Landmark, MapPin, ExternalLink } from 'lucide-react';
import {
  serviceCategories,
  governmentCategories,
  allBarangays,
  allDepartments,
  allProjects,
  getCategoryPagesSync,
  getBarangayPopulationTrend,
} from './yamlLoader';
import { siteConfig } from '../lib/siteConfig';

export interface SitemapLink {
  label: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface SitemapGroup {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  links: SitemapLink[];
}

function getGovernmentHref(slug: string): string {
  if (slug === 'officials') return '/government/officials';
  if (slug === 'barangays') return '/government/barangays';
  if (slug === 'departments') return '/government/departments';
  if (slug === 'projects') return '/government/projects';
  return `/government/${slug}`;
}

export const sitemapGroups: SitemapGroup[] = [
  {
    id: 'main',
    title: 'Main Pages',
    description: 'Core portal pages and entry points.',
    icon: Home,
    links: [
      { label: 'Home', href: '/' },
      { label: 'About the Portal', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Hotlines', href: '/hotlines' },
      { label: 'Statistics', href: '/statistics' },
      { label: 'Accessibility', href: '/accessibility' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  },
  {
    id: 'services',
    title: 'Services',
    description: 'Government services and step-by-step guides.',
    icon: Heart,
    links: [
      { label: 'All Services', href: '/services' },
      ...serviceCategories.categories.flatMap(category => {
        const pages = getCategoryPagesSync(category.slug);
        const categoryLink: SitemapLink = {
          label: category.category,
          href: `/services/${category.slug}`,
          description: category.description,
        };
        const pageLinks: SitemapLink[] = pages.map(page => ({
          label: page.name,
          href: `/services/${category.slug}/${page.slug}`,
          description: page.description,
        }));
        return [categoryLink, ...pageLinks];
      }),
    ],
  },
  {
    id: 'government',
    title: 'Government',
    description: 'Departments, officials, barangays, and public information.',
    icon: Landmark,
    links: [
      { label: 'Government Overview', href: '/government' },
      { label: 'Public Officials', href: '/government/officials' },
      { label: 'All Barangays', href: '/government/barangays' },
      { label: 'Departments', href: '/government/departments' },
      { label: 'Projects', href: '/government/projects' },
      ...allDepartments.map(department => ({
        label: department.name,
        href: `/government/departments/${department.slug}`,
        description: department.description,
      })),
      ...allProjects.map(project => ({
        label: project.name,
        href: `/government/projects/${project.slug}`,
        description: project.description,
      })),
      ...governmentCategories.categories
        .filter(
          section =>
            !['officials', 'barangays', 'departments', 'projects'].includes(
              section.slug
            )
        )
        .flatMap(section => {
          const pages = getCategoryPagesSync(section.slug);
          // Label sections that have no published content yet, so search and
          // sitemap don't present them as ready-to-read. See P2-1.
          const sectionLink: SitemapLink = {
            label: section.comingSoon
              ? `${section.category} (Coming soon)`
              : section.category,
            href: getGovernmentHref(section.slug),
            description: section.description,
          };
          const pageLinks: SitemapLink[] = pages.map(page => ({
            label: page.name,
            href: `/government/${section.slug}/${page.slug}`,
            description: page.description,
          }));
          return [sectionLink, ...pageLinks];
        }),
    ],
  },
  {
    id: 'barangays',
    title: 'Barangays',
    description: `${allBarangays.length} barangays across ${siteConfig.governmentName}.`,
    icon: MapPin,
    links: allBarangays.map(barangay => {
      const latest = getBarangayPopulationTrend(barangay).at(-1);
      return {
        label: barangay.name,
        href: `/government/barangays/${barangay.slug}`,
        description: latest
          ? `${barangay.classification} · ${latest.population.toLocaleString()} residents (${latest.year})`
          : `${barangay.classification} · population not yet published`,
      };
    }),
  },
  {
    id: 'resources',
    title: 'External Resources',
    description: 'Official national and city government links.',
    icon: ExternalLink,
    links: [
      {
        label: 'Official City Website',
        href: siteConfig.websiteUrl,
        external: true,
      },
      {
        label: 'BetterGov.ph',
        href: 'https://bettergov.ph',
        external: true,
      },
      {
        label: 'Open Data Philippines',
        href: 'https://data.gov.ph',
        external: true,
      },
      {
        label: 'Freedom of Information',
        href: 'https://www.foi.gov.ph',
        external: true,
      },
    ],
  },
];

export const allSitemapLinks: SitemapLink[] = sitemapGroups.flatMap(
  group => group.links
);

export function getSitemapCanonicalUrl(): string {
  const base =
    siteConfig.prodOrigin ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  return base ? `${base.replace(/\/$/, '')}/sitemap` : '/sitemap';
}

export const sitemapSeo = {
  title: 'Sitemap',
  description: `Browse every page on the ${siteConfig.governmentName} community portal — services, government sections, barangays, and main pages.`,
  keywords: `sitemap, site map, ${siteConfig.governmentName}, government services, barangays, navigation`,
};
