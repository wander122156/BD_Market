import { API_BASE } from './config.js';

/**
 * GET /api/basket — получить корзину текущего пользователя
 * 404 = корзины нет (пустая)
 * @returns {{ basketId: number, buyerId: string, items: Array<{id: number, catalogItemId: number, unitPrice: number, quantity: number}>, total: number } | null}
 */
export async function fetchBasket() {
  const res = await fetch(`${API_BASE}/api/basket`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Basket: ${res.status}`);
  return res.json();
}

/**
 * POST /api/basket/items — добавить товар в корзину
 * @param {{ catalogItemId: number, price: number, quantity?: number }} body
 */
export async function addToBasket(body) {
  const res = await fetch(`${API_BASE}/api/basket/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      catalogItemId: body.catalogItemId,
      price: body.price,
      quantity: body.quantity ?? 1,
    }),
  });
  if (!res.ok) throw new Error(`Add to basket: ${res.status}`);
  return res.json();
}

// PUT /api/basket/items/quantities (SetQuantities) — когда реализуешь,
// добавь сюда функцию и подключи в CartContext в removeFromCart, updateQuantity, clearCart.
