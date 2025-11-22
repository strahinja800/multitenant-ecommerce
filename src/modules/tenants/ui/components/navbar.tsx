'use client'

import { Button } from '@/components/ui/button'
import { generateTenantURL } from '@/lib/utils'
// import CheckoutButton from '@/modules/checkout/ui/components/checkout-button'
import { useTRPC } from '@/trpc/client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ShoppingCartIcon } from 'lucide-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'

const CheckoutButton = dynamic(
  () => import('@/modules/checkout/ui/components/checkout-button'),
  {
    ssr: false,
    loading: () => (
      <Button
        variant={'elevated'}
        className='bg-white'
        disabled
      >
        <ShoppingCartIcon />
      </Button>
    ),
  }
)

interface Props {
  slug: string
}

export default function Navbar({ slug }: Props) {
  const trpc = useTRPC()
  const { data } = useSuspenseQuery(trpc.tenants.getOne.queryOptions({ slug }))

  return (
    <nav className='h-20 border-b font-medium bg-white'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12'>
        <Link
          href={generateTenantURL(slug)}
          className='flex items-center gap-2'
        >
          {data.image?.url && (
            <Image
              src={data.image.url}
              alt={slug}
              width={32}
              height={32}
              className='rounded-full border shrink-0 size-8'
            />
          )}
          <p className='text-xl'>{data.name}</p>
        </Link>
        <CheckoutButton tenantSlug={slug} />
      </div>
    </nav>
  )
}

export function NavbarLoading() {
  return (
    <nav className='h-20 border-b font-medium bg-white'>
      <div className='max-w-(--breakpoint-xl) mx-auto flex justify-between items-center h-full px-4 lg:px-12'>
        <div />
        <Button
          variant={'elevated'}
          className='bg-white'
          disabled
        >
          <ShoppingCartIcon />
        </Button>
      </div>
    </nav>
  )
}
