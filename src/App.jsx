import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import {Routes, Route, Link} from 'react-router-dom'
import Navbar from './components/navigation/Navbar.jsx'
import HomePage from './pages/homepage/HomePage.jsx'
import SignupPage from './pages/auth/SignupPage.jsx'
import LoginPage from './pages/auth/LoginPage.jsx'
import AdmissionStep from './pages/onboarding/AdmissionStep.jsx'
import PlanStep from './pages/onboarding/PlanStep.jsx'
import SeatStep from './pages/onboarding/SeatStep.jsx'
import PaymentStep from './pages/onboarding/PaymentStep.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
     </Routes>
    </>
  )
}

export default App
