'use client';

import { useAuth } from '@/context/AuthContext';
import { useWishlistIds } from '@/hooks/useWishlist';
import { useRouter } from 'next/navigation';

interface FavoriteButtonProps {
  productId: number;
  className?: string; // pass 'wl-card__heart-btn' on the wishlist page, your product-card's own class elsewhere
}

export default function FavoriteButton({ productId, className }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const { isFavorited, toggle, isToggling } = useWishlistIds();
  const router = useRouter();
  const favorited = isFavorited(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault(); // stop the click bubbling into a wrapping <Link> to the product page
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    toggle(productId);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={isToggling}
      aria-pressed={favorited}
      aria-label={favorited ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      <i className={`bi ${favorited ? 'bi-heart-fill' : 'bi-heart'}`} />
    </button>
  );
}
