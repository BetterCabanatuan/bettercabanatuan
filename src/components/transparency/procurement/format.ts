export function formatPeso(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0,
  }).format(value);
}

/** "₱5.7B": for headline figures, with the exact amount shown beside them. */
export function formatPesoCompact(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'PHP',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: string, locale: string) {
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(parsed);
}
