'use client'

import z from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../schemas'
import {
  Form,
  FormControl,
  FormDescription,
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
import { useTRPC } from '@/trpc/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['700'],
})

export default function SignUpView() {
  const router = useRouter()
  const trpc = useTRPC()

  const register = useMutation({
    ...trpc.auth.register.mutationOptions(),
    onSuccess: () => {
      toast.success('Account created!')
      setTimeout(() => {
        router.push('/')
      }, 1500)
    },
    onError: error => {
      toast.error(`${error.message}`)
    },
  })

  const form = useForm<z.infer<typeof registerSchema>>({
    mode: 'all',
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  })

  function onSubmit(values: z.infer<typeof registerSchema>) {
    register.mutate(values)
  }

  const username = useWatch({
    control: form.control,
    name: 'username',
  })

  const usernameErrors = form.formState.errors.username
  const showPreview = username && !usernameErrors

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
                  href={'/sign-in'}
                >
                  Sign in
                </Link>
              </Button>
            </div>
            <h1 className='text-4xl font-medium'>
              Join 1,690+ creators earning money on Funroad
            </h1>
            <FormField
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription
                    className={cn('hidden', showPreview && 'block')}
                  >
                    Your store will be available at&nbsp;
                    <strong>{username}</strong>.shop.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              disabled={register.isPending}
              className='bg-black text-white hover:bg-pink-400 hover:text-primary'
            >
              Create account
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
