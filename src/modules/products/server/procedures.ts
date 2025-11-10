import { Category } from '@/payload-types'
import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import type { Where } from 'payload'
import z from 'zod'

export const productsRouter = createTRPCRouter({
  getMany: baseProcedure
    .input(
      z.object({
        categorySlug: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {}

      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        }
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        }
      } else if (input.maxPrice) {
        where.price = {
          ...where.price,
          less_than_equal: input.maxPrice,
        }
      }

      if (input.categorySlug) {
        const categoriesData = await ctx.payload.find({
          collection: 'categories',
          depth: 1,
          limit: 1,
          where: {
            slug: { equals: input.categorySlug },
          },
        })

        const formattedData = categoriesData.docs.map(doc => ({
          ...doc,
          subcategories: (doc.subcategories?.docs ?? []).map(doc => ({
            // Because of 'depth: 1' we know doc will be type of Category
            ...(doc as Category),
            subcategories: undefined,
          })),
        }))

        const subcategoriesSlugs = []
        const parentCategory = formattedData[0]

        if (parentCategory) {
          subcategoriesSlugs.push(
            ...parentCategory.subcategories?.map(
              subcategory => subcategory.slug
            )
          )

          where['category.slug'] = {
            in: [parentCategory.slug, ...subcategoriesSlugs],
          }
        }
      }

      const data = await ctx.payload.find({
        collection: 'products',
        depth: 1, // Populate image and category
        where,
      })

      return data
    }),
})
