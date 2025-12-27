import React, { useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { fillAdmissionDetails } from "../../features/auth/authApi.js";

const AdmissionStep = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      purpose: [],
      age: "",
      education: "",
      otherEducation: "",
    },
  });

  const [showOtherEducation, setShowOtherEducation] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const purposeOptions = ["Study", "Competitive Exam", "Semester Exam", "Other"];
  const educationOptions = ["B.E.", "10th", "12th"];

  const selectedPurposes = watch("purpose");

  const onSubmit = async (data) => {
    try {
      setSubmitError(null);
      const result = await fillAdmissionDetails(data);
      console.log("Server response:", result);
      navigate("/onboarding/plan");
    } catch (error) {
      console.error("Error submitting admission details:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit. Please try again.";
      setSubmitError(errorMessage);
    }
  };

  const handleEducationChange = (value) => {
    setShowOtherEducation(value === "other");
  };

  return (
    <OnboardLayout
      currentStep={1}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-dark-emerald-900">
          Admission Information
        </h2>
        <p className="mt-2 text-base text-dark-emerald-700">
          Please provide your admission details to proceed.
        </p>
      </div>

      {/* Error Message Alert */}
      {submitError && (
        <div className="mb-6 rounded-2xl border border-deep-crimson-200 bg-deep-crimson-50 p-4 shadow-sm">
          <div className="flex gap-3">
            <span className="text-deep-crimson-600 text-xl">⚠</span>
            <div>
              <p className="font-semibold text-deep-crimson-900">
                {submitError}
              </p>
              <p className="mt-1 text-sm text-deep-crimson-700">
                Please make sure you're logged in and try again.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Purpose - Multiple Selection */}
        <div>
          <label className="mb-4 block text-base font-semibold text-dark-emerald-900">
            Purpose of Joining (Select all that apply)
          </label>

          <div className="space-y-3">
            {purposeOptions.map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`purpose-${option}`}
                  value={option}
                  {...register("purpose")}
                  className="h-5 w-5 cursor-pointer rounded border-ash-grey-300 text-pine-teal-600 focus:ring-2 focus:ring-pine-teal-300/70"
                />
                <label
                  htmlFor={`purpose-${option}`}
                  className="ml-3 cursor-pointer text-base font-medium text-dark-emerald-800"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>

          {!selectedPurposes?.length && (
            <p className="mt-2 text-sm text-deep-crimson-600">
              Please select at least one purpose
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <label
            htmlFor="age"
            className="mb-2 block text-base font-semibold text-dark-emerald-900"
          >
            Age
          </label>
          <input
            id="age"
            type="number"
            min="5"
            max="100"
            placeholder="Enter your age"
            {...register("age", {
              required: "Age is required",
              min: { value: 5, message: "Age must be at least 5" },
              max: { value: 100, message: "Age must be 100 or less" },
            })}
            className="block w-full rounded-2xl border border-ash-grey-300 bg-white p-4 text-dark-emerald-900 shadow-sm outline-none focus:border-pine-teal-400 focus:ring-2 focus:ring-pine-teal-300/70"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-deep-crimson-600">
              {errors.age.message}
            </p>
          )}
        </div>

        {/* Education Level */}
        <div>
          <label
            htmlFor="education"
            className="mb-2 block text-base font-semibold text-dark-emerald-900"
          >
            Education Level
          </label>
          <select
            id="education"
            {...register("education", { required: "Education level is required" })}
            onChange={(e) => handleEducationChange(e.target.value)}
            className="block w-full rounded-2xl border border-ash-grey-300 bg-white p-4 text-dark-emerald-900 shadow-sm outline-none focus:border-pine-teal-400 focus:ring-2 focus:ring-pine-teal-300/70"
          >
            <option value="">-- Select Education Level --</option>
            {educationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {errors.education && (
            <p className="mt-1 text-sm text-deep-crimson-600">
              {errors.education.message}
            </p>
          )}
        </div>

        {/* Other Education (Conditional) */}
        {showOtherEducation && (
          <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-5">
            <label
              htmlFor="otherEducation"
              className="mb-2 block text-base font-semibold text-dark-emerald-900"
            >
              Please specify your education level
            </label>
            <input
              id="otherEducation"
              type="text"
              placeholder="e.g., Diploma, Master's, PhD, etc."
              {...register("otherEducation", {
                validate: (value) => {
                  if (showOtherEducation && !value?.trim()) {
                    return "Please specify your education level";
                  }
                  return true;
                },
              })}
              className="block w-full rounded-2xl border border-ash-grey-300 bg-white p-4 text-dark-emerald-900 shadow-sm outline-none focus:border-pine-teal-400 focus:ring-2 focus:ring-pine-teal-300/70"
            />
            {errors.otherEducation && (
              <p className="mt-1 text-sm text-deep-crimson-600">
                {errors.otherEducation.message}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full rounded-2xl px-5 py-4 text-base font-semibold shadow-lg transition ${
            isSubmitting
              ? "cursor-not-allowed bg-ash-grey-300 text-ash-grey-700"
              : "bg-pine-teal-600 text-dark-emerald-950 hover:bg-pine-teal-500 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/70"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Next Step"}
        </button>
      </form>
    </OnboardLayout>
  );
};

export default AdmissionStep;
