import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { headers as getHeaders } from 'next/headers'
import { loginSchema, registerSchema } from '../schemas'
import { generateAuthCookie } from '../utils'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.payload.auth({ headers })

    return session
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const user = await ctx.payload.create({
          collection: 'users',
          data: {
            email: input.email,
            password: input.password,
            username: input.username,
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
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            error instanceof Error ? error.message : 'Registration failed',
        })
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
