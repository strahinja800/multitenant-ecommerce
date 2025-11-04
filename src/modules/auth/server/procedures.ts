import { baseProcedure, createTRPCRouter } from '@/trpc/init'
import { TRPCError } from '@trpc/server'
import { cookies as getCookies, headers as getHeaders } from 'next/headers'
import { AUTH_COOKIE } from '../constants'
import { loginSchema, registerSchema } from '../schemas'

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders()

    const session = await ctx.payload.auth({ headers })

    return session
  }),

  logout: baseProcedure.mutation(async () => {
    const cookies = await getCookies()
    cookies.delete(AUTH_COOKIE)
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

        // Set the auth cookie
        const cookies = await getCookies()
        cookies.set({
          name: AUTH_COOKIE,
          value: loginData.token,
          httpOnly: true,
          path: '/',
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

    const cookies = await getCookies()

    cookies.set({
      name: AUTH_COOKIE,
      value: data.token,
      httpOnly: true,
      path: '/',
      // TODO: ensure cross-domain cookie sharing
    })

    return data
  }),
})
