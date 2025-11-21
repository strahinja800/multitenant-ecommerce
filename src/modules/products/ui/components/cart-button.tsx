import { Button } from '@/components/ui/button'
import { useCart } from '@/modules/checkout/hooks/use-cart'

interface Props {
  tenantSlug: string
  productId: string
}

export default function CartButton({ tenantSlug, productId }: Props) {
  const cart = useCart(tenantSlug)

  return (
    <Button
      variant={'elevated'}
      className='flex-1 bg-pink-400'
      onClick={() => cart.toggleProductInCart(productId)}
    >
      {cart.isProductInCart(productId) ? 'Remove from Cart' : 'Add to Cart'}
    </Button>
  )
}
