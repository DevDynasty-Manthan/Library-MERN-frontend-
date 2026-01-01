import React, { useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { fillAdmissionDetails } from "../../features/auth/authApi.js";
import { ArrowRight, School, User, Target, HelpCircle } from "lucide-react";

const AdmissionStep = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
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
      await fillAdmissionDetails(data);
      navigate("/onboarding/plan");
    } catch (error) {
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

  // Helper to toggle multi-select chips
  const togglePurpose = (option) => {
    const current = selectedPurposes || [];
    const updated = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];
    setValue("purpose", updated, { shouldValidate: true });
  };

  return (
    <OnboardLayout
      currentStep={1}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      {/* Header Section */}
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-3xl font-[900] text-[#0d1b18] tracking-tight mb-2">
          Tell us about your studies
        </h1>
        <p className="text-gray-500 font-bold text-lg">
          We'll customize your study dashboard based on your academic needs.
        </p>
      </div>

      {submitError && (
        <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm font-bold">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Purpose - Premium Chip Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 ml-1">
            <label className="text-xs font-[900] text-[#0d1b18] uppercase tracking-[0.1em]">
              Primary Goals
            </label>
            <HelpCircle size={14} className="text-gray-400" />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {purposeOptions.map((option) => {
              const isActive = selectedPurposes?.includes(option);
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => togglePurpose(option)}
                  className={`px-6 py-3 rounded-full font-bold text-sm transition-all border-2 flex items-center gap-2 ${
                    isActive 
                      ? "bg-[#11d4a4] border-[#11d4a4] text-[#0d1b18] shadow-lg shadow-[#11d4a4]/20" 
                      : "bg-[#f6f8f8] border-transparent text-gray-500 hover:border-gray-200"
                  }`}
                >
                  <Target size={16} strokeWidth={isActive ? 3 : 2} />
                  {option}
                </button>
              );
            })}
          </div>
          {(!selectedPurposes || selectedPurposes.length === 0) && (
            <p className="text-xs text-red-500 font-bold ml-1">Please select at least one goal</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Age Input */}
          <div className="space-y-2">
            <label className="text-xs font-[900] text-[#0d1b18] uppercase tracking-[0.1em] ml-1">
              Your Age
            </label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#11d4a4] transition-colors" size={20} />
              <input
                type="number"
                placeholder="20"
                {...register("age", { required: "Age is required" })}
                className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-[#f6f8f8] border-2 transition-all outline-none font-bold text-[#0d1b18] placeholder:text-gray-400 ${errors.age ? 'border-red-400' : 'border-transparent focus:border-[#11d4a4] focus:bg-white'}`}
              />
            </div>
            {errors.age && <p className="text-xs text-red-500 font-bold ml-1">{errors.age.message}</p>}
          </div>

          {/* Education Level Select */}
          <div className="space-y-2">
            <label className="text-xs font-[900] text-[#0d1b18] uppercase tracking-[0.1em] ml-1">
              Education Level
            </label>
            <div className="relative group">
              <School className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#11d4a4] transition-colors" size={20} />
              <select
                {...register("education", { required: "Education level is required" })}
                onChange={(e) => {
                  register("education").onChange(e); // inform react-hook-form
                  handleEducationChange(e.target.value);
                }}
                className={`w-full h-14 pl-14 pr-6 rounded-2xl bg-[#f6f8f8] border-2 transition-all outline-none font-bold text-[#0d1b18] appearance-none ${errors.education ? 'border-red-400' : 'border-transparent focus:border-[#11d4a4] focus:bg-white'}`}
              >
                <option value="">Select level</option>
                {educationOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>
            {errors.education && <p className="text-xs text-red-500 font-bold ml-1">{errors.education.message}</p>}
          </div>
        </div>

        {/* Other Education Input */}
        {showOtherEducation && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-[900] text-[#0d1b18] uppercase tracking-[0.1em] ml-1">
              Specify Education
            </label>
            <input
              type="text"
              placeholder="e.g. Master's Degree"
              {...register("otherEducation", {
                validate: (val) => !showOtherEducation || !!val?.trim() || "Required when 'Other' is selected"
              })}
              className="w-full h-14 px-6 rounded-2xl bg-[#f6f8f8] border-2 border-transparent focus:border-[#11d4a4] focus:bg-white transition-all outline-none font-bold text-[#0d1b18]"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto h-14 px-10 rounded-2xl bg-[#11d4a4] text-[#0d1b18] font-[900] text-lg shadow-xl shadow-[#11d4a4]/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Saving..." : "Continue"}
            <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </form>
    </OnboardLayout>
  );
};

export default AdmissionStep;