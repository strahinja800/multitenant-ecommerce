import Footer from '@/modules/tenants/ui/components/footer'
import Navbar, { NavbarLoading } from '@/modules/tenants/ui/components/navbar'
import { getQueryClient, trpc } from '@/trpc/server'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import { Suspense } from 'react'

interface Props {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export default async function TenantLayout({ children, params }: Props) {
  const { slug } = await params

  const queryClient = getQueryClient()
  void queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }))

  return (
    <div className='min-h-screen flex flex-col bg-[#f4f4f0]'>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarLoading />}>
          <Navbar slug={slug} />
        </Suspense>
      </HydrationBoundary>
      <div className='flex-1'>
        <div className='max-w-(--breakpoint-2xl) mx-auto'>{children}</div>
      </div>
      <Footer />
    </div>
  )
}
