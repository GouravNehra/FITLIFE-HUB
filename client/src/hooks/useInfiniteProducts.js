import { useInfiniteQuery } from '@tanstack/react-query';
import { loadCachedProducts, saveCachedProducts } from '../utils/productStorage';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

async function fetchProducts({ pageParam = 1, queryKey }) {
  const [_key, params] = queryKey;
  const url = new URL(`${API}/api/products`);
  url.searchParams.set('page', pageParam);
  url.searchParams.set('limit', params.limit || 24);
  if (params.category) url.searchParams.set('category', params.category);
  if (params.search) url.searchParams.set('search', params.search);
  if (params.sort) url.searchParams.set('sort', params.sort);
  try {
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const payload = await res.json();
    saveCachedProducts(payload.data);
    return payload;
  } catch (error) {
    const cachedProducts = loadCachedProducts();
    if (!cachedProducts.length) throw error;

    return {
      data: cachedProducts,
      meta: { page: 1, limit: cachedProducts.length, total: cachedProducts.length, totalPages: 1 },
    };
  }
}

export default function useInfiniteProducts(params = { limit: 24 }) {
  return useInfiniteQuery({
    queryKey: ['products', params],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => {
      if (!lastPage || !lastPage.meta) return undefined;
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    retry: 2,
    staleTime: 1000 * 60 * 2, // 2 minutes
    cacheTime: 1000 * 60 * 10,
  });
}
