'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

const Y = '#F5C518';

const quickLinks = [
  'نور و روشنایی', 'لامپ‌های LED', 'لوسترها', 'نورپردازی خارجی',
];

const categories = [
  'کلید و پریز', 'ابزار برقی', 'سیم و کابل', 'تهویه مطبوع',
];

const brands = [
  'ویسمن', 'اسنوا', 'فاراد', 'الکتروکاوه',
];

/* ── Mobile accordion rows ──
   "درباره ما" is a plain link in the mock (no chevron/expand), the rest
   are real accordions. Fill in ACCORDION[i].content with real copy
   whenever it's ready — placeholder text for now so the UI is functional. */
const ACCORDION = [
  { label: 'راهنمای خرید', icon: 'bi-bag', content: 'محتوای این بخش به‌زودی تکمیل می‌شود.' },
  { label: 'خدمات مشتریان', icon: 'bi-headset', content: 'محتوای این بخش به‌زودی تکمیل می‌شود.' },
  { label: 'شرایط ارسال و بازگشت', icon: 'bi-truck', content: 'محتوای این بخش به‌زودی تکمیل می‌شود.' },
  { label: 'قوانین و مقررات', icon: 'bi-file-earmark-text', content: 'محتوای این بخش به‌زودی تکمیل می‌شود.' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [lightPos, setLightPos] = useState({ x: -999, y: -999 });
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = footerRef.current!.getBoundingClientRect();
    setLightPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => setLightPos({ x: -999, y: -999 });

  return (
    <footer ref={footerRef}>

      {/* ╔══════════════════════════════════╗
          ║   MOBILE FOOTER (below sm)       ║
          ║   Note: light theme, matching    ║
          ║   the mock — the desktop footer  ║
          ║   below stays on its dark theme. ║
          ╚══════════════════════════════════╝ */}
      <div className="footer-mobile sm:hidden" dir="rtl">

        {/* brand */}
        <div className="footer-mobile-brand">
          <div className="flex items-center gap-2 justify-center">
            <div className="flex flex-col items-end">
              <span className="font-extrabold text-lg text-gray-900">الکتریکی فانوس</span>
              <span className="text-xs text-gray-400" dir="ltr">electricfanoos.com</span>
            </div>
            <div
              className="flex items-center justify-center w-11 h-11 rounded-full flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${Y}, #FF7A00)` }}
            >
              <i className="bi bi-lightning-charge-fill text-white text-lg" />
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3 leading-relaxed">
            فروش انواع تجهیزات الکتریکی و روشنایی<br />با بهترین کیفیت و قیمت
          </p>
        </div>

        {/* contact cards */}
        <div className="grid grid-cols-2 gap-3 px-4 mt-5">
          <div className="footer-info-card">
            <div className="footer-info-icon"><i className="bi bi-telephone-fill" /></div>
            <span className="footer-info-title">تماس با ما</span>
            <span className="footer-info-sub" dir="ltr">021-77768004</span>
            <span className="footer-info-sub">همه روزه ۸ تا ۲۰</span>
            <a href="tel:02177768004" className="footer-info-btn">
              <i className="bi bi-telephone" /> تماس مستقیم
            </a>
          </div>
          <div className="footer-info-card">
            <div className="footer-info-icon"><i className="bi bi-geo-alt-fill" /></div>
            <span className="footer-info-title">شعبه حضوری</span>
            <span className="footer-info-sub">تهران، خیابان دماوند</span>
            <span className="footer-info-sub">خیابان ابوریحان، کوچه معنوی</span>
            <a href="#" className="footer-info-btn">
              <i className="bi bi-send" /> مسیریابی
            </a>
          </div>
        </div>

        {/* accordion */}
        <div className="footer-accordion">
          <Link href="/about" className="footer-accordion-trigger no-underline">
            <span />
            <span>درباره ما</span>
            <i className="bi bi-info-circle footer-accordion-icon" />
          </Link>

          {ACCORDION.map((item, i) => {
            const open = openAccordion === i;
            return (
              <div key={item.label} className="footer-accordion-item">
                <button
                  type="button"
                  className="footer-accordion-trigger"
                  onClick={() => setOpenAccordion(open ? null : i)}
                  aria-expanded={open}
                >
                  <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'} text-xs text-gray-400`} />
                  <span>{item.label}</span>
                  <i className={`bi ${item.icon} footer-accordion-icon`} />
                </button>
                {open && <div className="footer-accordion-panel">{item.content}</div>}
              </div>
            );
          })}
        </div>

        {/* trust badges */}
        <div className="footer-trust">
          <div className="footer-trust-item">
            <i className="bi bi-shield-lock-fill" />
            <span>درگاه پرداخت امن</span>
          </div>
          <div className="footer-trust-item">
            <i className="bi bi-patch-check-fill" />
            <span>ساماندهی وزارت صمت</span>
          </div>
          <div className="footer-trust-item">
            <i className="bi bi-award-fill" />
            <span>نماد اعتماد الکترونیکی</span>
          </div>
        </div>

        <p className="footer-mobile-copyright">
          تمامی حقوق این سایت متعلق به الکتریکی فانوس می‌باشد.
        </p>
      </div>

      {/* ╔══════════════════════════════════╗
          ║   DESKTOP FOOTER (sm and up)     ║
          ╚══════════════════════════════════╝ */}
      <div
        className="site-footer hidden sm:block"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Mouse-following light */}
        <div
          className="footer-light"
          style={{ left: lightPos.x, top: lightPos.y }}
        />

        <div className="footer-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── Main grid ── */}
          <div className="footer-main">

            {/* Branch + map */}
            <div>
              <h4 className="footer-col-title">شعبه حضوری</h4>
              <div className="footer-branch-map">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.9!2d51.5!3d35.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQyJzAwLjAiTiA1McKwMzAnMDAuMCJF!5e0!3m2!1sen!2s!4v1"
                  title="موقعیت شعبه"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="footer-branch-addr">
                تهران، خیابان دماوند<br />
                خیابان ابوریحان<br />
                کوچه معنوی، پلاک ۵
              </p>
            </div>

            {/* Quick access 1 */}
            <div>
              <h4 className="footer-col-title">دسترسی سریع</h4>
              <ul className="footer-links">
                {quickLinks.map(l => (
                  <li key={l}><Link href="#">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Quick access 2 */}
            <div>
              <h4 className="footer-col-title">دسترسی سریع</h4>
              <ul className="footer-links">
                {categories.map(l => (
                  <li key={l}><Link href="#">{l}</Link></li>
                ))}
              </ul>
            </div>

            {/* Quick access 3 */}
            <div>
              <h4 className="footer-col-title">دسترسی سریع</h4>
              <ul className="footer-links">
                {brands.map(l => (
                  <li key={l}><Link href="#">{l}</Link></li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── Bottom bar ── */}
          <div className="footer-bottom">
            <span>تمامی حقوق این سایت متعلق به الکتریکی آنلاین می‌باشد.</span>
            <div className="flex items-center gap-2">
              <i className="bi bi-lightning-charge-fill text-base" style={{ color: '#F5C518' }} />
              <span className="text-gray-500 text-xs">الکتریکی آنلاین</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
