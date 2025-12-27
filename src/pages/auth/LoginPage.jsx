import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../features/auth/authApi.js";
import PublicLayout from "../../layouts/PublicLayout.jsx";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { getSessionDetails } from "../../features/auth/authApi.js";
const LoginPage = () => {
  const navigate = useNavigate();
  const {login} = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
 
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      console.log("Sending login data", data);
      const result = await loginUser(data);
    await login(result);
    const getStatus = await getSessionDetails();
    const status = getStatus.data;
    console.log(status);
    // const currentStep = status.currentStep;
   const stepToRoute = {
      2: "/onboarding/admission",
      3: "/onboarding/plan",
      4: "/onboarding/seat",
      5: "/onboarding/payment",
    };
    console.log(status.isCompleted)
    if (!status.isCompleted) {
      const route = stepToRoute[status.currentStep] || "/onboarding/admission";
      navigate(route, { replace: true });
      return; // IMPORTANT: stop here
    }
      console.log("Login successful:", result);
      // later: save token & user, then redirect based on role
      navigate("/");
    } catch (error) {
      console.log("Login failed:", error);
      const errorMsg =
        error?.response?.data?.message ||
        "Login failed. Please try again.";
      setServerError(errorMsg);
    }
  };

  return (
    <PublicLayout>
      <section className="flex flex-1 h-full items-center justify-center bg-frosted-mint-50 px-4 py-10">
        <div className="w-full max-w-md rounded-3xl bg-evergreen-950/95 p-8 shadow-xl border border-evergreen-800">
          <h1 className="mb-2 text-2xl font-semibold text-frosted-mint-100">
            Log in
          </h1>
          <p className="mb-6 text-sm text-frosted-mint-100/80">
            Enter your credentials to log in.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-evergreen-700 bg-evergreen-900/60 px-3 py-2 text-sm text-frosted-mint-100 placeholder:text-evergreen-300 focus:border-frosted-mint-300 focus:outline-none"
                {...register("email", { required: "Email is required" })}
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

            {/* Server error */}
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
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-frosted-mint-100/70">
            Don&apos;t have an account yet?{" "}
            <Link
              to="/signup"
              className="text-frosted-mint-200 underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </PublicLayout>
  );
};

export default LoginPage;
