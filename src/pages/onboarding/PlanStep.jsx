import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { getAvailablePlans, selectPlan } from "../../features/auth/authApi.js";
import { Check, ArrowRight, Loader2, Sparkles } from "lucide-react";

const PlanStep = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectingId, setSelectingId] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const plansRes = await getAvailablePlans();
        // DEBUG: Ensure we are accessing the correct data nesting
        const data = plansRes?.data || plansRes || [];
        setPlans(Array.isArray(data) ? data : []);
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
    // DEBUG: Safeguard ID extraction
    const currentId = plan._id || plan.id;
    if (!currentId) {
      console.error("Plan ID missing", plan);
      return;
    }

    try {
      setSelectingId(currentId);
      
      const planData = {
        planId: currentId,
        planName: plan.name,
        planCode: plan.code,
        planFees: plan.fees,
      };

      const res = await selectPlan(planData);
      
      // DEBUG: Only navigate if the response is successful
      if (res) {
        navigate("/onboarding/seat");
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      // IMPORTANT: Reset loading state on error so user can try again
      setSelectingId(null);
    }
  };

  return (
    <OnboardLayout
      currentStep={2}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-[900] text-[#0d1b18] tracking-tight mb-4">
          Choose the right plan for your studies
        </h1>
        <p className="text-lg text-gray-500 font-bold max-w-xl mx-auto">
          Invest in your focus with our tailored study packages. Access premium resources and quiet zones.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#11d4a4]">
          <Loader2 className="animate-spin mb-4" size={48} strokeWidth={2.5} />
          <p className="font-[900] uppercase tracking-widest text-sm text-gray-400">Loading Plans...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch"> {/* Changed items-start to items-stretch for equal height cards */}
          {plans.map((plan) => {
            const planId = plan._id || plan.id;
            const isScholar = plan.name?.toLowerCase().includes("scholar");
            const isSelecting = selectingId === planId;

            return (
              <div
                key={planId}
                className={`relative flex flex-col  p-6 lg:p-8 bg-white rounded-[32px] border-2 transition-all duration-300 group hover:-translate-y-1 ${
                  isScholar 
                    ? "border-[#11d4a4] shadow-[0_20px_40px_-12px_rgba(17,212,164,0.15)] z-10" 
                    : "border-[#e7f3f0] hover:border-[#11d4a4]/50"
                }`}
              >
                {isScholar && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#11d4a4] text-[#0d1b18] text-[10px] font-[900] uppercase tracking-widest py-1.5 px-4 rounded-full shadow-sm whitespace-nowrap">
                    Recommended
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-[900] text-[#0d1b18] mb-1">{plan.name}</h3>
                  <p className="text-sm text-gray-500 font-bold">{plan.code || "Tailored for focus"}</p>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-[900] text-[#0d1b18] tracking-tight">₹{plan.fees}</span>
                  <span className="text-sm font-bold text-gray-400">/ mo</span>
                </div>

                {/* Features List - pushed to middle */}
                <div className="space-y-4 mb-8 flex-grow">
                  {(plan.features || ["Quiet Zone Access", "High-speed Wi-Fi", "Locker Access"]).map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm font-bold text-[#0d1b18]">
                      <div className="mt-0.5 rounded-full bg-[#11d4a4]/10 p-0.5 shrink-0">
                        <Check size={14} className="text-[#11d4a4]" strokeWidth={4} />
                      </div>
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onSelectPlan(plan)}
                  disabled={!!selectingId}
                  className={`w-full py-4 rounded-2xl font-[900] text-sm transition-all flex items-center justify-center gap-2 ${
                    isScholar 
                      ? "bg-[#11d4a4] text-[#0d1b18] hover:opacity-90 shadow-lg shadow-[#11d4a4]/20" 
                      : "bg-[#f6f8f8] text-[#0d1b18] hover:bg-[#e7f3f0]"
                  } disabled:opacity-50`}
                >
                  {isSelecting ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      Select {plan.name}
                      <ArrowRight size={18} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-[#11d4a4]" />
          All plans include 24/7 basic support
        </p>
      </div>
    </OnboardLayout>
  );
};

export default PlanStep;