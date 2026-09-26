import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Heading } from './Heading';
import { Text } from './Text';

export interface EmptyStateAction {
  href: string;
  label: string;
  /** Opens in a new tab with safe rel attributes. */
  external?: boolean;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Short status label rendered above the title, e.g. "Coming soon". */
  badge?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

/**
 * Shared empty / "coming soon" state.
 *
 * Used by any page or section that has no content yet, so a blank area is
 * never rendered without an explanation and a way forward.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  badge,
  primaryAction,
  secondaryAction,
  className = '',
}) => {
  return (
    <Card
      className={`shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_16px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.06] ${className}`}
    >
      <CardContent className="p-6 md:p-10 flex flex-col items-center text-center">
        <span
          className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 mb-5 shrink-0"
          aria-hidden="true"
        >
          <Icon className="h-7 w-7" />
        </span>

        {badge && (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 mb-3">
            {badge}
          </span>
        )}

        <Heading level={2} className="text-xl md:text-2xl mb-2 text-balance">
          {title}
        </Heading>

        <Text className="text-gray-600 max-w-xl mb-0 text-pretty">
          {description}
        </Text>

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {primaryAction &&
              (primaryAction.external ? (
                <a
                  href={primaryAction.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-[transform,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
              ) : (
                <Link
                  to={primaryAction.href}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-[transform,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              ))}

            {secondaryAction &&
              (secondaryAction.external ? (
                <a
                  href={secondaryAction.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-gray-700 text-sm font-medium shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:text-primary-700 hover:bg-primary-50 hover:shadow-[inset_0_0_0_1px_rgba(0,102,235,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-[transform,box-shadow,color,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                >
                  {secondaryAction.label}
                </a>
              ) : (
                <Link
                  to={secondaryAction.href}
                  className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl text-gray-700 text-sm font-medium shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] hover:text-primary-700 hover:bg-primary-50 hover:shadow-[inset_0_0_0_1px_rgba(0,102,235,0.25)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 transition-[transform,box-shadow,color,background-color] duration-200 active:scale-[0.96] motion-reduce:active:scale-100"
                >
                  {secondaryAction.label}
                </Link>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
