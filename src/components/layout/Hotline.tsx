import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import { emergencyHotlines, formatPhoneForTel } from '../../data/hotlines';

export function Hotline() {
  const { t } = useTranslation('common');

  return (
    <div
      className="bg-red-700 text-white border-b border-red-800"
      role="region"
      aria-label={t('hotlines.banner.ariaLabel')}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 min-h-10 py-1.5">
          <div className="flex items-center gap-2 shrink-0">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wide hidden sm:inline">
              {t('hotlines.banner.label')}
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide sm:hidden">
              {t('hotlines.banner.labelShort')}
            </span>
          </div>

          <div className="flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex items-center gap-4 min-w-max lg:min-w-0 lg:flex-wrap lg:justify-end">
              {emergencyHotlines.map(hotline => (
                <li
                  key={hotline.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <span className="font-semibold text-red-100 shrink-0">
                    {hotline.shortLabel}:
                  </span>
                  <span className="flex items-center gap-2">
                    {hotline.phones.map((phone, index) => (
                      <span
                        key={phone.number}
                        className="inline-flex items-center"
                      >
                        {index > 0 && (
                          <span
                            className="text-red-300 mx-1.5"
                            aria-hidden="true"
                          >
                            ·
                          </span>
                        )}
                        <a
                          href={`tel:${formatPhoneForTel(phone.number)}`}
                          className="inline-flex items-center min-h-[32px] px-1 rounded text-white hover:text-red-100 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-700 transition-colors duration-200 whitespace-nowrap"
                        >
                          {phone.number}
                        </a>
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
