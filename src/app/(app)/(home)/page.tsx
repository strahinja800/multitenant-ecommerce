import { SearchParams } from 'nuqs/server'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { loadProductFilters } from '@/modules/products/search-parms'
import ProductListView from '@/modules/products/ui/views/product-list-view'
import { DEFAULT_LIMIT } from '@/modules/home/constants'

interface Props {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<SearchParams>
}

export default async function CategoriesPage({ params, searchParams }: Props) {
  const { category } = await params
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      categorySlug: category,
      limit: DEFAULT_LIMIT,
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  )
}
