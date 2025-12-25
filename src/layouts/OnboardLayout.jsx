import React from 'react'

const OnboardLayout = ({ children, currentStep = 1, totalSteps = 4, stepLabels = ['Admission', 'Plan', 'Seat', 'Payment'] }) => {
  return (
    <div className="min-h-screen w-full bg-linear-to-br from-celadon-50 to-celadon-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-celadon-900">Complete Your Onboarding</h1>
          <p className="text-celadon-700 mt-2">Step {currentStep} of {totalSteps}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-celadon-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, index) => (
              <React.Fragment key={index}>
                {/* Step Circle */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      index + 1 <= currentStep
                        ? 'bg-celadon-600 text-white shadow-lg'
                        : 'bg-celadon-100 text-celadon-600'
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
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 min-h-96">
          {children}
        </div>
      </main>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center text-gray-600 text-sm">
          <p>Your progress is automatically saved</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardLayout
