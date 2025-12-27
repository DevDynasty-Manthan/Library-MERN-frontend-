import React from "react";

const OnboardLayout = ({
  children,
  currentStep = 1,
  totalSteps = 4,
  stepLabels = ["Admission", "Plan", "Seat", "Payment"],
}) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-ash-grey-50 via-platinum-50 to-pine-teal-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-emerald-900 to-dark-emerald-950 shadow-lg">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-4xl font-bold tracking-tight text-platinum-50">
            Complete Your Onboarding
          </h1>
          <p className="mt-3 text-sm font-medium text-platinum-200">
            Step {currentStep} of {totalSteps} • {stepLabels[currentStep - 1]}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-ash-grey-200 bg-white/90 backdrop-blur shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, index) => (
              <React.Fragment key={index}>
                {/* Step Circle */}
                <div className="flex flex-1 flex-col items-center">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold shadow-md transition-all duration-300 ${
                      index + 1 < currentStep
                        ? "bg-gradient-to-br from-pine-teal-500 to-pine-teal-700 text-dark-emerald-950 shadow-lg scale-105"
                        : index + 1 === currentStep
                        ? "bg-pine-teal-100 text-dark-emerald-900 ring-2 ring-pine-teal-400"
                        : "bg-ash-grey-100 text-ash-grey-600"
                    }`}
                  >
                    {index + 1 < currentStep ? "✓" : index + 1}
                  </div>

                  <p
                    className={`mt-2 text-sm font-medium ${
                      index + 1 <= currentStep
                        ? "text-dark-emerald-800"
                        : "text-ash-grey-600"
                    }`}
                  >
                    {label}
                  </p>
                </div>

                {/* Connector Line */}
                {index < stepLabels.length - 1 && (
                  <div className="mx-2 mb-8 flex-1">
                    <div
                      className={`h-1 rounded transition-all duration-300 ${
                        index + 1 < currentStep
                          ? "bg-pine-teal-600"
                          : "bg-ash-grey-200"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="min-h-96 rounded-3xl border border-ash-grey-200 bg-white p-8 shadow-xl md:p-12">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="mt-12 border-t border-ash-grey-200 bg-gradient-to-r from-platinum-50 to-ash-grey-50">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm font-medium text-dark-emerald-800">
          <p>✓ Your progress is automatically saved</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardLayout;
