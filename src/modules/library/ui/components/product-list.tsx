'use client'

import { useTRPC } from '@/trpc/client'
import { useSuspenseInfiniteQuery } from '@tanstack/react-query'
import { DEFAULT_LIMIT } from '@/modules/home/constants'
import { Button } from '@/components/ui/button'
import { InboxIcon } from 'lucide-react'
import ProductCard, { ProductCardLoading } from './product-card'

export default function ProductList() {
  const trpc = useTRPC()
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useSuspenseInfiniteQuery(
      trpc.library.getMany.infiniteQueryOptions(
        {
          limit: DEFAULT_LIMIT,
        },
        {
          getNextPageParam: lastPage => {
            return lastPage.docs.length === DEFAULT_LIMIT
              ? lastPage.nextPage
              : undefined
          },
        }
      )
    )

  if (data.pages?.[0]?.docs.length === 0) {
    return (
      <div className='border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg'>
        <InboxIcon />
        <p className='text-base font-medium'>No products found.</p>
      </div>
    )
  }

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
        {data.pages
          .flatMap(page => page.docs)
          .map(product => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug}
              reviewRating={4} // Hardcoded for now
              reviewCount={9} // Hardcoded for now
              tenantImageUrl={product.tenant?.image?.url}
            />
          ))}
      </div>
      <div className='flex justify-center p-8'>
        {hasNextPage && (
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant={'elevated'}
            className='font-medium disabled:opacity-50 text-base bg-white'
          >
            Load more
          </Button>
        )}
      </div>
    </>
  )
}

export function ProductListLoading() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4'>
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardLoading key={index} />
      ))}
    </div>
  )
}
