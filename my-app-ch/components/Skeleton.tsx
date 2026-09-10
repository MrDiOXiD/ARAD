export function Skel({ className = '' }: { className?: string }) {
  return <div className={`skel ${className}`} />;
}

export function HomeSkeleton() {
  return (
    <div className="skel-page" dir="rtl">
      <div className="skel-banners">
        <div className="skel-banner-sm"><Skel className="skel-tag" /></div>
        <div className="skel-banner-lg"><Skel className="skel-tag" /></div>
        <div className="skel-banner-tall"><Skel className="skel-tag" /></div>
      </div>

      <div className="skel-row">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="skel-card">
            <Skel className="skel-img" />
            <Skel className="skel-line" />
            <Skel className="skel-line skel-line--short" />
            <Skel className="skel-btn" />
          </div>
        ))}
      </div>

      <div className="skel-grid">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="skel-card">
            <Skel className="skel-img" />
            <Skel className="skel-line" />
            <Skel className="skel-btn" />
          </div>
        ))}
      </div>
    </div>
  );
}
