'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';

/* ── Each banner card links to a nav category ── */
interface BannerCard {
  id: string;
  title: string;
  subtitle?: string;
  gradient: string;          /* CSS gradient string          */
  icon: string;              /* bootstrap-icons class        */
  iconColor: string;
  bgIcon?: string;           /* large decorative bg icon     */
  href: string;
  tall?: boolean;            /* center card spans 2 rows     */
  imagePlaceholder?: string; /* alt text / future img src    */
  accentLine?: string;       /* small coloured top stripe    */
  delay: number;             /* intersection observer delay  */
}

const CARDS: BannerCard[] = [
  /* ── LEFT COLUMN — 2 stacked ── */
  {
    id: 'lighting',
    title: 'نور و روشنایی',
    subtitle: 'لامپ‌های کم‌مصرف و دکوراتیو',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
    icon: 'bi-lightbulb-fill',
    iconColor: 'rgba(255,255,255,0.9)',
    bgIcon: 'bi-lightbulb',
    href: '#',
    delay: 0,
  },
  {
    id: 'tools',
    title: 'ابزار و لوازم برقی',
    subtitle: 'ابزارآلات حرفه‌ای و خانگی',
    gradient: 'linear-gradient(135deg, #F5C518 0%, #E8A000 100%)',
    icon: 'bi-tools',
    iconColor: 'rgba(255,255,255,0.9)',
    bgIcon: 'bi-tools',
    href: '#',
    delay: 80,
  },

  /* ── CENTER — tall card ── */
  {
    id: 'switches',
    title: 'عنواع لامپ های کم مصرف',
    subtitle: 'بهترین برندها با گارانتی اصل',
    gradient: 'linear-gradient(145deg, #FFB800 0%, #FF8C00 60%, #FF6B00 100%)',
    icon: 'bi-lightbulb',
    iconColor: '#fff',
    bgIcon: 'bi-lightbulb',
    href: '#',
    tall: true,
    imagePlaceholder: 'تصویر لامپ‌های کم‌مصرف',
    delay: 40,
  },

  /* ── RIGHT COLUMN — 2 stacked ── */
  {
    id: 'antenna',
    title: 'آنتن',
    subtitle: 'آنتن‌های هوایی و ماهواره',
    gradient: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
    icon: 'bi-broadcast',
    iconColor: 'rgba(255,255,255,0.9)',
    bgIcon: 'bi-broadcast',
    href: '#',
    delay: 120,
  },
  {
    id: 'cable',
    title: 'سیم و کابل',
    subtitle: 'انواع کابل‌های مسی و شبکه',
    gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFA000 100%)',
    icon: 'bi-ethernet',
    iconColor: 'rgba(255,255,255,0.9)',
    bgIcon: 'bi-ethernet',
    href: '#',
    delay: 160,
  },
];

/* ── Decorative hanging bulb shapes for the center card ── */
function HangingBulbs() {
  return (
    <div className="absolute inset-0 flex items-start justify-center pt-4 pointer-events-none select-none overflow-hidden">
      {/* Five hanging bulbs at different heights */}
      {[
        { left: '18%',  top: '8%',  size: 44, delay: '0s',    type: 'spot'    },
        { left: '32%',  top: '2%',  size: 36, delay: '0.1s',  type: 'cfl'     },
        { left: '50%',  top: '0%',  size: 52, delay: '0.05s', type: 'globe'   },
        { left: '66%',  top: '4%',  size: 38, delay: '0.15s', type: 'cfl'     },
        { left: '80%',  top: '10%', size: 48, delay: '0.08s', type: 'globe'   },
      ].map((b, i) => (
        <div
          key={i}
          className="hanging-bulb absolute flex flex-col items-center"
          style={{
            left: b.left,
            top: 0,
            animationDelay: b.delay,
          }}
        >
          {/* wire */}
          <div style={{
            width: 1,
            height: `calc(${b.top} + ${b.size * 0.4}px)`,
            minHeight: 20,
            background: 'rgba(255,255,255,0.55)',
          }} />
          {/* bulb icon */}
          <i
            className={`bi ${b.type === 'cfl' ? 'bi-lightbulb' : b.type === 'spot' ? 'bi-lamp-fill' : 'bi-lightbulb-fill'}`}
            style={{
              fontSize: b.size,
              color: 'rgba(255,255,255,0.92)',
              filter: 'drop-shadow(0 2px 8px rgba(255,200,0,0.4))',
              marginTop: `${b.top}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default function HeroBanner() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.delay ?? 0);
            setTimeout(() => {
              el.classList.add('banner-card--visible');
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );

    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  /* split cards into columns */
  const leftCards   = CARDS.filter((_, i) => i < 2);
  const centerCard  = CARDS.find(c => c.tall)!;
  const rightCards  = CARDS.filter((_, i) => i > 2);

  const renderCard = (card: BannerCard, idx: number, tall = false) => (
    <div
      key={card.id}
      ref={el => { cardRefs.current[CARDS.indexOf(card)] = el; }}
      data-delay={card.delay}
      className={`banner-card relative overflow-hidden rounded-2xl flex flex-col justify-end group cursor-pointer ${tall ? 'banner-card--tall' : 'banner-card--short'}`}
      style={{ background: card.gradient }}
    >
      {/* Large decorative background icon */}
      {card.bgIcon && (
        <i
          className={`bi ${card.bgIcon} banner-bg-icon`}
          aria-hidden="true"
        />
      )}

      {/* Hanging bulbs only on center card */}
      {tall && <HangingBulbs />}

      {/* Shimmer sweep on hover */}
      <div className="banner-shimmer" />

      {/* Content */}
      <div className="relative z-10 p-4 flex flex-col gap-2">
        {card.subtitle && !tall && (
          <p className="text-[11px] font-medium text-white/70 text-right">{card.subtitle}</p>
        )}
        <h3
          className={`font-bold text-white text-right leading-snug ${tall ? 'text-lg sm:text-xl' : 'text-sm sm:text-base'}`}
          style={{ fontFamily: 'Vazirmatn, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.18)' }}
        >
          {card.title}
        </h3>
        {tall && card.subtitle && (
          <p className="text-[12px] font-medium text-white/75 text-right">{card.subtitle}</p>
        )}

        {/* CTA Button */}
        <Link
          href={card.href}
          className="banner-cta mt-1 inline-flex items-center gap-2 self-start"
          dir="rtl"
        >
          <i className="bi bi-chevron-left text-xs leading-none" />
          <span style={{ fontFamily: 'Vazirmatn, sans-serif' }}>مشاهده محصولات</span>
        </Link>
      </div>
    </div>
  );

  return (
    <section
      dir="rtl"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      style={{ fontFamily: 'Vazirmatn, sans-serif' }}
    >
      <div className="banner-grid">
        {/* Left column */}
        <div className="banner-col">
          {leftCards.map((c, i) => renderCard(c, i))}
        </div>

        {/* Center — tall */}
        <div className="banner-col banner-col--center">
          {renderCard(centerCard, 2, true)}
        </div>

        {/* Right column */}
        <div className="banner-col">
          {rightCards.map((c, i) => renderCard(c, i + 3))}
        </div>
      </div>
    </section>
  );
}
