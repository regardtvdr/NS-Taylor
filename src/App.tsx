import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import StaffLayout from './components/staff/StaffLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Booking from './pages/Booking'
import BookingConfirmation from './pages/BookingConfirmation'
import CancellationPortal from './pages/CancellationPortal'
import About from './pages/About'
import Contact from './pages/Contact'
import Location from './pages/Location'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Team from './pages/Team'
import Login from './pages/staff/Login'
import StaffDashboard from './pages/staff/StaffDashboard'
import Today from './pages/staff/Today'
import Bookings from './pages/staff/Bookings'
import Patients from './pages/staff/Patients'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Staff Login */}
        <Route
          path="/staff/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        {/* Staff Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <StaffLayout>
                <Outlet />
              </StaffLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/staff" element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/today" element={<Today />} />
          <Route path="/staff/bookings" element={<Bookings />} />
          <Route path="/staff/patients" element={<Patients />} />
        </Route>

        {/* Public Routes */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/confirm" element={<BookingConfirmation />} />
          <Route path="/booking/:token" element={<CancellationPortal />} />
          <Route path="/about" element={<About />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/location" element={<Location />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/dashboard" element={<Navigate to="/staff/login" replace />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default App

