import { useCardStore } from '../store/use-card-store'

export function useCart(tenantSlug: string) {
  const { addProduct, removeProduct, clearCart, clearAllCarts, tenantCarts } =
    useCardStore()

  const productIds = tenantCarts[tenantSlug]?.productIds || []

  const toggleProductInCart = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId)
    } else {
      addProduct(tenantSlug, productId)
    }
  }

  const isProductInCart = (productId: string) => productIds.includes(productId)

  const clearTenantCart = () => clearCart(tenantSlug)

  return {
    productIds,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart,
    clearAllCarts,
    toggleProductInCart,
    isProductInCart,
    clearTenantCart,
    totalItems: productIds.length,
  }
}
