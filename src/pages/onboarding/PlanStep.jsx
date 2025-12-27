import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { getAvailablePlans, selectPlan } from "../../features/auth/authApi.js";

const PlanStep = () => {
  const navigate = useNavigate();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const plansRes = await getAvailablePlans();
        setPlans(plansRes.data || []);
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const onSelectPlan = async (plan) => {
    try {
      const planData = {
        planId: plan._id || plan.id,
        planName: plan.name,
        planCode: plan.code,
        planFees: plan.fees,
      };

      const response = await selectPlan(planData);
      console.log("Plan selection response:", response);

      navigate("/onboarding/seat");
    } catch (error) {
      console.error("Error selecting plan:", error);
    }
  };

  return (
    <OnboardLayout
      currentStep={2}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-4 text-center">
          <h1 className="text-4xl font-bold text-dark-emerald-900">
            Choose Your Plan
          </h1>
          <p className="mt-3 text-base text-dark-emerald-700">
            Select the plan that best fits your study needs
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-3xl border border-ash-grey-200 bg-white p-10 text-center text-dark-emerald-700 shadow-sm">
            <div className="mb-3 inline-block animate-spin text-2xl">⏳</div>
            <p className="text-base font-semibold">Loading available plans...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan._id || plan.id}
                className="group rounded-3xl border border-ash-grey-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:border-pine-teal-300 hover:shadow-xl"
              >
                {/* Title */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-dark-emerald-900">
                      {plan.name}
                    </h2>
                    <p className="mt-1 text-sm text-dark-emerald-700">
                      {plan.code}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 px-4 py-3 text-right">
                    <p className="text-sm text-dark-emerald-700">Monthly</p>
                    <p className="text-3xl font-extrabold text-dark-emerald-900">
                      ₹{plan.fees}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="mt-6 space-y-3">
                  {plan.features?.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-base text-dark-emerald-800"
                    >
                      <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-pine-teal-500" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className="
                    mt-7 w-full rounded-2xl
                    bg-gradient-to-r from-pine-teal-600 to-pine-teal-700
                    px-5 py-4 text-base font-semibold text-dark-emerald-950
                    shadow-lg transition
                    hover:from-pine-teal-500 hover:to-pine-teal-600 hover:shadow-xl
                    active:scale-[0.99]
                    focus:outline-none focus:ring-2 focus:ring-pine-teal-300/70
                  "
                >
                  Select This Plan
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </OnboardLayout>
  );
};

export default PlanStep;
