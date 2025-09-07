// cart.store.ts
import { computed } from '@angular/core';
import { withLocalStorage } from '@mixcore/signal';
import {
  getState,
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';

export interface CartItem {
  id: string;
  title: string;
  productId: number;
  thumbnail: string;
  price: number;
  quantity: number;
  systemNote?: string;
  customerNote?: string;
}

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState({
    items: <CartItem[]>[],
  }),
  withComputed((state) => ({
    count: computed(() => state.items().length),
    totalItems: computed(() =>
      state.items().reduce((sum, item) => sum + item.quantity, 0),
    ),
    totalPrice: computed(() =>
      state.items().reduce((sum, item) => sum + item.quantity * item.price, 0),
    ),
  })),
  withMethods((store) => ({
    addItem: (item: CartItem) => {
      const existing = getState(store).items.find(
        (i) =>
          i.productId === item.productId && i.systemNote === item.systemNote,
      );

      if (existing) {
        patchState(store, (s) => ({
          items: s.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        }));
      } else {
        patchState(store, (s) => ({
          items: [...s.items, item],
        }));
      }
    },
    removeItem: (id: string) => {
      patchState(store, (s) => ({
        items: s.items.filter((i) => i.id !== id),
      }));
    },
    updateQuantity: (id: string, quantity: number) => {
      patchState(store, (s) => ({
        items: s.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
      }));
    },
    clearCart: () => {
      patchState(store, () => ({
        items: [],
      }));
    },
  })),
  withLocalStorage('cart'),
);
