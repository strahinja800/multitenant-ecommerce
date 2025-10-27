'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Category } from '@/payload-types'
import { useRef, useState } from 'react'
import useDropdownPosition from './use-dropdown-position'
import SubcategoryMenu from './subcategory-menu'

interface Props {
  category: Category
  isActive?: boolean
  isNavigationHovered?: boolean
}

/**
 * Render a category button with an optional hover-activated subcategory dropdown.
 *
 * Renders a rounded Button labeled with the category name, toggles a decorative cue and a positioned SubcategoryMenu when the category has subcategories and the user hovers the item.
 *
 * @param category - Category data, including an optional `subcategories` array used to populate the dropdown
 * @param isActive - When true, apply active styling to the button
 * @param isNavigationHovered - When true, suppress the component's active styling override
 * @returns A React element containing the category button and, if present, a positioned subcategory menu controlled by hover state
 */
export default function CategoryDropdown({
  category,
  isActive,
  isNavigationHovered,
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { getDropdownPosition } = useDropdownPosition(dropdownRef)

  function onMouseEnter() {
    if (category.subcategories) {
      setIsOpen(true)
    }
  }

  function onMouseLeave() {
    setIsOpen(false)
  }

  const dropdownPosition = getDropdownPosition()

  return (
    <div
      className='relative'
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className='relative'>
        <Button
          variant={'elevated'}
          className={cn(
            'h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black',
            isActive && !isNavigationHovered && 'bg-white border-primary'
          )}
        >
          {category.name}
        </Button>
        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              'opacity-0 absolute -bottom-3 w-0 h-0 border-l-10 border-r-10 border-b-10 border-l-transparent border-r-transparent border-b-black left-1/2 -translate-x-1/2',
              isOpen && 'opacity-100'
            )}
          />
        )}
      </div>
      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  )
}