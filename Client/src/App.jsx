import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import Managerdashboard from './pages/Managerdashboard'
import Opportunities from './pages/Opportunities'
import AboutUs from './pages/AboutUs'
import ProtectedRoute from './components/ProtectedRoute'
import Notices from './pages/Notices'

import SyncUser from './components/SyncUser'

function App() {
  return (
    <>
      <BrowserRouter>
        <SyncUser />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute> <AdminDashboard /> </ProtectedRoute>} />
          <Route path="/manager" element={<ProtectedRoute> <Managerdashboard /> </ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute> <Opportunities /> </ProtectedRoute>} />
          <Route path="/notices" element={<ProtectedRoute> <Notices /> </ProtectedRoute>} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
