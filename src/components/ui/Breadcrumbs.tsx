import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();

  // Generate breadcrumbs from current path if no items provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;

      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbs.push({
        label,
        href: isLast ? undefined : currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav
      /*
        Wraps, and the separators wrap with it. A document title like
        "Cabanatuan City Government: Free Health Services" is far wider than
        320px, and a `nowrap` breadcrumb trail pushed the whole page into a
        horizontal scroll on the three longest documents.
      */
      className={`flex flex-wrap items-center text-sm text-gray-600 ${className}`}
      aria-label="Breadcrumb"
    >
      {/*
        The first crumb is a "Home" link and is immediately followed by the
        generated "Home" label, so the icon beside it is purely decorative and
        hidden from assistive tech.
      */}
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && (
            <span className="shrink-0 text-gray-400" aria-hidden="true">
              <Home className="size-4" />
            </span>
          )}
          {index > 0 && (
            <span className="shrink-0 text-gray-400" aria-hidden="true">
              <ChevronRight className="size-4" />
            </span>
          )}
          {item.href ? (
            <Link
              to={item.href}
              // 44px tall, per WCAG 2.5.8. A breadcrumb trail is a list of
              // links, not a sentence, so the "inline in text" exemption does
              // not apply — at 20px these were the smallest targets on the page.
              // The horizontal padding stands in for the gap the old
              // `space-x-1` provided, since the hit areas are now the elements
              // themselves.
              className="hover:text-primary-600 inline-flex min-h-[44px] items-center px-1.5 transition-colors duration-200"
            >
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </Link>
          ) : (
            <span
              className="text-gray-900 inline-flex min-h-[44px] items-center px-1.5 font-medium"
              aria-current="page"
            >
              {item.label.charAt(0).toUpperCase() + item.label.slice(1)}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
