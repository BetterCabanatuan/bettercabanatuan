import { useEffect, useId, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface ResponsiveDisclosureProps {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
  id?: string;
  headingLevel?: 2 | 3 | 4;
}

export default function ResponsiveDisclosure({
  title,
  count,
  defaultOpen = false,
  children,
  id,
  headingLevel = 2,
}: ResponsiveDisclosureProps) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [desktop, setDesktop] = useState(false);
  const generatedId = useId();

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(min-width: 768px)');
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  const open = expanded || desktop;
  const contentId = id ? `${id}-content` : `${generatedId}-content`;
  const itemLabel = count === undefined ? '' : `, ${count} items`;
  const HeadingTag = `h${headingLevel}` as 'h2' | 'h3' | 'h4';

  return (
    <section id={id} className="scroll-mt-28">
      <HeadingTag className="m-0 text-lg font-semibold text-gray-900">
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 md:pointer-events-none"
          aria-expanded={open}
          aria-controls={contentId}
          aria-label={`${title}${itemLabel}`}
          onClick={() => setExpanded(value => !value)}
        >
          <span>
            {title}
            {count !== undefined && (
              <span
                className="ml-2 text-sm font-normal text-gray-500"
                aria-hidden="true"
              >
                ({count})
              </span>
            )}
          </span>
          <ChevronDown
            className={`size-5 text-gray-500 transition-transform duration-150 md:hidden ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>
      </HeadingTag>
      <div
        id={contentId}
        data-testid="responsive-disclosure-content"
        className={`pt-4 ${open ? 'block' : 'hidden md:block'}`}
      >
        {children}
      </div>
    </section>
  );
}
