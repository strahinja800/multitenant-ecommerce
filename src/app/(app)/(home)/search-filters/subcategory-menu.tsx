import { Category } from '@/payload-types'
import Link from 'next/link'

interface Props {
  category: Category
  isOpen: boolean
  position: {
    top: number
    left: number
  }
}

/**
 * Render a positioned dropdown menu of a category's subcategories when the menu is open and the category has subcategories.
 *
 * @param category - Category object containing `subcategories` and optional `color` used as the menu background
 * @param isOpen - Whether the submenu should be visible
 * @param position - Coordinates `{ top, left }` used to position the fixed menu
 * @returns A React element for the positioned subcategory menu, or `null` when the menu is not rendered
 */
export default function SubcategoryMenu({ category, isOpen, position }: Props) {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.length === 0
  ) {
    return null // Do not render if not open or no subcategories
  }

  const bgColor = category.color || '#f5f5f5'

  return (
    <div
      className='fixed z-1000'
      style={{ top: position.top, left: position.left }}
    >
      {/* Bridge to maintain hover */}
      <div className='h-3 w-60' />
      <div
        className='w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5'
        style={{ backgroundColor: bgColor }} // the color we set for the category
      >
        <div>
          {category.subcategories.map((subcategory: Category) => (
            <Link
              className='w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center underline font-medium'
              href={''}
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