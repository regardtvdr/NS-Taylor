import { ReactNode } from 'react'
import StaffNav from './StaffNav'

interface StaffLayoutProps {
  children: ReactNode
}

const StaffLayout = ({ children }: StaffLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StaffNav />
      <div className="pb-16 md:pb-0">
        {children}
      </div>
    </div>
  )
}

export default StaffLayout

