'use client';

import { SpecGroup } from '@/interfaces/product/types';
import { toPersianDigits } from '@/utils/formats/numbers';
import { useState } from 'react';


interface ProductTabsProps {
  specGroups: SpecGroup[];
  reviewsCount?: number;
  qaCount?: number;
  description?: string;
}

type TabId = 'specs' | 'description' | 'reviews' | 'qa';

export default function ProductTabs({ specGroups, reviewsCount = 0, qaCount = 0, description }: ProductTabsProps) {
  const [active, setActive] = useState<TabId>('specs');

  const tabs: { id: TabId; label: string; count?: number }[] = [
    { id: 'specs', label: 'مشخصات فنی' },
    { id: 'description', label: 'توضیحات محصول' },
    { id: 'reviews', label: 'نظرات کاربران', count: reviewsCount },
    { id: 'qa', label: 'پرسش و پاسخ', count: qaCount },
  ];

  return (
    <section className="prd-card prd-tabs-section">
      <div className="prd-tabs" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={`prd-tab${active === tab.id ? ' prd-tab--active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
            {typeof tab.count === 'number' && tab.count > 0 && (
              <span className="prd-tab-count">{toPersianDigits(tab.count)}</span>
            )}
          </button>
        ))}
      </div>

      {active === 'specs' && (
        <div className="prd-specs" key="specs">
          {specGroups.map((group) => (
            <div key={group.title} className="prd-spec-group">
              <h3 className="prd-spec-group-title">{group.title}</h3>
              <table className="prd-spec-table">
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      <td className="prd-label">{row.label}</td>
                      <td className="prd-value">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {active === 'description' && (
        <div className="prd-specs" key="description">
          <p style={{ fontSize: 13.5, color: '#555', lineHeight: 1.9, margin: 0 }}>
            {description ?? 'توضیحاتی برای این محصول ثبت نشده است.'}
          </p>
        </div>
      )}

      {active === 'reviews' && (
        <div className="prd-specs" key="reviews">
          <p style={{ fontSize: 13.5, color: '#aaa', margin: 0 }}>نظرات کاربران به‌زودی نمایش داده می‌شود.</p>
        </div>
      )}

      {active === 'qa' && (
        <div className="prd-specs" key="qa">
          <p style={{ fontSize: 13.5, color: '#aaa', margin: 0 }}>سوالی ثبت نشده است. اولین نفری باشید که سوال می‌پرسد.</p>
        </div>
      )}
    </section>
  );
}
