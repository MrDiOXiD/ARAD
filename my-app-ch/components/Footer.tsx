'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

const quickLinks = [
  'نور و روشنایی', 'لامپ‌های LED', 'لوسترها', 'نورپردازی خارجی',
];

const categories = [
  'کلید و پریز', 'ابزار برقی', 'سیم و کابل', 'تهویه مطبوع',
];

const brands = [
  'ویسمن', 'اسنوا', 'فاراد', 'الکتروکاوه',
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [lightPos, setLightPos] = useState({ x: -999, y: -999 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = footerRef.current!.getBoundingClientRect();
    setLightPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseLeave = () => setLightPos({ x: -999, y: -999 });

  return (
    <footer
      ref={footerRef}
      className="site-footer"
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
    </footer>
  );
}
