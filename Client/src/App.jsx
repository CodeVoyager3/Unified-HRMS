import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/CommissionerDashboard'
import DeputyCommissionerDashboard from './pages/DeputyCommissionerDashboard'
import Opportunities from './pages/Opportunities'
import AboutUs from './pages/AboutUs'
import ProtectedRoute from './components/ProtectedRoute'
import Notices from './pages/Notices'
import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployeeVerification from './pages/EmployeeVerification'
import SanitaryInspectorDashboard from './pages/SanitaryInspectorDashboard'
import RecruitmentPage from './pages/RecruitmentPage'
import AuthorityDashboard from './pages/AuthorityDashboard'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/authority-review" element={<AuthorityDashboard />} />
          <Route path="/recruitment" element={<ProtectedRoute> <RecruitmentPage /> </ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />
          <Route path="/deputy-commissioner" element={<ProtectedRoute> <DeputyCommissionerDashboard /> </ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute> <Opportunities /> </ProtectedRoute>} />
          <Route path="/employee" element={<ProtectedRoute> <EmployeeDashboard /> </ProtectedRoute>} />
          <Route path="/verify-employee" element={<ProtectedRoute> <EmployeeVerification /> </ProtectedRoute>} />
          <Route path="/sanitary-inspector" element={<ProtectedRoute> <SanitaryInspectorDashboard /> </ProtectedRoute>} />
          <Route path="/notices" element={<Notices />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
