/**
 * WCAG 2.1 relative-luminance and contrast-ratio math.
 *
 * One implementation, three consumers: the token test suite, the
 * `check-contrast` CLI, and anything that needs to verify a pair at runtime.
 * The ratios printed in docs/DESIGN-TOKENS.md are produced by this code rather
 * than transcribed, so the document cannot claim a number the code disagrees
 * with.
 *
 * Accepts hex (3/6/8 digit), `rgb()`/`rgba()`, and `oklch()` — the last because
 * Tailwind v4 ships its default palette in oklch, and measuring a hand-typed
 * hex approximation of it would be measuring the wrong colour.
 */

type Rgb = { r: number; g: number; b: number };

export function parseHex(hex: string): Rgb {
  const clean = hex.trim().replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`Not a 6-digit hex colour: ${hex}`);
  }
  return {
    r: parseInt(full.slice(0, 2), 16) / 255,
    g: parseInt(full.slice(2, 4), 16) / 255,
    b: parseInt(full.slice(4, 6), 16) / 255,
  };
}

export function parseCssColor(value: string): Rgb {
  const raw = value.trim();

  // #rrggbbaa — composite the alpha over white so a translucent token is
  // measured as it renders on a page.
  if (/^#?[0-9a-f]{8}$/i.test(raw)) {
    const { r, g, b } = parseHex(raw.slice(0, 7));
    const alpha = parseInt(raw.slice(7), 16) / 255;
    return {
      r: r * alpha + 1 * (1 - alpha),
      g: g * alpha + 1 * (1 - alpha),
      b: b * alpha + 1 * (1 - alpha),
    };
  }

  // rgb() / rgba() with integer or percentage channels.
  const fn = raw.match(/^rgba?\(([^)]+)\)$/i);
  if (fn) {
    const parts = fn[1].split(/[,\s/]+/).filter(Boolean);
    const chan = (c: string) =>
      c.endsWith('%') ? parseFloat(c) / 100 : parseFloat(c) / 255;
    const alpha = parts[3] === undefined ? 1 : parseFloat(parts[3]);
    const r = chan(parts[0]);
    const g = chan(parts[1]);
    const b = chan(parts[2]);
    return {
      r: r * alpha + 1 * (1 - alpha),
      g: g * alpha + 1 * (1 - alpha),
      b: b * alpha + 1 * (1 - alpha),
    };
  }

  const ok = raw.match(
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/i
  );
  if (ok) {
    const L = parseFloat(ok[1]) / (ok[2] === '%' ? 100 : 1);
    const C = parseFloat(ok[3]);
    const H = (parseFloat(ok[4]) * Math.PI) / 180;
    const lin = oklchToLinearSrgb(L, C, H);
    const [r, g, b] = lin.map(clampToSrgb);
    const alpha =
      ok[5] === undefined ? 1 : parseFloat(ok[5]) / (ok[6] === '%' ? 100 : 1);
    return {
      r: r * alpha + 1 * (1 - alpha),
      g: g * alpha + 1 * (1 - alpha),
      b: b * alpha + 1 * (1 - alpha),
    };
  }

  return parseHex(raw);
}

/** oklch -> Oklab -> linear sRGB. */
function oklchToLinearSrgb(L: number, C: number, H: number): number[] {
  const a = C * Math.cos(H);
  const b = C * Math.sin(H);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

/** Linear -> sRGB-encoded, clamping out-of-gamut channels at the boundary. */
function clampToSrgb(c: number): number {
  const v = Math.min(1, Math.max(0, c));
  return v <= 0.0031308 ? v * 12.92 : 1.055 * v ** (1 / 2.4) - 0.055;
}

function channelLuminance(c: number): number {
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(color: string): number {
  const { r, g, b } = parseCssColor(color);
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/** WCAG 2.1 contrast ratio, 1–21. Order-independent. */
export function contrastRatio(foreground: string, background: string): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

/** Rounded to 2dp so the table reads the same as the code output. */
export function roundRatio(foreground: string, background: string): number {
  return Math.round(contrastRatio(foreground, background) * 100) / 100;
}

export interface Rgba {
  /** 0–255 channels, not normalised. */
  r: number;
  g: number;
  b: number;
  /** 0–1. */
  a: number;
}

/**
 * Parse any supported colour to raw channels *without* compositing.
 *
 * `parseCssColor` flattens alpha onto white, which is right for a single pair
 * but wrong for a stack: a translucent tint over a tinted section is two
 * separate layers that have to be composited in order. Anything that walks a
 * background chain needs the untouched channels.
 *
 * Accepts the same syntaxes as `parseCssColor` — hex, `rgb()`, `oklch()`.
 */
export function parseColorChannels(value: string): Rgba {
  const raw = value.trim();

  const hex = raw.match(/^#([0-9a-f]{3,8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3 || h.length === 4) {
      h = h
        .split('')
        .map(c => c + c)
        .join('');
    }
    if (h.length !== 6 && h.length !== 8) {
      throw new Error(`Not a valid hex colour: ${value}`);
    }
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
      a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
  }

  const fn = raw.match(/^rgba?\(([^)]+)\)$/i);
  if (fn) {
    const parts = fn[1].split(/[,\s/]+/).filter(Boolean);
    const chan = (c: string) => {
      if (c.endsWith('%')) return (parseFloat(c) * 255) / 100;
      return parseFloat(c);
    };
    return {
      r: chan(parts[0]),
      g: chan(parts[1]),
      b: chan(parts[2]),
      a: parts[3] === undefined ? 1 : parseAlpha(parts[3]),
    };
  }

  // oklch -> Oklab -> linear sRGB -> sRGB-encoded channels.
  const ok = raw.match(
    /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+)(%?))?\s*\)$/i
  );
  if (ok) {
    const L = parseFloat(ok[1]) / (ok[2] === '%' ? 100 : 1);
    const C = parseFloat(ok[3]);
    const H = (parseFloat(ok[4]) * Math.PI) / 180;
    return oklabToRgba(
      L,
      C * Math.cos(H),
      C * Math.sin(H),
      ok[5] === undefined ? 1 : parseAlpha(ok[5], ok[6] === '%')
    );
  }

  // oklab. Chrome reports `bg-white/10` in this form rather than as oklch,
  // because Tailwind v4 defines `white` in oklch and the browser converts on
  // interpolation. Without it, a translucent white chip reads as an
  // unparseable opaque colour and every label inside it is measured against a
  // blank background.
  const lab = raw.match(
    /^oklab\(\s*([\d.]+)(%?)\s+([\d.-]+)\s+([\d.-]+)(?:\s*\/\s*([\d.]+)(%?))?\s*\)$/i
  );
  if (lab) {
    return oklabToRgba(
      parseFloat(lab[1]) / (lab[2] === '%' ? 100 : 1),
      parseFloat(lab[3]),
      parseFloat(lab[4]),
      lab[5] === undefined ? 1 : parseAlpha(lab[5], lab[6] === '%')
    );
  }

  throw new Error(`Unsupported colour syntax: ${value}`);
}

function oklabToRgba(L: number, a: number, b: number, alpha: number): Rgba {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return { r: lin[0] * 255, g: lin[1] * 255, b: lin[2] * 255, a: alpha };
}

function parseAlpha(value: string, wasPercent = value.endsWith('%')): number {
  return wasPercent ? parseFloat(value) / 100 : parseFloat(value);
}

/** Alpha-composite `fg` over an opaque `bg`. Both must be opaque-result. */
export function compositeOver(fg: Rgba, bg: Rgba): Rgba {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  };
}

export function toHex(c: Rgba): string {
  const clamp = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v)))
      .toString(16)
      .padStart(2, '0');
  return `#${clamp(c.r)}${clamp(c.g)}${clamp(c.b)}`;
}

/**
 * Flatten a background chain, nearest layer first, onto an assumed white page.
 *
 * `layers` comes from walking up the DOM, so `layers[0]` is the element's own
 * background. Stops at the first fully opaque layer, which is what makes this
 * cheap on a deep tree.
 */
export function flattenBackground(layers: string[]): string {
  const WHITE: Rgba = { r: 255, g: 255, b: 255, a: 1 };
  let acc = WHITE;
  for (const layer of layers) {
    let c: Rgba;
    try {
      c = parseColorChannels(layer);
    } catch {
      continue;
    }
    if (c.a === 0) continue;
    acc = compositeOver(c, acc);
    if (c.a >= 0.999) break;
  }
  return toHex(acc);
}
