import React from "react";
import { GraduationCap, CheckCircle2, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const OnboardLayout = ({
  children,
  currentStep = 1,
  totalSteps = 4,
  stepLabels = ["Admission", "Plan", "Seat", "Payment"],
}) => {
  // Calculate percentage for the top progress bar
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen w-full bg-[#f6f8f8] font-display text-[#0d1b18] flex flex-col antialiased">
      {/* Top Sticky Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e7f3f0] bg-white/80 backdrop-blur-md px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <GraduationCap className="text-[#11d4a4]" size={32} strokeWidth={2.5} />
          <h2 className="text-xl font-[900] tracking-[-0.04em]">StudySpace</h2>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-bold text-gray-400 uppercase tracking-widest">Already a member?</span>
          <Link 
            to="/login" 
            className="px-6 py-2 rounded-xl border border-gray-200 font-[900] text-sm hover:bg-gray-50 transition-colors uppercase tracking-wider"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center py-10 px-4 sm:px-6">
        <div className="w-full max-w-[850px] flex flex-col gap-8">
          
          {/* Breadcrumbs & Progress Indicator */}
          <div className="flex flex-col gap-6">
            <nav aria-label="Progress Breadcrumb">
              <ol className="flex flex-wrap items-center gap-3 text-sm font-bold">
                {stepLabels.map((label, index) => {
                  const stepNumber = index + 1;
                  const isCompleted = stepNumber < currentStep;
                  const isActive = stepNumber === currentStep;

                  return (
                    <li key={label} className="flex items-center gap-3">
                      <div className={`flex items-center gap-2 ${
                        isActive ? "text-[#0d1b18]" : isCompleted ? "text-[#4c9a86]" : "text-gray-400"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle2 size={18} strokeWidth={3} className="text-[#11d4a4]" />
                        ) : null}
                        <span className={isActive ? "border-b-2 border-[#11d4a4] pb-0.5" : ""}>
                          {label}
                        </span>
                      </div>
                      {index < stepLabels.length - 1 && (
                        <ChevronRight size={16} className="text-gray-300" />
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>

            {/* Micro Progress Bar */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end px-1">
                <span className="text-xs font-[900] uppercase tracking-widest text-[#0d1b18]">
                  Step {currentStep} of {totalSteps}
                </span>
                <span className="text-xs font-bold text-gray-400">
                  {Math.round(progressPercentage)}% Completed
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#cfe7e1] overflow-hidden">
                <div 
                  className="h-full rounded-full bg-[#11d4a4] transition-all duration-700 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Centered Form Card - Squircle Design */}
          <div className="w-full bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-[#e7f3f0] overflow-hidden">
            <div className="p-8 sm:p-12">
              {children}
            </div>

            {/* Form Footer/Status Area */}
            <div className="bg-[#fcfdfd] px-8 sm:px-12 py-5 border-t border-[#e7f3f0] flex items-center justify-center">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <span className="h-1.5 w-1.5 rounded-full bg-[#11d4a4]" />
                 Your progress is saved automatically
               </p>
            </div>
          </div>

          {/* Help Center Link */}
          <p className="text-center text-sm font-bold text-gray-400">
            Questions? <button className="text-[#11d4a4] hover:underline transition-all">Contact Support</button>
          </p>
        </div>
      </main>

      <footer className="w-full py-8 text-center text-gray-400 text-[10px] font-[900] uppercase tracking-[0.2em]">
        © 2025 StudySpace Inc. — Focus. Achieve. Succeed.
      </footer>
    </div>
  );
};

export default OnboardLayout;