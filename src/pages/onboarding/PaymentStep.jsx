import React, { useEffect, useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { createOrder, verifyPayment } from "../../features/auth/authApi.js";

const loadRazorpayScript = (src) =>
  new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const PaymentStep = () => {
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

 const handleMethod = async (selected) => {
  setMethod(selected);
  if (selected !== "online") return;

  try {
    setLoading(true);

    const ok = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!ok) throw new Error("Razorpay script failed to load");

    // Don’t send amount from client
    const orderRes = await createOrder(); 
    // expected: { ok:true, data:{ orderId, amount, currency, keyId } }
    const payload = orderRes.data; // because backend returns { ok, msg, data: {...} }

    const options = {
      key: "rzp_test_RvOU1OoGPgDQEO",
      amount: payload.amount,
      currency: payload.currency,
      order_id: payload.orderId,
      name: "Admission",
      description: `Plan ${payload.planCode}`,
      handler: async (rpRes) => {
        // Razorpay returns these fields in handler. [web:385]
        await verifyPayment({
          orderId: rpRes.razorpay_order_id,
          paymentId: rpRes.razorpay_payment_id,
          signature: rpRes.razorpay_signature,
        });
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.log("Create order / pay failed:", err?.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <OnboardLayout currentStep={4} totalSteps={4} stepLabels={["Admission","Plan","Seat","Payment"]}>
      <div className="mx-auto w-full max-w-xl">
        <h2 className="text-xl font-semibold text-slate-900">Choose payment method</h2>
        <p className="mt-1 text-sm text-slate-600">
          Cash requires verification. Online opens Razorpay Checkout.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleMethod("cash")}
            className="rounded-lg border border-slate-200 bg-white p-4 text-left hover:bg-slate-50"
            disabled={loading}
          >
            <div className="text-sm font-medium text-slate-900">Cash</div>
            <div className="mt-1 text-xs text-slate-600">Verify with admin OTP.</div>
          </button>

          <button
            type="button"
            onClick={() => handleMethod("online")}
            className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left hover:bg-emerald-100 disabled:opacity-60"
            disabled={loading}
          >
            <div className="text-sm font-medium text-emerald-900">Online</div>
            <div className="mt-1 text-xs text-emerald-800">UPI / Card / Netbanking</div>
          </button>
        </div>

        {loading && (
          <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700">
            Creating order...
          </div>
        )}

        {method === "cash" && !loading && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Cash flow next: show OTP input + “Request OTP” for admin verification.
          </div>
        )}
      </div>
    </OnboardLayout>
  );
};

export default PaymentStep;
