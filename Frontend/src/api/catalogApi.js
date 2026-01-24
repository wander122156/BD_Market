import { API_BASE } from './config.js';

/**
 * GET /api/catalog-items — каталог товаров с пагинацией
 * @param {Object} params - pageSize, pageIndex, catalogBrandId?, catalogTypeId?
 */
export async function fetchCatalogItems(params = {}) {
  const { pageSize = 500, pageIndex = 0, catalogBrandId, catalogTypeId } = params;
  const search = new URLSearchParams({
    pageSize: String(pageSize),
    pageIndex: String(pageIndex),
    ...(catalogBrandId != null && { catalogBrandId: String(catalogBrandId) }),
    ...(catalogTypeId != null && { catalogTypeId: String(catalogTypeId) }),
  });
  const res = await fetch(`${API_BASE}/api/catalog-items?${search}`);
  if (!res.ok) throw new Error(`Catalog: ${res.status}`);
  return res.json();
}

/**
 * GET /api/catalog-types — типы/категории каталога
 */
export async function fetchCatalogTypes() {
  const res = await fetch(`${API_BASE}/api/catalog-types`);
  if (!res.ok) throw new Error(`Catalog types: ${res.status}`);
  return res.json();
}
