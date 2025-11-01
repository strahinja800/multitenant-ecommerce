'use client'

import CategoryDropdown from './category-dropdown'
import { CategoriesGetManyOutput } from '../types'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ListFilterIcon } from 'lucide-react'
import CategoriesSidebar from './categories-sidebar'

interface Props {
  data: CategoriesGetManyOutput[]
}

export default function Categories({ data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const viewAllRef = useRef<HTMLDivElement>(null)

  const [visibleCount, setVisibleCount] = useState(data.length)
  const [isAnyHovered, setIsAnyHovered] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const activeCategory = 'all'

  const activeCategoryIndex = data.findIndex(cat => cat.slug === activeCategory)
  const isActiveCategoryHidden =
    activeCategoryIndex >= visibleCount && activeCategoryIndex !== -1 // -1 means no part of an array

  useEffect(() => {
    function calculateVisibleCategories() {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return

      const containerW = containerRef.current.offsetWidth
      const viewAllW = viewAllRef.current.offsetWidth
      const availableW = containerW - viewAllW

      const items = Array.from(measureRef.current.children)
      let totalW = 0
      let visible = 0

      for (const item of items) {
        const width = item.getBoundingClientRect().width

        if (totalW + width > availableW) break
        totalW += width
        visible++
      }

      setVisibleCount(visible)
    }

    calculateVisibleCategories()

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleCategories()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [data.length])

  return (
    <div className='relative w-full'>
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      {/* Hidden div to measure all items */}
      <div
        ref={measureRef}
        className='absolute opacity-0 pointer-events-none flex'
        style={{ position: 'fixed', top: -9999, left: -9999 }}
      >
        {data.map((category: CategoriesGetManyOutput) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={activeCategory === category.slug}
              isNavigationHovered={true}
            />
          </div>
        ))}
      </div>

      {/* Visible items */}
      <div
        ref={containerRef}
        className='flex flex-nowrap items-center'
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {data
          .slice(0, visibleCount)
          .map((category: CategoriesGetManyOutput) => (
            <div key={category.id}>
              <CategoryDropdown
                category={category}
                isActive={activeCategory === category.slug}
                isNavigationHovered={isAnyHovered}
              />
            </div>
          ))}
        <div
          className='shrink-0'
          ref={viewAllRef}
        >
          <Button
            className={cn(
              'h-11 px-4 bg-transparent rounded-full hover:bg-white hover:border-primary text-black ',
              !isActiveCategoryHidden &&
                !isAnyHovered &&
                'bg-white border-primary'
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className='ml-2' />
          </Button>
        </div>
      </div>
    </div>
  )
}
