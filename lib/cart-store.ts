import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  price_brutto: number
  quantity: number
  product_type: string
  stock: number
  image?: string
  device_model?: string | null
  resolution_dpi?: number | null
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getTotalPriceBrutto: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          
          if (existingItem) {
            // Zwiększ ilość jeśli produkt już w koszyku
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: Math.min(i.quantity + 1, item.stock) }
                  : i
              ),
            }
          } else {
            // Dodaj nowy produkt
            return {
              items: [...state.items, { ...item, quantity: 1 }],
            }
          }
        })
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity: Math.min(Math.max(1, quantity), item.stock) }
              : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },

      getTotalPriceBrutto: () => {
        return get().items.reduce((total, item) => total + item.price_brutto * item.quantity, 0)
      },
    }),
    {
      name: 'takma-cart-storage',
    }
  )
)