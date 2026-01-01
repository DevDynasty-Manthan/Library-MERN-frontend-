import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Mail, Lock, GraduationCap, Quote } from "lucide-react";
import { loginUser, getSessionDetails } from "../../features/auth/authApi.js";
import { useAuth } from "../../features/auth/AuthContext.jsx";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, startOnboardingSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError(null);
    
    try {
      console.log("🔐 LoginPage: Attempting login");
      
      // Step 1: Login user
      const result = await loginUser(data);
      
      if (!result.ok) {
        setServerError(result.message || "Login failed");
        return;
      }

      console.log("✅ Login successful:", result);
      
      const userRole = result.data.role;
      console.log("📦 User role:", userRole);

      // ✅ CASE 1: ADMIN - Skip onboarding check entirely
      if (userRole === "admin") {
        console.log("👑 Admin login - going to dashboard");
        login(result);
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      // ✅ CASE 2: STUDENT - Check for active onboarding session
      console.log("🎓 Student login - checking onboarding status");
      
      try {
        // Backend will use sessionId from token if present, or email if not
        const sessionResponse = await getSessionDetails();
        
        console.log("📋 Session response:", sessionResponse);
        
        // ✅ Active incomplete session found
        if (sessionResponse.ok && sessionResponse.data?.sessionId) {
          const { currentStep, sessionId, onboardingCompleted } = sessionResponse.data;
          
          console.log("📋 Session details:");
          console.log("   currentStep:", currentStep);
          console.log("   onboardingCompleted:", onboardingCompleted);
          
          // Check if onboarding is actually incomplete
          if (!onboardingCompleted) {
            console.log(`⚠️ Onboarding incomplete - resuming at step ${currentStep}`);
            
            // Save session to AuthContext
            startOnboardingSession({
              token: result.data.token,
              sessionId: sessionId,
              currentStep: currentStep,
              email: result.data.email
            });

            // Map step number to route
            const stepRoutes = {
              1: "/onboarding/admission",
              2: "/onboarding/admission",
              3: "/onboarding/plan",
              4: "/onboarding/seat",
              5: "/onboarding/payment"
            };

            const targetRoute = stepRoutes[currentStep] || "/onboarding/admission";
            console.log(`🚀 Redirecting to ${targetRoute}`);
            navigate(targetRoute, { replace: true });
            return;
          } else {
            // Onboarding marked complete
            console.log("✅ Onboarding complete - going to profile");
            login(result);
            navigate("/student/profile", { replace: true });
            return;
          }
        } else {
          // No active session = onboarding complete
          console.log("✅ No active session - onboarding complete");
          login(result);
          navigate("/student/profile", { replace: true });
          return;
        }
      } catch (sessionError) {
        // ✅ Error checking session (likely 404 = no active session)
        const status = sessionError?.response?.status;
        const message = sessionError?.response?.data?.msg || sessionError?.message;
        
        console.log(`📋 Session check error: ${status} - ${message}`);
        
        // 404 or "No active session" means onboarding is complete
        if (status === 404 || message?.includes("No active session")) {
          console.log("✅ No active session (404) - onboarding complete");
          login(result);
          navigate("/student/profile", { replace: true });
          return;
        } else {
          // Unexpected error - still try to proceed to profile
          console.warn("⚠️ Unexpected session error - proceeding to profile");
          console.error("Session error details:", sessionError);
          login(result);
          navigate("/student/profile", { replace: true });
          return;
        }
      }
      
    } catch (error) {
      console.error("❌ Login error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Login failed. Please try again.";
      setServerError(errorMsg);
    }
  };

  return (
    <div className="bg-[#f6f8f8] text-[#0d1b18] min-h-screen flex flex-col font-display">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="text-[#11d4a4]" size={32} strokeWidth={2.5} />
            <h2 className="text-[22px] font-[900] leading-tight tracking-[-0.04em]">StudySpace</h2>
          </Link>
          <Link to="/onboarding/admission" className="text-[14px] font-[900] uppercase tracking-wider text-[#11d4a4] hover:opacity-80 transition-opacity">
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-200">
          
          {/* Left Side: Login Form */}
          <div className="col-span-1 lg:col-span-6 p-8 md:p-16">
            <div className="max-w-md mx-auto">
              <div className="mb-10">
                <h1 className="text-4xl font-[900] tracking-tight text-[#0d1b18] mb-3">Welcome Back, Scholar</h1>
                <p className="text-gray-500 font-bold text-lg">Enter your details to access your space.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {serverError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold">
                    {serverError}
                  </div>
                )}

                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-xs font-[900] text-[#0d1b18] uppercase tracking-[0.1em] ml-1">University Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#11d4a4] transition-colors" size={20} />
                    <input
                      {...register("email", { required: "Email is required" })}
                      type="email"
                      placeholder="user@university.edu"
                      className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-[#f6f8f8] border-2 transition-all outline-none font-bold text-[#0d1b18] placeholder:text-gray-400 ${errors.email ? 'border-red-400' : 'border-transparent focus:border-[#11d4a4] focus:bg-white'}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs font-bold ml-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-[900] text-[#0d1b18] uppercase tracking-[0.1em]">Password</label>
                    <Link to="#" className="text-xs font-bold text-[#11d4a4] hover:underline">Forgot?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#11d4a4] transition-colors" size={20} />
                    <input
                      {...register("password", { required: "Password is required" })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full h-14 pl-14 pr-14 rounded-2xl bg-[#f6f8f8] border-2 transition-all outline-none font-bold text-[#0d1b18] placeholder:text-gray-400 ${errors.password ? 'border-red-400' : 'border-transparent focus:border-[#11d4a4] focus:bg-white'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0d1b18]"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs font-bold ml-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 mt-4 rounded-2xl bg-[#11d4a4] text-[#10221d] font-[900] text-lg shadow-xl shadow-[#11d4a4]/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Logging in..." : "Log In"}
                  <ArrowRight size={20} strokeWidth={3} />
                </button>
              </form>

              <div className="mt-8 flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                <div className="h-[1px] flex-1 bg-gray-200"></div>
                <span>Or continue with</span>
                <div className="h-[1px] flex-1 bg-gray-200"></div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50">
                  <span className="material-symbols-outlined text-sm">school</span> Student ID
                </button>
                <button className="flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 font-bold text-sm hover:bg-gray-50">
                   Microsoft
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500 font-bold">
                  Don't have an account?{" "}
                  <Link to="/onboarding/admission" className="text-[#11d4a4] font-[900] hover:underline">
                    Sign up now
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Visual & Social Proof */}
          <div className="hidden lg:flex lg:col-span-6 bg-[#10221d] relative items-center justify-center p-16 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full bg-[#11d4a4]/10 blur-3xl" />
            
            <div className="relative z-10 text-white max-w-md">
              <div className="mb-8 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#11d4a4]/20 backdrop-blur-sm border border-[#11d4a4]/30 text-[#11d4a4]">
                <Quote size={30} fill="currentColor" />
              </div>
              <blockquote className="text-3xl font-[900] leading-tight tracking-tight mb-8">
                "The study spaces have completely transformed how I prepare for my finals. It's quiet, modern, and always available."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full border-2 border-[#11d4a4] bg-gray-800 overflow-hidden">
                  {/* Portrait Placeholder */}
                </div>
                <div>
                  <div className="font-[900] text-lg">Sarah Jenkins</div>
                  <div className="text-[#11d4a4]/80 font-bold text-sm">Computer Science, Class of '25</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center text-gray-400 text-xs font-[900] uppercase tracking-widest">
        © 2025 StudySpace Inc. — All rights reserved.
      </footer>
    </div>
  );
};

export default LoginPage;
