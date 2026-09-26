import React, { useEffect, useRef, useState } from 'react';
import { X, Menu, ChevronDown, Globe, Search } from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import type { LanguageType } from '../../types/index';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n/languages';
import BetterCabanatuanLogo from '/LogoLight.svg';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMenu(null);
    };
    const closeOutside = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveMenu(null);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const changeLanguage = (newLanguage: LanguageType) => {
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav ref={navRef} className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar with language switcher and additional links */}
      <div className="hidden border-b border-gray-200 md:block">
        <div className="container mx-auto flex min-h-[44px] items-center justify-end px-4">
          <div className="flex items-center space-x-4">
            <a
              href="https://bettergov.ph/join-us"
              className="text-primary-600 hover:text-primary-700 inline-flex min-h-[44px] items-center text-xs font-semibold transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('navbar.joinUs')}
            </a>
            <a
              href="https://bettergov.ph/about"
              className="text-gray-800 hover:text-primary-600 inline-flex min-h-[44px] items-center text-xs transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('navbar.aboutBetterGov')}
            </a>
            <a
              href="https://www.cabanatuancity.gov.ph"
              className="text-gray-800 hover:text-primary-600 inline-flex min-h-[44px] items-center text-xs transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('navbar.officialGov')}
            </a>

            <a
              href="https://bettergov.ph/philippines/hotlines"
              className="text-gray-800 hover:text-primary-600 inline-flex min-h-[44px] items-center text-xs transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('navbar.hotlines')}
            </a>
            <div className="hidden md:block">
              <select
                aria-label="Language"
                value={i18n.language}
                onChange={e => changeLanguage(e.target.value as LanguageType)}
                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 hover:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src={BetterCabanatuanLogo}
                alt="Better Cabanatuan"
                width={18156}
                height={6580}
                className="mr-3 h-10 w-auto md:h-12"
              />
              {/* <img
                src="/ph-logo.webp"
                alt="Philippines Coat of Arms"
                className="h-12 w-12 mr-3"
              /> */}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden items-center space-x-8 lg:flex">
            {mainNavigation.map(item => (
              <div key={item.label} className="relative group">
                <div className="flex items-center">
                  <Link
                    to={item.href}
                    onFocus={() => item.children && setActiveMenu(item.label)}
                    className="flex min-h-11 items-center font-medium text-gray-700 transition-colors hover:text-primary-600"
                  >
                    {t(`navbar.${item.label.replace(' ', '').toLowerCase()}`)}
                  </Link>
                  {item.children && (
                    <button
                      type="button"
                      aria-label={`Toggle ${item.label} menu`}
                      aria-haspopup="menu"
                      aria-expanded={activeMenu === item.label}
                      aria-controls={`desktop-menu-${item.label.toLowerCase()}`}
                      onClick={() => toggleSubmenu(item.label)}
                      className="inline-flex size-11 items-center justify-center rounded-md text-gray-700 transition-colors hover:bg-gray-50 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                    >
                      <ChevronDown className="ml-1 h-4 w-4 text-gray-800 group-hover:text-primary-600 transition-colors" />
                    </button>
                  )}
                </div>
                {item.children && (
                  <div
                    id={`desktop-menu-${item.label.toLowerCase()}`}
                    className={`absolute left-0 z-50 mt-1 w-64 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${
                      activeMenu === item.label
                        ? 'visible opacity-100'
                        : 'invisible opacity-0'
                    }`}
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          onClick={() => setActiveMenu(null)}
                          className="block min-h-11 px-4 py-3 text-left text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 focus:bg-primary-50 focus:outline-none"
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="hidden lg:flex items-center space-x-6">
            <Link
              to="/about"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {t('navbar.about')}
            </Link>
            <Link
              to="/contact"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              {t('navbar.contact')}
            </Link>
            <Link
              to="/search"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              <Search className="h-4 w-4 mr-1" />
              {t('navbar.search')}
            </Link>
            {/* <Link
              to="/sitemap"
              className="flex items-center text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Sitemap
            </Link> */}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={toggleMenu}
              aria-expanded={isOpen}
              aria-controls="mobile-main-menu"
              className="hover:bg-gray-100 hover:text-primary-500 focus:ring-primary-500 inline-flex size-11 items-center justify-center rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset"
            >
              <span className="sr-only">{t('navbar.openMainMenu')}</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-main-menu"
        className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}
      >
        <div className="container mx-auto px-2 pt-2 pb-4 space-y-1 border-t border-gray-200 bg-white">
          {mainNavigation.map(item => (
            <div key={item.label}>
              {item.children ? (
                <div className="flex items-center">
                  <Link
                    to={item.href}
                    onClick={closeMenu}
                    className="flex min-h-11 flex-1 items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
                  >
                    {t(`navbar.${item.label.toLowerCase()}`)}
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleSubmenu(item.label)}
                    aria-label={`Toggle ${item.label} submenu`}
                    aria-expanded={activeMenu === item.label}
                    aria-controls={`mobile-menu-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                    className="inline-flex size-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-50 hover:text-primary-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
                  >
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        activeMenu === item.label ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>
                </div>
              ) : (
                <Link
                  to={item.href}
                  onClick={closeMenu}
                  className="flex min-h-11 items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
                >
                  {t(`navbar.${item.label.toLowerCase()}`)}
                </Link>
              )}
              {item.children && activeMenu === item.label && (
                <div
                  id={`mobile-menu-${item.label.toLowerCase().replaceAll(' ', '-')}`}
                  className="pl-6 py-2 space-y-1 bg-gray-50"
                >
                  {item.children.map(child => (
                    <Link
                      key={child.label}
                      to={child.href}
                      onClick={closeMenu}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary-500"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <a
            href="https://bettergov.ph/join-us"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center px-4 py-2 text-base font-semibold text-primary-600 hover:bg-primary-50 hover:text-primary-700"
          >
            {t('navbar.joinUs')}
          </a>
          <a
            href="https://bettergov.ph/about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t('navbar.aboutBetterGov')}
          </a>
          <a
            href="https://www.cabanatuancity.gov.ph"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t('navbar.officialGov')}
          </a>
          <a
            href="https://bettergov.ph/philippines/hotlines"
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t('navbar.hotlines')}
          </a>
          <Link
            to="/about"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t('navbar.about')}
          </Link>
          <Link
            to="/contact"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t('navbar.contact')}
          </Link>
          <Link
            to="/search"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t('navbar.search')}
          </Link>
          <Link
            to="/sitemap"
            onClick={closeMenu}
            className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-500"
          >
            {t('navbar.sitemap')}
          </Link>
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-800 mr-2" />
              <select
                aria-label="Language"
                value={i18n.language}
                onChange={e => changeLanguage(e.target.value as LanguageType)}
                className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-700 hover:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
