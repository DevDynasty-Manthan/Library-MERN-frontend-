import React from 'react'
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardLayout from '../../layouts/OnboardLayout.jsx';
import { getAvailablePlans } from '../../features/auth/authApi.js';
import { selectPlan } from '../../features/auth/authApi.js';
import { useAuth } from '../../features/auth/AuthContext.jsx';
const PlanStep = () => {
    const navigate = useNavigate();
//    const { startOnboardingSession } = useAuth();
   const [plans , setPlans] = useState([]);
   useEffect(()=>{
    const fetchPlans = async ()=>{
        try{
            const plans = await getAvailablePlans();
            console.log("Available plans:", plans);
            setPlans(plans.data);
             
        }
        catch(error){
            console.error("Error fetching plans:", error);
        }
    }
    fetchPlans();
   },[])
   console.log("Plans state:", plans);
   
   const onSelectPlan = (plan)=>{


    console.log("Selected plan:", plan);
    const planData = {
        planId: plan._id || plan.id,
        planName: plan.name,
        planCode: plan.code,
        planFees: plan.fees
    } 
    selectPlan(planData)
    .then((response)=>{
        console.log("Plan selection response:", response);
        navigate('/onboarding/seat');
        // Navigate to next step
        // navigate('/onboarding/seat');
    })
    .catch((error)=>{
        console.error("Error selecting plan:", error);
    });

   }


  return (
   <OnboardLayout currentStep={2} totalSteps={4} stepLabels={['Admission','Plan','Seat','Payment']}>
  <div className="space-y-8">
    {/* Header */}
    <div className="text-center">
      <h1 className="text-3xl font-bold text-celadon-900">Choose Your Plan</h1>
      <p className="mt-2 text-celadon-700">Select the plan that best fits your needs.</p>
    </div>

    {/* Loading */}
    {plans.length === 0 ? (
      <div className="rounded-2xl border border-celadon-200 bg-white/70 p-8 text-center text-celadon-700 shadow-sm">
        Loading plans...
      </div>
    ) : (
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <div
            key={plan._id || plan.id}
            className="group rounded-2xl border border-celadon-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            {/* Title */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-celadon-900">{plan.name}</h2>
                <p className="mt-1 text-sm text-celadon-700">{plan.code}</p>
              </div>

              <div className="rounded-xl bg-celadon-50 px-3 py-2 text-right">
                <p className="text-sm text-celadon-700">Monthly</p>
                <p className="text-2xl font-extrabold text-celadon-900">₹{plan.fees}</p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-5 space-y-2">
              {plan.features?.map((feature, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-celadon-800">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-celadon-500" />
                  <p>{feature}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              type="button"
              onClick={() => onSelectPlan(plan)}
              className="mt-6 w-full rounded-xl bg-celadon-600 px-4 py-3 font-semibold text-white shadow-md transition hover:bg-celadon-700"
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</OnboardLayout>

  )
}

export default PlanStep
