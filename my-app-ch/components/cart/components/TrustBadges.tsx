const BADGES = [
  {
    label: 'ضمانت اصالت و سلامت کالا',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: 'ارسال سریع به سراسر کشور',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <rect x={1} y={3} width={15} height={13} />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx={5.5} cy={18.5} r={2.5} />
        <circle cx={18.5} cy={18.5} r={2.5} />
      </svg>
    ),
  },
  {
    label: 'امکان بازگشت کالا تا ۷ روز',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <polyline points="23 4 23 10 17 10" />
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
      </svg>
    ),
  },
] as const;

export default function TrustBadges() {
  return (
    <div className="trust-badges">
      {BADGES.map((badge) => (
        <div key={badge.label} className="trust-badges__item">
          <span className="trust-badges__icon">{badge.icon}</span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
