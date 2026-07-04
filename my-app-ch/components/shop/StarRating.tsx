interface StarRatingProps {
  rating: number;
  reviews: string;
}

export default function StarRating({ rating, reviews }: StarRatingProps) {
  return (
    <div className="shop-card-stars" aria-label={`امتیاز ${rating} از ۵`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <i key={i} className={`bi ${i < rating ? 'bi-star-fill' : 'bi-star'}`} />
      ))}
      <span>({reviews})</span>
    </div>
  );
}
