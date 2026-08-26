import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  /**
   * Klucz pozycji w koszyku. Dla części to id produktu, ale kontrakt serwisowy
   * kupuje się na konkretne urządzenie, więc dwie sztuki tego samego produktu
   * z różnymi numerami seryjnymi muszą być osobnymi wierszami — stąd sufiks
   * z numerem seryjnym. Prawdziwe id produktu trzymamy w `productId`.
   */
  id: string
  productId?: string
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
  /** Usługa — nie ma czego wysyłać, więc nie naliczamy dostawy */
  is_service?: boolean
  /** Urządzenie objęte kontraktem */
  serial_number?: string
  contract_device_model?: string
  /** Blokuje stepper ilości — kontrakt jest zawsze na jedno urządzenie */
  fixed_quantity?: boolean
  /** Numer katalogowy wybranego wariantu urządzenia */
  variant_pn?: string
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

          // Kontrakt jest przypisany do jednego numeru seryjnego — ponowne dodanie
          // tego samego urządzenia nie ma zwiększać ilości, tylko nic nie zmieniać
          if (existingItem && item.fixed_quantity) {
            return state
          }

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
            item.id === id && !item.fixed_quantity
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