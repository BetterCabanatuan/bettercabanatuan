import { expect, test } from '@playwright/test';
import { ALL_PATHS } from '../scripts/routes.mjs';
import {
  roundRatio,
  parseColorChannels,
  compositeOver,
  toHex,
} from '../src/lib/contrast';

/**
 * Rendered text contrast.
 *
 * `npm run check:contrast` verifies the *token* layer: every pair the design
 * system promises to keep accessible is measured against its declared
 * background. That cannot see a background set on an ancestor, so on its own it
 * would happily pass a page whose only legible text is legible by accident.
 *
 * This spec closes that gap. It reads computed styles from a live page, walks
 * the real paint stack behind each run of text, and measures what actually
 * renders — including gradient bands, where a label can clear the ratio at one
 * end and fail at the other.
 *
 * Elements to ignore are declared inline, next to the check that skips them.
 */

/** 320px is the narrowest supported viewport and the most likely to clip. */
const WIDTHS = [320, 1440];

test.describe('rendered text meets WCAG 2.1 AA', () => {
  for (const width of WIDTHS) {
    test(`every route at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });

      const failures: string[] = [];

      for (const path of ALL_PATHS) {
        await page.goto(path);

        // `networkidle` because several pages fetch their content through a
        // dynamic `import()` after first paint; measuring during that window
        // would audit a half-rendered page and pass for the wrong reason. The
        // `<main>` wait covers the SPA case, where `goto` resolves before React
        // has painted anything.
        await page.waitForLoadState('networkidle');
        await page.waitForFunction(
          () => document.querySelector('main h1') !== null,
          undefined,
          { timeout: 15_000 }
        );

        const samples = await page.evaluate(() => {
          /**
           * The alpha of a computed colour, or 0 when fully transparent.
           *
           * Written generically because the browser chooses the notation:
           * `bg-white/10` comes back as `oklab(... / 0.1)`, a Tailwind default as
           * `oklch(...)`, a plain token as `rgb(...)`. Matching a fixed list is
           * how a translucent white chip once got treated as opaque white.
           */
          const alphaOf = (value: string): number => {
            if (!value || value === 'transparent') return 0;
            const slash = value.match(/\/\s*([\d.]+%?)\s*\)/);
            if (slash) {
              const n = parseFloat(slash[1]);
              return slash[1].endsWith('%') ? n / 100 : n;
            }
            const legacy = value.match(
              /^(?:rgba|hsla|hwb|lab|lch|oklab|oklch|color)\([^)]*,\s*([\d.]+%?)\s*\)$/i
            );
            if (legacy) {
              const n = parseFloat(legacy[1]);
              return legacy[1].endsWith('%') ? n / 100 : n;
            }
            return 1;
          };

          /** Colour stops in a gradient; `var()` references are resolved. */
          const gradientStops = (image: string, node: Element): string[] => {
            if (!image || image === 'none' || !image.includes('gradient'))
              return [];
            const resolved = image.replace(
              /var\(\s*(--[a-z0-9-]+)\s*(?:,\s*([^)]*))?\)/gi,
              (_, name: string, fallback: string) => {
                const value = getComputedStyle(node)
                  .getPropertyValue(name)
                  .trim();
                return value || (fallback ?? '').trim();
              }
            );
            return [
              ...resolved.matchAll(
                /rgba?\([^)]+\)|oklch\([^)]+\)|oklab\([^)]+\)|hsla?\([^)]+\)|#[0-9a-f]{3,8}/gi
              ),
            ].map(m => m[0]);
          };

          /**
           * The paint stack behind an element, nearest layer first.
           *
           * CSS paints an ancestor's `background-image` *above* its own
           * `background-color`, and everything further up is behind that image
           * entirely. So the walk stops at the first gradient and treats its
           * stops as the base, with the translucent layers collected so far
           * stacked on top.
           */
          const backgroundStack = (el: Element) => {
            const layers: string[] = [];
            let gradient: string[] = [];
            let node: Element | null = el;
            while (node && node !== document.documentElement) {
              const cs = getComputedStyle(node);
              const alpha = alphaOf(cs.backgroundColor);
              if (alpha > 0) {
                if (alpha >= 0.999) {
                  return { layers: [...layers, cs.backgroundColor], gradient };
                }
                layers.push(cs.backgroundColor);
              }
              const stops = gradientStops(cs.backgroundImage, node);
              if (stops.length) {
                gradient = stops;
                break;
              }
              node = node.parentElement;
            }
            return { layers, gradient };
          };

          const out: Array<{
            text: string;
            fg: string;
            layers: string[];
            gradient: string[];
            fontSize: number;
            weight: number;
          }> = [];

          const TEXTUAL =
            'p, span, a, li, h1, h2, h3, h4, h5, h6, dt, dd, label, button, td, th, legend, figcaption';

          for (const el of document.querySelectorAll(TEXTUAL)) {
            const own = [...el.childNodes]
              .filter(n => n.nodeType === 3)
              .map(n => n.textContent?.trim() ?? '')
              .join(' ')
              .trim();
            if (own.length < 2) continue;

            const cs = getComputedStyle(el);
            if (
              cs.visibility === 'hidden' ||
              cs.display === 'none' ||
              cs.opacity === '0'
            )
              continue;
            if (el.closest('[aria-hidden="true"]')) continue;

            // Visually hidden text is exposed to assistive tech only; its whole
            // purpose is to be 1x1, so it is not a contrast case.
            if (cs.clip === 'rect(0px, 0px, 0px, 0px)') continue;
            if (cs.clipPath === 'inset(50%)') continue;
            if (el.closest('.sr-only')) continue;

            const r = el.getBoundingClientRect();
            if (!r.width || !r.height) continue;

            const { layers, gradient } = backgroundStack(el);
            out.push({
              text: own.slice(0, 40),
              fg: cs.color,
              layers,
              gradient,
              fontSize: parseFloat(cs.fontSize),
              weight: Number(cs.fontWeight) || 400,
            });
          }
          return out;
        });

        for (const s of samples) {
          // Every plausible surface: the flattened solid chain plus each
          // gradient stop. The worst one decides, because a label that is
          // legible at one end of a band and not the other has failed.
          const backgrounds = new Set<string>();
          const bases =
            s.gradient.length > 0 ? s.gradient : ['rgb(255, 255, 255)'];
          for (const base of bases) {
            let acc: ReturnType<typeof parseColorChannels>;
            try {
              acc = parseColorChannels(base);
            } catch {
              continue;
            }
            for (let i = s.layers.length - 1; i >= 0; i--) {
              let layer;
              try {
                layer = parseColorChannels(s.layers[i]);
              } catch {
                continue;
              }
              if (layer.a === 0) continue;
              acc = compositeOver(layer, acc);
            }
            backgrounds.add(toHex(acc));
          }
          if (backgrounds.size === 0) continue;

          // WCAG "large text": >=24px, or >=18.66px when bold.
          const isLarge =
            s.fontSize >= 24 || (s.fontSize >= 18.66 && s.weight >= 700);
          const need = isLarge ? 3 : 4.5;

          let fgRgba;
          try {
            fgRgba = parseColorChannels(s.fg);
          } catch {
            continue;
          }
          if (fgRgba.a === 0) continue;
          // Composite the text's own alpha so `text-white/85` is measured as
          // it renders, not as pure white.
          const fg = toHex(
            compositeOver(fgRgba, parseColorChannels([...backgrounds][0]))
          );

          let worst = { ratio: Infinity, bg: [...backgrounds][0] };
          for (const bg of backgrounds) {
            const ratio = roundRatio(fg, bg);
            if (ratio < worst.ratio) worst = { ratio, bg };
          }
          if (worst.ratio >= need) continue;

          failures.push(
            `${path}: "${s.text}" ${worst.ratio}:1 (needs ${need}:1, ${Math.round(s.fontSize)}px${s.weight >= 700 ? ' bold' : ''}, ${fg} on ${worst.bg})`
          );
        }
      }

      expect(failures, `sub-AA text at ${width}px`).toEqual([]);
    });
  }
});
