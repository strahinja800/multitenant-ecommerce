import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CategoriesGetManyOutput } from '../../../../types'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTRPC } from '@/trpc/client'
import { useQuery } from '@tanstack/react-query'

interface Props {
  open: boolean
  onOpenChange?: (open: boolean) => void
}

export default function CategoriesSidebar({ open, onOpenChange }: Props) {
  const trpc = useTRPC()
  const { data } = useQuery(trpc.categories.getMany.queryOptions())

  const [parentCategory, setParentCategory] =
    useState<CategoriesGetManyOutput | null>(null)
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriesGetManyOutput | null>(null)

  // if parent categories exist, show them

  const currentCategories = parentCategory
    ? (parentCategory.subcategories ?? [])
    : (data ?? [])

  const router = useRouter()

  function handleOpenChange(open: boolean) {
    setSelectedCategory(null)
    setParentCategory(null)
    onOpenChange?.(open)
  }

  function handleCategoryClick(category: CategoriesGetManyOutput) {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategory(category)
      setSelectedCategory(category)
    } else {
      // category
      if (parentCategory && selectedCategory) {
        // subcategory -- category/subcategory
        router.push(`/${selectedCategory.slug}/${category.slug}`)
      } else {
        // main category
        if (category.slug === 'all') {
          router.push(`/`)
        } else {
          router.push(`/${category.slug}`)
        }
      }

      handleOpenChange(false)
    }
  }

  function handleBackClick() {
    if (parentCategory) {
      setParentCategory(null)
      setSelectedCategory(null)
    }
  }

  const backgroundColor = selectedCategory?.color || 'white'

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}
    >
      <SheetContent
        side='left'
        style={{ backgroundColor }}
        className='p-0 transition-none'
      >
        <SheetHeader className='p-4 border-b'>
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className='flex flex-col overflow-y-auto hfull pb-2'>
          {parentCategory && (
            <button
              onClick={handleBackClick}
              className='w-full text-left hover:bg-black hover:text-white flex items-center text-base font-medium p-4 cursor-pointer'
            >
              <ChevronLeftIcon className='size-4 mr-2' /> Back
            </button>
          )}
          {currentCategories.map(category => (
            <button
              key={category.id}
              onClick={() =>
                handleCategoryClick(category as CategoriesGetManyOutput)
              }
              className='w-full text-left hover:bg-black hover:text-white flex justify-between items-center text-base font-medium p-4 cursor-pointer'
            >
              {category.name}
              {parentCategory?.subcategories &&
                parentCategory.subcategories.length > 0 && (
                  <ChevronRightIcon className='size-4 ml-2' />
                )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
