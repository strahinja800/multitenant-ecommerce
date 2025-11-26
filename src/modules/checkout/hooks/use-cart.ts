import { useCallback } from 'react'
import { useCardStore } from '../store/use-card-store'
import { useShallow } from 'zustand/react/shallow'

export function useCart(tenantSlug: string) {
  // const { addProduct, removeProduct, clearCart, clearAllCarts } = useCardStore()

  const clearAllCarts = useCardStore(state => state.clearAllCarts)
  const clearCart = useCardStore(state => state.clearCart)
  const addProduct = useCardStore(state => state.addProduct)
  const removeProduct = useCardStore(state => state.removeProduct)

  const productIds = useCardStore(
    useShallow(state => state.tenantCarts[tenantSlug]?.productIds || []) // shallow comparison to prevent unnecessary re-renders
  )

  const toggleProductInCart = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId)
      } else {
        addProduct(tenantSlug, productId)
      }
    },
    [addProduct, removeProduct, tenantSlug, productIds]
  )

  const isProductInCart = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds]
  )

  const clearTenantCart = () => clearCart(tenantSlug)

  const handleAddProduct = useCallback(
    (productId: string) => {
      addProduct(tenantSlug, productId)
    },
    [tenantSlug, addProduct]
  )

  const handleRemoveProduct = useCallback(
    (productId: string) => {
      removeProduct(tenantSlug, productId)
    },
    [tenantSlug, removeProduct]
  )

  return {
    productIds,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProductInCart,
    isProductInCart,
    clearTenantCart,
    totalItems: productIds.length,
  }
}
