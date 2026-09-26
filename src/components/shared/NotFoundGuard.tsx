import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import SEO from '../SEO';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import Breadcrumbs, { type BreadcrumbItem } from '../ui/Breadcrumbs';

interface NotFoundGuardProps {
  /** What was missing, in the resident's vocabulary: "department", "project". */
  subject: string;
  /**
   * Where "back to the list" goes — the parent index for this subject. Omit
   * when the subject has no index page to return to.
   */
  backHref?: string;
  backLabel?: string;
  breadcrumbs?: BreadcrumbItem[];
}

/**
 * The not-found state every detail route renders.
 *
 * Seven routes used to hand-roll this as a bare `Banner`, and all seven were
 * wrong in the same three ways:
 *
 *   1. No `<h1>`. The `Banner` title is not a heading, so the page had no
 *      document outline at all and the layout's "skip to content" had nothing
 *      to skip to. Only the catch-all `/404` had a real heading.
 *   2. No `noindex`. A crawler was free to index every bad slug, each one
 *      carrying a full canonical URL.
 *   3. The `<title>` fell back to the site default, so `/government/departments/
 *      not-a-department` was titled identically to the homepage. Every
 *      not-found page was a duplicate title, and none of them said what
 *      happened.
 *
 * One component, so a new detail route cannot get it wrong by omission.
 */
export default function NotFoundGuard({
  subject,
  backHref,
  backLabel = `Back to ${subject}s`,
  breadcrumbs,
}: NotFoundGuardProps) {
  const title = `${subject.charAt(0).toUpperCase()}${subject.slice(1)} not found`;

  return (
    <>
      <SEO
        title={title}
        description={`The ${subject} you are looking for does not exist.`}
        noindex
      />
      <Section className="p-3 mb-12">
        <Breadcrumbs className="mb-8" items={breadcrumbs} />
        <Heading level={1} className="mb-2">
          {title}
        </Heading>
        <p className="text-gray-600 mb-0">
          The {subject} you are looking for does not exist. It may have been
          renamed or removed.
        </p>
        {backHref && (
          <Link
            to={backHref}
            className="inline-flex items-center gap-2 mt-6 min-h-[44px] text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
        )}
      </Section>
    </>
  );
}
