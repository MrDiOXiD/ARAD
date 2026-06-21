const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

/** Converts ASCII digits in a number/string to Persian (Farsi) digits. */
export function toPersianDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => persianDigits[Number(d)]);
}

/** Formats a number with thousands separators and Persian digits, e.g. 480000 -> ۴۸۰,۰۰۰ */
export function formatPrice(value: number): string {
  const withSeparators = value.toLocaleString('en-US');
  return toPersianDigits(withSeparators);
}

/** Formats a rating like 4.2 -> ۴.۲ */
export function formatRating(value: number): string {
  return toPersianDigits(value.toFixed(1));
}

/** Renders a 5-star string with filled/empty stars based on a 0-5 rating. */
export function starString(rating: number): string {
  const rounded = Math.round(rating);
  return '★★★★★'.slice(0, rounded) + '☆☆☆☆☆'.slice(0, 5 - rounded);
}