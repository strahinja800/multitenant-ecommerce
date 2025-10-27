import { Category } from '@/payload-types'
import CategoryDropdown from './category-dropdown'

interface Props {
  data: any
}

/**
 * Render a horizontal row of category dropdowns.
 *
 * Renders a single flex container and maps each item in `data` to a CategoryDropdown wrapped in a div.
 *
 * @param data - An array of Category objects to display; each item must include an `id` used as the element key.
 * @returns A JSX element containing the rendered category dropdowns
 */
export default function Categories({ data }: Props) {
  return (
    <div className='flex flex-nowrap items-center'>
      {data.map((category: Category) => (
        <div key={category.id}>
          <CategoryDropdown
            category={category}
            isActive={false}
            isNavigationHovered={true}
          />
        </div>
      ))}
    </div>
  )
}