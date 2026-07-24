interface Perk {
  icon: string;
  title: string;
  sub: string;
}

const PERKS: Perk[] = [
  { icon: 'bi-arrow-repeat', title: 'ضمانت بازگشت کالا', sub: '۷ روز ضمانت بازگشت بدون قید و شرط' },
  { icon: 'bi-shield-lock', title: 'پرداخت امن', sub: 'اطلاعات شما کاملاً رمزنگاری می‌شود' },
  { icon: 'bi-patch-check', title: 'ضمانت اصالت کالا', sub: 'کالاهای اصل با گارانتی معتبر' },
];

export default function TrustBadges() {
  return (
    <div className="checkout-perks">
      {PERKS.map((perk) => (
        <div key={perk.title} className="checkout-perks__item">
          <span className="checkout-perks__icon">
            <i className={`bi ${perk.icon}`} />
          </span>
          <span className="checkout-perks__text">
            <span className="checkout-perks__title">{perk.title}</span>
            <span>{perk.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
