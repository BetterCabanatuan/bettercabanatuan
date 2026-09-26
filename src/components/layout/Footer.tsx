import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react';
import { footerNavigation } from '../../data/navigation';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BetterCabanatuanLogo from '/LogoDark.svg';
import { BRAND_NAME } from '../../lib/siteConfig';

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  const getSocialIcon = (label: string) => {
    switch (label) {
      case 'Facebook':
        return <Facebook className="h-5 w-5" />;
      case 'Twitter':
        return <Twitter className="h-5 w-5" />;
      case 'Instagram':
        return <Instagram className="h-5 w-5" />;
      case 'YouTube':
        return <Youtube className="h-5 w-5" />;
      case 'Website':
        return <Globe className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <footer className="bg-surface-inverse text-white">
      <div className="container mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center mb-4">
              <img
                src={BetterCabanatuanLogo}
                alt="Better Cabanatuan"
                width={18156}
                height={6580}
                className="h-12 w-auto mr-3"
              />
              {/* <CheckCircle2 className="h-12 w-12 mr-3" /> */}
              {/* <img
                src="/ph-logo.webp"
                alt="Philippines Coat of Arms"
                className="h-12 w-12 mr-3"
              /> */}

              {/* <div> */}
              {/*   <div className="font-bold">{t('site_name')}</div> */}
              {/*   <div className="text-xs text-gray-400">BetterGov.ph Portal</div> */}
              {/* </div> */}
            </div>
            <p className="text-gray-400 text-sm mb-4">
              A community portal providing Philippine citizens, businesses, and
              visitors with information and services.
            </p>
            <div className="flex space-x-4">
              {footerNavigation.socialLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                >
                  {getSocialIcon(link.label)}
                </a>
              ))}
            </div>
          </div>

          {footerNavigation.mainSections.map(section => (
            <div key={section.title} className="hidden md:block">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 divide-y divide-gray-800 border-y border-gray-800 md:hidden">
          {footerNavigation.mainSections.map(section => (
            <details key={section.title} className="group py-1">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                {section.title}
                <span
                  className="text-gray-400 transition-transform duration-150 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <ul className="space-y-1 pb-4">
                {section.links.map(link => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        className="inline-flex min-h-11 items-center text-sm text-gray-400 transition-colors hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="inline-flex min-h-11 items-center text-sm text-gray-400 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          {/*
            `items-stretch` below md, not `items-center`.

            In a *column* flex container the cross axis is horizontal, so
            `items-center` shrink-wraps each child to its content and centres
            it. The link row is 492px of text, so at 375px it was centred in a
            343px column, spilled 59px off both edges, and made the entire page
            scroll sideways. Stretching keeps children inside the column, and
            from md up the row is horizontal again where centring is what you
            actually want.
          */}
          <div className="flex flex-col items-stretch justify-between gap-4 md:flex-row md:items-center">
            <div className="md:mb-0">
              <p className="text-gray-300 text-sm mb-1">
                {t('footer.copyright', { brand: BRAND_NAME })}
              </p>
              {/*
                gray-400, not gray-500. On this near-black band gray-500 measures
                3.48:1 and fails AA; gray-400 is 5.27:1. See the inverse-surface
                pairs in src/lib/designTokens.ts.
              */}
              <p className="text-gray-400 text-xs mb-0">
                {t('footer.builtOn', { brand: BRAND_NAME })}
              </p>
            </div>
            {/*
              Wraps rather than scrolling: four links do not fit on one 375px
              line, and a sideways-scrolling footer is not a reasonable thing to
              ask anyone to do.
            */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-end">
              {/* <a
                href="/privacy"
                className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="/terms"
                className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
              >
                Terms of Use
              </a> */}
              <a
                href="https://bettercabanatuan.org"
                className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                BetterCabanatuan.org
              </a>
              <a
                href="https://www.facebook.com/bettercabanatuan.org"
                className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://github.com/BetterCabanatuan/bettercabanatuan"
                className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contribute at GitHub
              </a>
              <Link
                to="/sitemap"
                className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
              >
                Sitemap
              </Link>
              <Link
                to="/accessibility"
                className="text-gray-400 hover:text-white inline-flex min-h-[44px] items-center text-sm transition-colors"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
