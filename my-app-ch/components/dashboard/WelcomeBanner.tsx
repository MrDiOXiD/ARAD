import Link from 'next/link';

interface WelcomeBannerProps {
  userName: string;
  memberSince: string;
}

export default function WelcomeBanner({ userName, memberSince }: WelcomeBannerProps) {
  return (
    <section className="db-welcome" aria-label="خوش‌آمدگویی">
      <div className="db-welcome__content">
        <h1 className="db-welcome__heading">
          <span className="db-welcome__wave" aria-hidden="true">👋</span>
          سلام {userName} جان
        </h1>
        <p className="db-welcome__subtitle">
          خوش آمدی به پنل کاربری الکتریکی آنلاین
        </p>

        <div className="db-welcome__meta">
          <i className="bi bi-calendar3" aria-hidden="true" />
          <span>عضویت از {memberSince}</span>
        </div>

        <Link href="/dashboard/account" className="db-welcome__cta">
          مشاهده و ویرایش پروفایل
          <i className="bi bi-arrow-left" aria-hidden="true" />
        </Link>
      </div>

      {/* Decorative product image area */}
      <div className="db-welcome__illustration" aria-hidden="true">
        <div className="db-welcome__img-placeholder">
          <span>⚡</span>
        </div>
      </div>
    </section>
  );
}
