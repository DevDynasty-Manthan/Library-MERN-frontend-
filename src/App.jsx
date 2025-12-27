import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Routes, Route, } from 'react-router-dom'
import Navbar from './components/navigation/Navbar.jsx'
import HomePage from './pages/homepage/HomePage.jsx'
import SignupPage from './pages/auth/SignupPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import AdmissionStep from './pages/onboarding/AdmissionStep.jsx'
import PlanStep from './pages/onboarding/PlanStep.jsx'
import SeatStep from './pages/onboarding/SeatStep.jsx'
import PaymentStep from './pages/onboarding/PaymentStep.jsx'
import StudentDashboard from './pages/student/StudentDashboard.jsx'
import StudentProfile from './pages/student/StudentProfile.jsx'
import StudentPayments from './pages/student/StudentPayments.jsx'
import StudentLayout from './layouts/StudentLayout.jsx'
import './App.css'

function App() {
  

  return (
    <>
     <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/onboarding/admission' element={<AdmissionStep />} />
      <Route path='/onboarding/plan' element={<PlanStep />} />
      <Route path='/onboarding/seat' element={<SeatStep />} />
      <Route path='/onboarding/payment' element={<PaymentStep />} />
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path='profile' element={<StudentProfile />} />
        <Route path='payments' element={<StudentPayments />} />

      </Route>
     </Routes>
    </>
  )
}

export default App
