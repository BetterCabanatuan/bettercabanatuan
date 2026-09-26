import React, { useCallback, useEffect, useRef } from 'react';
import {
  Code,
  FileText,
  Layers,
  Mail,
  Megaphone,
  Palette,
  PenLine,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import BetterCabanatuanLogo from '/LogoDark.svg';
import {
  dismissVolunteerPrompt,
  shouldShowVolunteerPrompt,
} from '../../lib/volunteerPrompt';

interface VolunteerRole {
  key: string;
  icon: LucideIcon;
}

const VOLUNTEER_ROLES: VolunteerRole[] = [
  { key: 'softwareDev', icon: Code },
  { key: 'uiUxDesign', icon: Layers },
  { key: 'graphicDesign', icon: Palette },
  { key: 'contentCreation', icon: PenLine },
  { key: 'research', icon: FileText },
  { key: 'digitalMarketing', icon: Megaphone },
];

/** Selector for everything that can hold focus inside the dialog. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Volunteer recruitment dialog.
 *
 * Shown once per browser: dismissing it writes '0' to the
 * `bc-volunteer-popup` localStorage key, which keeps it hidden on later visits.
 *
 * Focus is trapped inside while open, Escape and the close button dismiss it,
 * and focus returns to whatever was focused before it opened.
 */
export default function VolunteerDialog() {
  const { t } = useTranslation('common');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Only decide once, before paint, to avoid showing then hiding.
  const [isOpen, setIsOpen] = React.useState(() => shouldShowVolunteerPrompt());

  const close = useCallback(() => {
    dismissVolunteerPrompt();
    setIsOpen(false);
  }, []);

  // Move focus in on open, and hand it back on close.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    // Focus the first control so keyboard users land inside the dialog.
    const focusTarget =
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? null;
    focusTarget?.focus();

    return () => {
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen]);

  // Lock background scrolling while the dialog is open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Escape to dismiss, Tab to cycle within the dialog.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
    ).filter(el => el.offsetParent !== null || el === document.activeElement);

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!isOpen) return null;

  const titleId = 'volunteer-dialog-title';
  const descriptionId = 'volunteer-dialog-description';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm motion-safe:animate-fade-in"
        aria-hidden="true"
        onClick={close}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl motion-safe:animate-slide-in"
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800 px-6 pt-8 pb-7 sm:px-8 text-center text-white">
          <div
            className="absolute -top-16 -left-10 h-48 w-48 rounded-full bg-white/10"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-20 -right-8 h-56 w-56 rounded-full bg-white/[0.07]"
            aria-hidden="true"
          />

          {/* LogoDark is the white-on-dark variant, matching the blue header. */}
          <div className="relative flex justify-center mb-5">
            <img
              src={BetterCabanatuanLogo}
              alt={t('volunteerDialog.logoAlt')}
              width={18156}
              height={6580}
              className="h-16 w-auto"
            />
          </div>

          <button
            type="button"
            onClick={close}
            aria-label={t('volunteerDialog.close')}
            className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full text-white/90 hover:text-white hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700 transition-colors duration-200"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>

          <h2
            id={titleId}
            className="relative text-2xl sm:text-3xl font-bold mb-2 text-balance"
          >
            {t('volunteerDialog.title')}
          </h2>
          <p className="relative text-sm sm:text-base text-white/85 max-w-lg mx-auto text-pretty">
            {t('volunteerDialog.subtitle', { city: t('volunteerDialog.city') })}
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-7 sm:px-8 sm:py-8 text-center">
          <p
            id={descriptionId}
            className="text-gray-700 text-base mb-6 text-pretty"
          >
            <Trans
              i18nKey="volunteerDialog.body"
              values={{ demonym: t('volunteerDialog.demonym') }}
              components={{
                1: <strong className="text-primary-700 font-semibold" />,
              }}
            />
          </p>

          <ul className="flex flex-wrap justify-center gap-2.5 mb-8">
            {VOLUNTEER_ROLES.map(({ key, icon: Icon }) => (
              <li key={key}>
                <span className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full bg-primary-50 text-primary-800 border border-primary-200 text-sm font-semibold">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {t(`volunteerDialog.roles.${key}`)}
                </span>
              </li>
            ))}
          </ul>

          <a
            href={`mailto:${t('volunteerDialog.email')}?subject=${encodeURIComponent(
              t('volunteerDialog.emailSubject')
            )}`}
            onClick={close}
            className="inline-flex items-center justify-center gap-2.5 w-full min-h-[56px] px-6 py-3.5 rounded-2xl bg-primary-700 text-white text-base font-semibold shadow-[0_4px_12px_rgba(0,102,235,0.25)] hover:bg-primary-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2 transition-[transform,background-color,box-shadow] duration-200 active:scale-[0.98] motion-reduce:active:scale-100"
          >
            <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
            {t('volunteerDialog.cta')}
          </a>

          <button
            type="button"
            onClick={close}
            className="mt-4 inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-700 hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 rounded-md transition-colors duration-200"
          >
            {t('volunteerDialog.dismiss')}
          </button>
        </div>
      </div>
    </div>
  );
}
