import React, { use, useState } from 'react'
import OnboardLayout from '../../layouts/OnboardLayout.jsx';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useAuth } from '../../features/auth/AuthContext.jsx';
import { fillAdmissionDetails } from '../../features/auth/authApi.js';

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
       age: '',
       education: '',
       otherEducation: ''
     }
   });
  //  useAuth(login);

   const [showOtherEducation, setShowOtherEducation] = useState(false);
   const [submitError, setSubmitError] = useState(null);
   
   const purposeOptions = ["Study", "Competitive Exam", "Semester Exam", "Other"]
   const educationOptions = ["B.E.", "10th", "12th"]
   
   const selectedEducation = watch("education");
   const selectedPurposes = watch("purpose");

   const onSubmit = async (data) => {
        try {
            setSubmitError(null);
            console.log("Admission data submitted:", data);
            const result = await fillAdmissionDetails(data);
            console.log("Server response:", result);
            // Navigate to next step on success
            navigate('/onboarding/plan');
        } catch (error) {
            console.error("Error submitting admission details:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to submit. Please try again.';
            setSubmitError(errorMessage);
        }
   }

   const handleEducationChange = (value) => {
     if (value === "other") {
       setShowOtherEducation(true);
     } else {
       setShowOtherEducation(false);
     }
   }

  return (
    <div>
      <OnboardLayout currentStep={1} totalSteps={4} stepLabels={['Admission', 'Plan', 'Seat', 'Payment']}>
        <h2 className="text-2xl font-bold text-celadon-900 mb-2">Admission Information</h2>
        <p className="text-celadon-700 mb-8">Please provide your admission details to proceed.</p>
        
        {/* Error Message Alert */}
        {submitError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">Error: {submitError}</p>
            <p className="text-red-600 text-sm mt-1">Please make sure you're logged in and try again.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Purpose - Multiple Selection */}
          <div>
            <label className="block text-sm font-semibold text-celadon-900 mb-4">Purpose of Joining (Select all that apply)</label>
            <div className="space-y-3">
              {purposeOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`purpose-${option}`}
                    value={option}
                    {...register("purpose")}
                    className="w-4 h-4 text-celadon-600 border-celadon-300 rounded focus:ring-celadon-500 cursor-pointer"
                  />
                  <label htmlFor={`purpose-${option}`} className="ml-3 text-sm text-celadon-700 cursor-pointer font-medium">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {!selectedPurposes?.length && <p className="mt-2 text-sm text-red-600">Please select at least one purpose</p>}
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-celadon-900 mb-2">Age</label>
            <input
              id="age"
              type="number"
              min="5"
              max="100"
              placeholder="Enter your age"
              {...register("age", { 
                required: "Age is required",
                min: { value: 5, message: "Age must be at least 5" },
                max: { value: 100, message: "Age must be 100 or less" }
              })}
              className="block w-full border border-celadon-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-celadon-500 focus:border-celadon-500 text-celadon-900"
            />
            {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
          </div>

          {/* Education Level */}
          <div>
            <label htmlFor="education" className="block text-sm font-semibold text-celadon-900 mb-2">Education Level</label>
            <select
              id="education"
              {...register("education", { required: "Education level is required" })}
              onChange={(e) => handleEducationChange(e.target.value)}
              className="block w-full border border-celadon-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-celadon-500 focus:border-celadon-500 text-celadon-900 bg-white"
            >
              <option value="">-- Select Education Level --</option>
              {educationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
            {errors.education && <p className="mt-1 text-sm text-red-600">{errors.education.message}</p>}
          </div>

          {/* Other Education (Conditional) */}
          {showOtherEducation && (
            <div className="bg-celadon-50 border border-celadon-200 rounded-lg p-4">
              <label htmlFor="otherEducation" className="block text-sm font-semibold text-celadon-900 mb-2">
                Please specify your education level
              </label>
              <input
                id="otherEducation"
                type="text"
                placeholder="e.g., Diploma, Master's, PhD, High School, etc."
                {...register("otherEducation", {
                  validate: (value) => {
                    if (showOtherEducation && !value?.trim()) {
                      return "Please specify your education level";
                    }
                    return true;
                  }
                })}
                className="block w-full border border-celadon-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-celadon-500 focus:border-celadon-500 text-celadon-900 bg-white"
              />
              {errors.otherEducation && <p className="mt-1 text-sm text-red-600">{errors.otherEducation.message}</p>}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg shadow-md font-semibold transition-all duration-200 ${
              isSubmitting 
                ? 'bg-celadon-400 text-white cursor-not-allowed' 
                : 'bg-celadon-600 hover:bg-celadon-700 text-white cursor-pointer'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Next Step'}
          </button>
        </form>
      </OnboardLayout>
    </div>
  )
}

export default AdmissionStep
