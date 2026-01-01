import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, ShieldCheck, Mail, Smartphone, Lock, GraduationCap } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { registerUser } from "../../features/auth/authApi.js";

export default function SignupPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const { startOnboardingSession } = useAuth();

  const onSubmit = async (data) => {
    setServerError(null);

    try {
      // Backend expects 'name', 'phone', 'email', 'password'
      const backendData = {
        name: data.fullName.trim(),
        phone: data.phone,
        email: data.email,
        password: data.password,
      };

      const result = await registerUser(backendData);
      
      startOnboardingSession({
        token: result.data.token,
        sessionId: result.data.sessionId,
        currentStep: result.data.currentStep,
        email: result.data.email,
      });
      
      // Redirect to the first onboarding step as per logic
      navigate("/onboarding/admission");
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        "Registration failed. Please try again.";

      setServerError(
        errorMsg.toLowerCase().includes("exists")
          ? "This email is already registered. Please log in instead."
          : errorMsg
      );
    }
  };

  return (
    <div className="bg-bg text-text min-h-screen flex flex-col font-display">
      {/* Navbar - Matching the Reference Logo Style */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between py-6">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="text-primary" size={35} strokeWidth={2.5} />
            <h2 className="text-[24px] font-[900] leading-tight tracking-[-0.04em]">
              StudySpace
            </h2>
          </Link>
          <Link to="/login" className="text-[15px] font-[900] uppercase tracking-wider text-text hover:text-primary transition-colors">
            Log In
          </Link>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 md:px-10">
        <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Brand Message & Trust Badges */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-8">
            <div className="space-y-6">
              <h1 className="text-6xl font-[900] leading-[1.05] tracking-[-0.05em]">
                Join the <br />
                <span className="text-primary">elite circle</span> <br />
                of students.
              </h1>
              <p className="text-muted text-xl font-medium max-w-sm leading-relaxed tracking-tight">
                Secure your dedicated spot and start your journey towards academic excellence.
              </p>
            </div>

            <div className="relative group max-w-sm">
              <div className="absolute inset-0 bg-primary/10 rounded-[32px] blur-2xl group-hover:bg-primary/20 transition-all"></div>
              <div className="relative bg-white border border-border p-8 rounded-[32px] shadow-sm">
                <div className="flex items-center gap-3 text-primary mb-4">
                  <ShieldCheck size={24} strokeWidth={2.5} />
                  <span className="font-[900] uppercase tracking-wider text-xs">Verified Space</span>
                </div>
                <p className="text-text font-bold text-lg leading-snug tracking-tight">
                  100% Secure registration. Your privacy is our top priority.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side: Form Card - Using the Squircle Style */}
          <div className="col-span-1 lg:col-span-7">
            <div className="bg-white rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-border p-8 md:p-12">
              <div className="mb-10">
                <h2 className="text-3xl font-[900] text-text tracking-tight mb-2">Create Account</h2>
                <p className="text-muted font-bold text-lg">Enter your details to get started.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {serverError && (
                  <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold">
                    {serverError}
                  </div>
                )}

                {/* Full Name Field */}
                <div className="space-y-2">
                  <label className="text-xs font-[900] text-text uppercase tracking-[0.1em] ml-1">Full Name</label>
                  <input
                    {...register("fullName", { required: "Full name is required" })}
                    type="text"
                    placeholder="Alex Smith"
                    className={`w-full h-14 px-6 rounded-2xl bg-bg border-2 transition-all outline-none font-bold text-text placeholder:text-muted/40 ${errors.fullName ? 'border-red-400' : 'border-transparent focus:border-primary focus:bg-white'}`}
                  />
                  {errors.fullName && <p className="text-xs text-red-500 font-bold ml-1">{errors.fullName.message}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-[900] text-text uppercase tracking-[0.1em] ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                      })}
                      type="email"
                      placeholder="alex@university.edu"
                      className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-bg border-2 transition-all outline-none font-bold text-text placeholder:text-muted/40 ${errors.email ? 'border-red-400' : 'border-transparent focus:border-primary focus:bg-white'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-bold ml-1">{errors.email.message}</p>}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="text-xs font-[900] text-text uppercase tracking-[0.1em] ml-1">Mobile Number</label>
                  <div className="relative group">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      {...register("phone", { 
                        required: "Phone is required",
                        pattern: { value: /^[0-9]{10}$/, message: "Enter 10-digit number" }
                      })}
                      type="tel"
                      placeholder="9876543210"
                      className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-bg border-2 transition-all outline-none font-bold text-text placeholder:text-muted/40 ${errors.phone ? 'border-red-400' : 'border-transparent focus:border-primary focus:bg-white'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 font-bold ml-1">{errors.phone.message}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="text-xs font-[900] text-text uppercase tracking-[0.1em] ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
                    <input
                      {...register("password", { 
                        required: "Password is required",
                        minLength: { value: 6, message: "Min. 6 characters" }
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`w-full h-14 pl-14 pr-14 rounded-2xl bg-bg border-2 transition-all outline-none font-bold text-text placeholder:text-muted/40 ${errors.password ? 'border-red-400' : 'border-transparent focus:border-primary focus:bg-white'}`}
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-bold ml-1">{errors.password.message}</p>}
                </div>

                {/* Footer Actions */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <p className="text-sm font-bold text-muted">
                    Already a member?{" "}
                    <Link to="/login" className="text-primary hover:underline">Log In</Link>
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full md:w-auto h-14 px-10 rounded-2xl bg-primary text-text font-[900] text-lg shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Creating..." : "Sign Up"}
                    <ArrowRight size={20} strokeWidth={3} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 text-center text-muted text-xs font-bold uppercase tracking-widest">
        © 2025 StudySpace Inc. — Built for Excellence
      </footer>
    </div>
  );
}