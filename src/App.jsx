import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Routes, Route, } from 'react-router-dom'
import Navbar from './components/public/Navbar.jsx'
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
import PublicLayout from './layouts/PublicLayout.jsx'
import LandingPage from './pages/Landing/LandingPage.jsx'
import './App.css'
import AdminLayout from './layouts/AdminLayout.jsx'
import AdminStudents from './pages/Admin/AdminStudents.jsx'
function App() {
  

  return (
    <>
     <Routes>
       <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>
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
      <Route path='/admin' element={<AdminLayout/>}>
        <Route path='dashboard' ></Route>
        <Route path='students' element={<AdminStudents/>}/ >
        <Route path='seats' ></Route>
        <Route path='payments' ></Route>

      </Route>
     </Routes>
    </>
  )
}

export default App
