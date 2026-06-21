import { TrustItem } from "@/interfaces/product/types";
import { IconReturn, IconShield, IconShipping } from "@/components/icons/icons";

interface ProductTrustBarProps {
  items: TrustItem[];
}

const iconMap = {
  shield: IconShield,
  return: IconReturn,
  shipping: IconShipping,
};

export default function ProductTrustBar({ items }: ProductTrustBarProps) {
  return (
    <section className="prd-trust-bar">
      {items.map((item) => {
        const Icon = iconMap[item.icon];
        return (
          <div key={item.title} className="prd-card prd-trust-card">
            <div className="prd-trust-icon">
              <Icon />
            </div>
            <div>
              <div className="prd-trust-title">{item.title}</div>
              <div className="prd-trust-text">{item.text}</div>
              <a className="prd-trust-link" href={item.href ?? '#'}>
                {item.linkLabel}
              </a>
            </div>
          </div>
        );
      })}
    </section>
  );
}
