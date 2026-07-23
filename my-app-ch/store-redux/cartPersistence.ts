/**
 * Cart persistence — localStorage only, SSR-safe.
 *
 * Security notes:
 * - Only cart item data is stored (no tokens, no PII).
 * - Input from localStorage is validated before loading into Redux
 *   to guard against tampered or malformed JSON.
 * - Writes are throttled via a debounce so rapid qty changes
 *   don't hammer localStorage on every keypress.
 */

import { CartItem } from '@/interfaces/cart/types';

const STORAGE_KEY = 'cart_v1';
const WRITE_DELAY_MS = 300;

// ── Validator ────────────────────────────────────────────────────────────────
// Reject anything that doesn't match the CartItem shape.
// Prevents a tampered localStorage value from poisoning Redux state.
function isValidCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== 'object') return false;
  const i = item as Record<string, unknown>;
  return (
    typeof i.id === 'number' &&
    typeof i.title === 'string' && i.title.length > 0 && i.title.length < 500 &&
    typeof i.unitPrice === 'number' && i.unitPrice >= 0 &&
    typeof i.quantity === 'number' && i.quantity >= 1 && i.quantity <= 9999 &&
    Array.isArray(i.tags)
  );
}

// ── Load ─────────────────────────────────────────────────────────────────────
export function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filter out any items that fail validation instead of rejecting the whole cart
    return parsed.filter(isValidCartItem);
  } catch {
    // Corrupted JSON — wipe and start fresh
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

// ── Save (debounced) ─────────────────────────────────────────────────────────
let writeTimer: ReturnType<typeof setTimeout> | null = null;

export function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  if (writeTimer) clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or blocked — fail silently, cart still works in memory
    }
  }, WRITE_DELAY_MS);
}

// ── Clear ────────────────────────────────────────────────────────────────────
export function clearCartFromStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
