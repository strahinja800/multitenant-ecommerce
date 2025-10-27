import { getPayload } from 'payload'
import { Category } from '@/payload-types'
import configPromise from '@payload-config'

import Footer from './footer'
import Navbar from './navbar'
import { SearchFilters } from './search-filters'

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout({ children }: LayoutProps) {
  const payload = await getPayload({
    config: configPromise,
  })

  const data = await payload.find({
    collection: 'categories',
    pagination: false,
    depth: 1, // subcategories.[0] will be type of Category
    where: {
      parent: {
        exists: false,
      },
    },
  })

  const formatteData = data.docs.map(doc => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map(doc => ({
      // Because of 'depth: 1' we know doc will be type of Category
      ...(doc as Category),
      subcategories: undefined,
    })),
  }))

  console.log({ formatteData })

  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <SearchFilters data={formatteData} />
      <div className='flex-1 bg-[#f4f4f0]'>{children}</div>
      <Footer />
    </div>
  )
}
