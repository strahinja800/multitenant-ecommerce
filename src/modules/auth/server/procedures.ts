import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { headers as getHeaders } from 'next/headers'
import { loginSchema, registerSchema } from '../schemas'
import { generateAuthCookie } from '../utils'
import { stripe } from '@/lib/stripe'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.payload.auth({ headers })

    return session
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      const existingData = await ctx.payload.find({
        collection: 'users',
        limit: 1,
        where: {
          username: { equals: input.username },
        },
      })

      const existingUser = existingData.docs[0]

      if (existingUser) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Username already taken',
        })
      }

      const account = await stripe.accounts.create({
        type: 'express',
        country: 'US',
        email: input.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      })

      if (!account) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Failed to create stripe account',
        })
      }

      const tenant = ctx.payload.create({
        collection: 'tenants',
        data: {
          name: input.username,
          slug: input.username,
          stripeAccountId: account.id,
        },
      })

      const user = await ctx.payload.create({
        collection: 'users',
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
          tenants: [{ tenant: (await tenant).id }],
        },
      })

      // Auto-login after registration
      const loginData = await ctx.payload.login({
        collection: 'users',
        data: {
          email: input.email,
          password: input.password,
        },
      })

      if (!loginData.token) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate auth token',
        })
      }

      await generateAuthCookie({
        prefix: ctx.payload.config.cookiePrefix,
        value: loginData.token,
      })

      return {
        success: true,
        user,
        token: loginData.token,
        message: 'Registration successful',
      }
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ input, ctx }) => {
    const data = await ctx.payload.login({
      collection: 'users',
      data: {
        email: input.email,
        password: input.password, // Hashed by payload
      },
    })

    if (!data.token) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid email or password',
      })
    }

    await generateAuthCookie({
      prefix: ctx.payload.config.cookiePrefix,
      value: data.token,
    })

    return data
  }),
})
