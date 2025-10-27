import { Input } from '@/components/ui/input'
import { SearchIcon } from 'lucide-react'

interface Props {
  disabled?: boolean
}

export default function SearchInput({ disabled }: Props) {
  return (
    <div className='flex items-center gap-2 w-full'>
      <div className='relative w-full'>
        <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500' />
        <Input
          className='pl-8'
          placeholder='Search poducts'
          disabled={disabled}
        />
      </div>
      {/* TODO: Add categories view all -- only for mobile */}
      {/* TODO: Add library button -- only when logged in */}
    </div>
  )
}
