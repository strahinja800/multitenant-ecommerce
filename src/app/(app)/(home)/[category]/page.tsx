import { SearchParams } from 'nuqs/server'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { loadProductFilters } from '@/modules/products/search-parms'
import ProductListView from '@/modules/products/ui/views/product-list-view'

interface Props {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<SearchParams>
}

export default async function CategoriesPage({ params, searchParams }: Props) {
  const { category } = await params
  const filters = await loadProductFilters(searchParams)

  console.log(JSON.stringify(filters), 'THIS IS FROM RCS')

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(
    trpc.products.getMany.queryOptions({ categorySlug: category, ...filters })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={category} />
    </HydrationBoundary>
  )
}
