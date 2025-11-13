import { Category } from '@/payload-types'
import Link from 'next/link'
import { CategoriesGetManyOutput } from '../../../../types'

interface Props {
  category: CategoriesGetManyOutput
  isOpen: boolean
}

export default function SubcategoryMenu({ category, isOpen }: Props) {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null // Do not render if not open or no subcategories
  }

  const backgroundColor = category.color || '#f5f5f5'

  return (
    <div
      className='absolute z-1000'
      style={{ top: '100%', left: 0 }}
    >
      {/* Bridge to maintain hover */}
      <div className='h-3 w-60' />
      <div
        className='w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5'
        style={{ backgroundColor }} // the color we set for the category
      >
        <div>
          {category.subcategories.map((subcategory: Category) => (
            <Link
              className='w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium'
              href={`/${category.slug}/${subcategory.slug}`}
              key={subcategory.id}
            >
              {subcategory.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
