import { Suspense } from 'react'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import ProductList, {
  ProductListLoading,
} from '@/modules/products/ui/components/product-list'

interface Props {
  params: Promise<{
    subcategory: string
  }>
}

export default async function CategoriesPage({ params }: Props) {
  const { subcategory } = await params

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ categorySlug: subcategory })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductListLoading />}>
        <ProductList category={subcategory} />
      </Suspense>
    </HydrationBoundary>
  )
}
