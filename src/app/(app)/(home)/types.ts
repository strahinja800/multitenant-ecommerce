import { Category } from '@/payload-types'

export type CategoriesGetManyOutput = Category & {
  subcategories?: Category[]
}
