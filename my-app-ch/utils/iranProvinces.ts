// Static list — Iran has 31 provinces, this doesn't change, no need
// for an API call. City is a free-text input rather than a full
// province→city dependent dropdown (that dataset is large; tell me if
// you want the full mapping built and I'll add it as a separate file).
export const IRAN_PROVINCES = [
  'آذربایجان شرقی', 'آذربایجان غربی', 'اردبیل', 'اصفهان', 'البرز',
  'ایلام', 'بوشهر', 'تهران', 'چهارمحال و بختیاری', 'خراسان جنوبی',
  'خراسان رضوی', 'خراسان شمالی', 'خوزستان', 'زنجان', 'سمنان',
  'سیستان و بلوچستان', 'فارس', 'قزوین', 'قم', 'کردستان',
  'کرمان', 'کرمانشاه', 'کهگیلویه و بویراحمد', 'گلستان', 'گیلان',
  'لرستان', 'مازندران', 'مرکزی', 'هرمزگان', 'همدان', 'یزد',
] as const;
