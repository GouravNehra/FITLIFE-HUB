const PRODUCTS_CACHE_KEY = "fitlife-products-cache";

export function loadCachedProducts() {
  try {
    const cached = JSON.parse(localStorage.getItem(PRODUCTS_CACHE_KEY) || "[]");
    return Array.isArray(cached) ? cached : [];
  } catch {
    return [];
  }
}

export function saveCachedProducts(products) {
  if (!Array.isArray(products) || !products.length) return;
  try {
    localStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify(products));
  } catch {
    // Product caching is optional; the API response remains the source of truth.
  }
}