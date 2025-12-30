import { useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <h1 className="text-3xl text-gray-300 font-bold">Main Content Placeholder</h1>
      </div>
      <Footer />
    </>
  )
}

export default App
