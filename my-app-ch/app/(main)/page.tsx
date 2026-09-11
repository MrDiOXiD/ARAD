import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import HeroBanner from '@/components/HeroBanner';
import HomeProductSections from '@/components/product/HomeProductSections';
import { getProducts } from '@/lib/product/products.api';


// Server Component — no "use client", no useEffect/useState loading
// dance. Data is fetched and rendered into the initial HTML, so
// crawlers/SEO see real product titles/prices immediately instead of
// an empty shell that only fills in after client JS runs. This also
// kills the original bug outright: isLoading was set to true and
// never set back to false, so the skeleton never went away.
export default async function HomePage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({ queryKey: ['products', 'latest'], queryFn: () => getProducts(1, 8) }),
    queryClient.prefetchQuery({ queryKey: ['products', 'featured'], queryFn: () => getProducts(2, 12) }),
  ]);

  return (
    <main>
      <HeroBanner />
      {/* HydrationBoundary hands the server-fetched data to the client
          query cache — useQuery on the client sees it instantly, no
          refetch/flicker, but can still refetch later (pagination,
          "load more", etc.) using normal React Query behavior. */}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomeProductSections />
      </HydrationBoundary>
    </main>
  );
}
