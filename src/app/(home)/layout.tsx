import Navbar from './navbar'

interface LayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({ children }: LayoutProps) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      {children}
    </div>
  )
}
