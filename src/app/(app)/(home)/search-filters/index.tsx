import Categories from './categories'
import SearchInput from './search-input'

interface Props {
  data: any
}

/**
 * Render search controls and category filters for the provided data.
 *
 * @param data - Items or structure used to populate the category list
 * @returns The JSX element containing the search input and category list
 */
export function SearchFilters({ data }: Props) {
  return (
    <div className='px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full'>
      <SearchInput />
      <Categories data={data} />
    </div>
  )
}