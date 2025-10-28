import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CustomCategory } from '../types'
import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  open: boolean
  onOpenChange?: (open: boolean) => void
  data: CustomCategory[] // TODO: remove later
}

export default function CategoriesSidebar({ open, onOpenChange, data }: Props) {
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null)
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null)

  // if parent categories exist, show them

  const currentCategories = parentCategories ?? data ?? []

  const router = useRouter()

  function handleOpenChange(open: boolean) {
    setSelectedCategory(null)
    setParentCategories(null)
    onOpenChange?.(open)
  }

  function handleCategoryClick(category: CustomCategory) {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[])
      setSelectedCategory(category)
    } else {
      // category
      if (parentCategories && selectedCategory) {
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
    if (parentCategories) {
      setParentCategories(null)
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
          {parentCategories && (
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
              onClick={() => handleCategoryClick(category)}
              className='w-full text-left hover:bg-black hover:text-white flex justify-between items-center text-base font-medium p-4 cursor-pointer'
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className='size-4 ml-2' />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
