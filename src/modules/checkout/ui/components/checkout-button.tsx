import { Button } from '@/components/ui/button'
import { useCart } from '../../hooks/use-cart'
import { cn, generateTenantURL } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingCartIcon } from 'lucide-react'

interface Props {
  className?: string
  hideIfEmpty?: boolean
  tenantSlug: string
}

export default function CheckoutButton({
  className,
  hideIfEmpty,
  tenantSlug,
}: Props) {
  const { totalItems } = useCart(tenantSlug)

  if (hideIfEmpty && totalItems === 0) return null

  return (
    <Button
      variant={'elevated'}
      className={cn('bg-white', className)}
      asChild
    >
      <Link href={`${generateTenantURL(tenantSlug)}/checkout`}>
        <ShoppingCartIcon /> {totalItems > 0 ? totalItems : ''}
      </Link>
    </Button>
  )
}
