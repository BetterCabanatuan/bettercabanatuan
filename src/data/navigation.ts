import type { NavigationItem, NavigationLink } from '../types';
import { serviceCategories as servicesData } from './yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
}

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Services',
    href: '/services',
    children: (servicesData.categories as Category[]).map(category => ({
      label: category.category,
      href: `/services/${category.slug}`,
    })),
  },
  {
    label: 'Government',
    href: '/government',
  },
  {
    label: 'Statistics',
    href: '/statistics',
  },
  {
    label: 'Transparency',
    href: '/transparency',
  },
];

export const footerNavigation: {
  mainSections: Array<{
    title: string;
    links: NavigationLink[];
  }>;
  socialLinks: NavigationLink[];
} = {
  mainSections: [
    {
      title: 'About',
      links: [
        { label: 'About the Portal', href: '/about' },
        // { label: 'Privacy Policy', href: '/privacy' },
        // { label: 'Terms of Use', href: '/terms' },
        { label: 'Accessibility', href: '/accessibility' },
        { label: 'Contact Us', href: '/contact' },
        {
          label: 'Community Discord',
          href: 'https://bettergov.ph/join-us',
          external: true,
        },
      ],
    },
    {
      title: 'Services',
      links: [
        { label: 'All Services', href: '/services' },
        ...(servicesData.categories as Category[])
          .slice(0, 6)
          .map(category => ({
            label: category.category,
            href: `/services/${category.slug}`,
          })),
        { label: 'Hotlines', href: '/hotlines' },
        {
          label: 'Holidays',
          href: 'https://bettergov.ph/philippines/holidays',
          external: true,
        },
      ],
    },
    {
      title: 'Government',
      links: [
        { label: 'Government', href: '/government' },
        { label: 'Public Officials', href: '/government/officials' },
        { label: 'Barangays', href: '/government/barangays' },
        { label: 'Open Data', href: 'https://data.gov.ph', external: true },
        {
          label: 'Freedom of Information',
          href: 'https://www.foi.gov.ph',
          external: true,
        },
        {
          label: 'Contact Center',
          href: 'https://contactcenterngbayan.gov.ph',
          external: true,
        },
        {
          label: 'Official Gazette',
          href: 'https://www.officialgazette.gov.ph',
          external: true,
        },
      ],
    },
  ],
  socialLinks: [
    { label: 'Website', href: 'https://bettercabanatuan.org', external: true },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/bettercabanatuan.org',
      external: true,
    },
    {
      label: 'Twitter',
      href: 'https://twitter.com/bettercabanatuan',
      external: true,
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com/bettercabanatuan',
      external: true,
    },
    {
      label: 'Government Website',
      href: 'https://www.cabanatuancity.gov.ph',
      external: true,
    },
  ],
};
