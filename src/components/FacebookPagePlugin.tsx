import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (element?: HTMLElement) => void;
      };
    };
    fbAsyncInit?: () => void;
  }
}

const SDK_VERSION = 'v22.0';
const LOAD_TIMEOUT_MS = 12_000;

let sdkLocale: string | null = null;
let sdkLoaded = false;
let sdkLoading = false;
const sdkLoadCallbacks: Array<() => void> = [];

function getFacebookLocale(language: string): string {
  if (language.startsWith('fil')) return 'fil_PH';
  return 'en_US';
}

function loadFacebookSdk(locale: string): Promise<void> {
  return new Promise(resolve => {
    if (sdkLoaded && window.FB && sdkLocale === locale) {
      resolve();
      return;
    }

    sdkLoadCallbacks.push(resolve);

    if (sdkLoading) return;

    sdkLoading = true;
    sdkLocale = locale;

    if (!document.getElementById('fb-root')) {
      const root = document.createElement('div');
      root.id = 'fb-root';
      document.body.prepend(root);
    }

    window.fbAsyncInit = () => {
      sdkLoaded = true;
      sdkLoading = false;
      sdkLoadCallbacks.forEach(cb => cb());
      sdkLoadCallbacks.length = 0;
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = `https://connect.facebook.net/${locale}/sdk.js#xfbml=1&version=${SDK_VERSION}`;
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
  });
}

interface FacebookPagePluginProps {
  href: string;
  pageName?: string;
  tabs?: string;
  width?: number;
  height?: number;
  hideCover?: boolean;
  showFacepile?: boolean;
  hideCta?: boolean;
  smallHeader?: boolean;
  adaptContainerWidth?: boolean;
  lazy?: boolean;
  framed?: boolean;
  className?: string;
}

function FacebookEmbedSkeleton({ height }: { height: number }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col gap-3 bg-white p-4 motion-safe:animate-pulse"
      aria-hidden="true"
    >
      <div className="flex items-center gap-3">
        <div className="size-10 shrink-0 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 rounded-md bg-gray-200" />
          <div className="h-2.5 w-1/3 rounded-md bg-gray-100" />
        </div>
      </div>
      <div
        className="rounded-lg bg-gray-100"
        style={{ height: Math.max(height - 88, 120) }}
      />
      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-md bg-gray-100" />
        <div className="h-2.5 w-4/5 rounded-md bg-gray-100" />
      </div>
    </div>
  );
}

export default function FacebookPagePlugin({
  href,
  pageName,
  tabs = 'timeline',
  width = 500,
  height = 500,
  hideCover = false,
  showFacepile = true,
  hideCta = false,
  smallHeader = false,
  adaptContainerWidth = true,
  lazy = false,
  framed = true,
  className,
}: FacebookPagePluginProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    if (!href) return;

    setIsLoaded(false);
    setHasFailed(false);
    const locale = getFacebookLocale(i18n.language);
    let observer: MutationObserver | undefined;
    let rafId = 0;

    const timeoutId = window.setTimeout(
      () => setHasFailed(true),
      LOAD_TIMEOUT_MS
    );

    loadFacebookSdk(locale).then(() => {
      if (!containerRef.current || !window.FB) return;

      // Parse after layout so Facebook can read the parent width (min 180, max 500).
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          window.FB?.XFBML.parse(containerRef.current!);
        });
      });

      observer = new MutationObserver(() => {
        const iframe = containerRef.current?.querySelector('iframe');
        if (iframe) {
          setIsLoaded(true);
          setHasFailed(false);
          window.clearTimeout(timeoutId);
          observer?.disconnect();
        }
      });

      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      window.clearTimeout(timeoutId);
    };
  }, [
    href,
    tabs,
    width,
    height,
    hideCover,
    showFacepile,
    hideCta,
    smallHeader,
    adaptContainerWidth,
    lazy,
    i18n.language,
  ]);

  if (!href) return null;

  if (hasFailed) {
    return (
      <div
        data-embed-fallback=""
        className={cn(
          'w-full max-w-lg rounded-xl bg-primary-50 p-5 ring-1 ring-primary-100',
          className
        )}
        role="status"
      >
        <p className="font-semibold text-gray-900">
          Facebook updates are hosted externally
        </p>
        <p className="mt-1 text-sm text-gray-600">
          The embedded feed could not load. Open the official page to view the
          latest announcements.
        </p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${pageName ?? 'this page'} on Facebook`}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
        >
          View on Facebook
          <ExternalLink className="size-4" aria-hidden="true" />
        </a>
      </div>
    );
  }

  const embed = (
    <div
      ref={containerRef}
      className={cn('relative', framed && 'rounded-xl overflow-hidden')}
      style={{ width: '100%', maxWidth: width, minHeight: height }}
      aria-busy={!isLoaded}
      aria-label={t('news.embedLabel', { page: pageName ?? href })}
    >
      {!isLoaded && (
        <span className="sr-only" role="status" aria-live="polite">
          Loading Facebook updates…
        </span>
      )}
      {!isLoaded && <FacebookEmbedSkeleton height={height} />}
      <div
        className="fb-page"
        data-href={href}
        data-tabs={tabs}
        data-width={width}
        data-height={height}
        data-hide-cover={hideCover ? 'true' : 'false'}
        data-show-facepile={showFacepile ? 'true' : 'false'}
        data-hide-cta={hideCta ? 'true' : 'false'}
        data-small-header={smallHeader ? 'true' : 'false'}
        data-adapt-container-width={adaptContainerWidth ? 'true' : 'false'}
        data-lazy={lazy ? 'true' : 'false'}
      >
        <blockquote cite={href} className="fb-xfbml-parse-ignore">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {pageName ?? href}
          </a>
        </blockquote>
      </div>
    </div>
  );

  if (!framed) {
    return (
      <div className={cn('w-full', className)} style={{ maxWidth: width }}>
        {embed}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full rounded-2xl bg-white p-2',
        'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]',
        'ring-1 ring-black/[0.06]',
        className
      )}
      style={{ maxWidth: width }}
    >
      {embed}
    </div>
  );
}
