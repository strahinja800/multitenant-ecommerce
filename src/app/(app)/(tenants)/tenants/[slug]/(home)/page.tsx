import { loadProductFilters } from '@/modules/products/search-params'
import { SearchParams } from 'nuqs/server'
import { getQueryClient, trpc } from '@/trpc/server'
import { DEFAULT_LIMIT } from '@/modules/home/constants'
import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import ProductListView from '@/modules/products/ui/views/product-list-view'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<SearchParams>
}

export default async function TenantPage({ params, searchParams }: Props) {
  const { slug } = await params
  const filters = await loadProductFilters(searchParams)

  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.products.getMany.infiniteQueryOptions({
      ...filters,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} />
    </HydrationBoundary>
  )
}
