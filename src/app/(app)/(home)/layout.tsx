import Footer from './footer'
import Navbar from './navbar'

interface LayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: LayoutProps) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <div className='flex-1 bg-[#f4f4f0]'>{children}</div>
      <Footer />
    </div>
  )
}
