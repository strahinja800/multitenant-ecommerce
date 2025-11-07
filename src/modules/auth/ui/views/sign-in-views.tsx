'use client'

import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../../schemas'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useTRPC } from '@/trpc/client'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
})

export default function SignInView() {
  const router = useRouter()
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const login = useMutation({
    ...trpc.auth.login.mutationOptions(),

    onSuccess: async () => {
      toast.success('Logged in successfully!')

      await queryClient.invalidateQueries(trpc.auth.session.queryOptions())
      setTimeout(() => {
        router.push('/')
      }, 1000)
    },

    onError: error => {
      toast.error(`${error.message}`)
    },
  })

  const form = useForm<z.infer<typeof loginSchema>>({
    mode: 'all',
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login.mutate(values)
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-5'>
      <div className='bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-8 p-4 lg:p-16'
          >
            <div className='flex items-center justify-between mb-8'>
              <Link href={'/'}>
                <span
                  className={cn('text-2xl font-semibold', poppins.className)}
                >
                  funroad
                </span>
              </Link>
              <Button
                asChild
                variant={'ghost'}
                size={'sm'}
                className='text-base border-none underline'
              >
                <Link
                  prefetch
                  href={'/sign-up'}
                >
                  Sign up
                </Link>
              </Button>
            </div>
            <h1 className='text-4xl font-medium'>Welcome back to Funroad</h1>

            <FormField
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              size={'lg'}
              variant={'elevated'}
              disabled={login.isPending}
              className='bg-black text-white hover:bg-pink-400 hover:text-primary'
            >
              Log in
            </Button>
          </form>
        </Form>
      </div>
      <div
        className='h-screen w-full lg:col-span-2 hidden lg:block'
        style={{
          backgroundImage: "url('/funroad-auth-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </div>
  )
}
