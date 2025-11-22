import { ReactNode } from 'react'
import StaffNav from './StaffNav'

interface StaffLayoutProps {
  children: ReactNode
}

const StaffLayout = ({ children }: StaffLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StaffNav />
      {children}
    </div>
  )
}

export default StaffLayout

