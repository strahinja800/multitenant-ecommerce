import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { TRPCReactProvider } from '@/trpc/client'
import { Toaster } from 'sonner'

const dmsans = DM_Sans({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Multi-Vendor E-Commerce Platform',
  description: 'A platform for multiple vendors to sell their products',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={dmsans.className}>
        <TRPCReactProvider>
          {children}
          <Toaster />
        </TRPCReactProvider>
      </body>
    </html>
  )
}
