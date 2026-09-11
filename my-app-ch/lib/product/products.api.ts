export interface ProductApi {
  id: number;
  title: string;
  description: string;
  price: string;       // numeric column → string from pg, same as everywhere else
  stock: number;
  discount: string | null;
  discountStartDate: string | null;
  discountEndDate: string | null;
  isActive: boolean;
  brand: string | null;
  badge: string | null;
  productImage: string | null;
  categoryId: number;
}

export interface ProductsPage {
  items: ProductApi[];
  page: number;
  limit: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';
const MAX_LIMIT = 24; // never let a caller (even accidentally) request an unbounded page size

export async function getProducts(page = 1, limit = 10): Promise<ProductApi[]> {
  const safeLimit = Math.min(limit, MAX_LIMIT);
  const res = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${safeLimit}`, {
    // Public data, no auth needed — GET /products is @Public(). Cache
    // for 60s server-side (ISR-style) so repeated page loads don't
    // hammer the backend for the same catalog page.
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return res.json();
}
