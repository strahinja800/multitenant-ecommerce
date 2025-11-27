import { DEFAULT_LIMIT } from '@/modules/home/constants'
import LibraryView from '@/modules/library/ui/views/library-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

export default async function LibraryPage() {
  const queryClient = getQueryClient()
  void queryClient.prefetchInfiniteQuery(
    trpc.library.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    })
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LibraryView />
    </HydrationBoundary>
  )
}
