import CategoryDropdown from './category-dropdown'
import { CustomCategory } from '../types'

interface Props {
  data: CustomCategory[]
}

export default function Categories({ data }: Props) {
  return (
    <div className='flex flex-nowrap items-center'>
      {data.map((category: CustomCategory) => (
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
