import { Link } from 'react-router-dom';
import type { SitemapGroup } from '../../data/sitemap';

interface SitemapJumpNavProps {
  groups: SitemapGroup[];
}

export default function SitemapJumpNav({ groups }: SitemapJumpNavProps) {
  return (
    <nav
      aria-label="Sitemap sections"
      className="motion-safe:animate-fade-in mb-10"
    >
      <p className="text-sm font-semibold text-gray-700 mb-3">Jump to section</p>
      <div className="flex flex-wrap gap-2">
        {groups.map(group => (
          <a
            key={group.id}
            href={`#${group.id}`}
            className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-all duration-200"
          >
            {group.title}
          </a>
        ))}
        <Link
          to="/"
          className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-full text-sm font-medium border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </nav>
  );
}
