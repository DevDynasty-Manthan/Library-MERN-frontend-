import React from 'react'

const OnboardLayout = ({ children, currentStep = 1, totalSteps = 4, stepLabels = ['Admission', 'Plan', 'Seat', 'Payment'] }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-celadon-50 via-sky-50 to-celadon-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-celadon-600 to-celadon-700 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-white tracking-tight">Complete Your Onboarding</h1>
          <p className="text-celadon-100 mt-3 text-sm font-medium">Step {currentStep} of {totalSteps} • {stepLabels[currentStep - 1]}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white/95 backdrop-blur border-b border-celadon-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, index) => (
              <React.Fragment key={index}>
                {/* Step Circle */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 shadow-md ${
                      index + 1 <= currentStep
                        ? 'bg-gradient-to-br from-celadon-500 to-celadon-700 text-white shadow-lg scale-105'
                        : index + 1 === currentStep ? 'bg-celadon-200 text-celadon-700 ring-2 ring-celadon-400'
                        : 'bg-celadon-100 text-celadon-500'
                    }`}
                  >
                    {index + 1 <= currentStep ? '✓' : index + 1}
                  </div>
                  <p className={`mt-2 text-sm font-medium ${
                    index + 1 <= currentStep ? 'text-celadon-600' : 'text-celadon-500'
                  }`}>
                    {label}
                  </p>
                </div>

                {/* Connector Line */}
                {index < stepLabels.length - 1 && (
                  <div className="flex-1 mx-2 mb-8">
                    <div
                      className={`h-1 rounded transition-all duration-300 ${
                        index + 1 < currentStep ? 'bg-celadon-600' : 'bg-celadon-200'
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 min-h-96 border border-celadon-100/50 backdrop-blur-sm">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="bg-gradient-to-r from-celadon-50 to-sky-50 border-t border-celadon-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-celadon-700 text-sm font-medium">
          <p>✓ Your progress is automatically saved</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardLayout
