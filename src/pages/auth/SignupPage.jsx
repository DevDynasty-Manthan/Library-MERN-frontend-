import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import PublicLayout from "../../layouts/PublicLayout.jsx";
import { registerUser } from "../../features/auth/authApi.js";
const SignupPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { startOnboardingSession } = useAuth();

  
 const [showPassword, setShowPassword] = React.useState(false);
 const [serverError, setServerError] = React.useState(null);
 const onSubmit = async (data) => {
  setServerError(null);
 
  try {
    console.log("sending signUp data", data);
    const result = await registerUser(data);
    startOnboardingSession({
      token: result.data.token,
      sessionId: result.data.sessionId,
    });
    console.log("Registration successful:", result);
    navigate('/onboarding/admission');
    // later: navigate or show success
  } catch (error) {
    console.error("Registration failed:", error);

    // Prefer message field from backend, then fallback
    const errorMsg =
      error?.response?.data?.message || // <- most Express APIs
      error?.response?.data?.error ||
      "Registration failed. Please try again.";

    if (
      errorMsg.toLowerCase().includes("already") ||
      errorMsg.toLowerCase().includes("exists")
    ) {
      setServerError(
        "This email is already registered. Please log in instead."
      );
    } else {
      setServerError(errorMsg);
    }
  }
};


  return (
    <PublicLayout>
      <section className="flex flex-1 h-full items-center justify-center bg-frosted-mint-50 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-evergreen-950/95 p-8 shadow-xl border border-evergreen-800">
          <h1 className="mb-2 text-2xl font-semibold text-frosted-mint-100">
            Sign Up
          </h1>
          <p className="mb-6 text-sm text-frosted-mint-100/80">
            Join us to get your personalized study seat.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-frosted-mint-100"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Enter your full name"
                className="mt-1 w-full rounded-xl border border-evergreen-700 bg-evergreen-900/60 px-3 py-2 text-sm text-frosted-mint-100 placeholder:text-evergreen-300 focus:border-frosted-mint-300 focus:outline-none"
                {...register("name", {
                  required: "Name is required",
                })}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-300">
                  {errors.name.message}
                </p>
              )}
            </div>
            {/* Phone field */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-frosted-mint-100">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    placeholder="Enter your phone number"
                    className="mt-1 w-full rounded-xl border border-evergreen-700 bg-evergreen-900/60 px-3 py-2 text-sm text-frosted-mint-100 placeholder:text-evergreen-300 focus:border-frosted-mint-300 focus:outline-none"
                    {...register("phone", {
                        required: "Phone number is required",
                    })}
                />
                {errors.phone && (
                    <p className="mt-1 text-xs text-red-300">
                        {errors.phone.message}
                    </p>
                )}
            </div>

            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-frosted-mint-100"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="mt-1 w-full rounded-xl border border-evergreen-700 bg-evergreen-900/60 px-3 py-2 text-sm text-frosted-mint-100 placeholder:text-evergreen-300 focus:border-frosted-mint-300 focus:outline-none"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value:
                      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-300">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password field */}
             <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-frosted-mint-100"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-evergreen-700 bg-evergreen-900/60 px-3 py-2 pr-12 text-sm text-frosted-mint-100 placeholder:text-evergreen-300 focus:border-frosted-mint-300 focus:outline-none"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-xs text-frosted-mint-200 hover:text-frosted-mint-100"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-300">
                  {errors.password.message}
                </p>
              )}
            </div>
                {serverError && (
                <p className="text-sm text-red-300 bg-red-900/40 border border-red-500/40 rounded-xl px-3 py-2">
                {serverError}
                </p>
                )}
            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-full bg-frosted-mint-300 px-4 py-2 text-sm font-semibold text-evergreen-950 shadow-md transition hover:bg-frosted-mint-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-frosted-mint-100/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-frosted-mint-200 underline underline-offset-2"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default SignupPage;
