import React, { useEffect, useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { createOrder, verifyPayment } from "../../features/auth/authApi.js";
import { useNavigate } from "react-router-dom";
import { sendOtpForVerification,verifyOtp as verifyOtpApi } from "../../features/auth/authApi.js";
import CashPaymentOtp from "../../components/onboarding/CashPaymentOtp.jsx";

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
  const navigate = useNavigate(); // rename
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);
   //verify the otp
   const handleVerifyOtp = async (otp) => {
    try {
      setLoading(true);
      const result = await verifyOtpApi({ OTP: otp }); // adjust shape to your backend
      console.log("verify otp result:", result);

     if (result.ok) {
      navigate(`/student/${result.data.studentId}`);
    } else {
      alert(result.msg || "OTP verification failed");
    }

    } catch (error) {
      console.error("verifyOtp failed:", error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };



  const handleMethod = async (selected) => {
    setMethod(selected);
    if (selected === "cash") {
    try {
      setLoading(true);
      const result = await sendOtpForVerification();
      console.log("OTP send result:", result);
    } catch (err) {
      console.error("sendOtpForVerification failed:", err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
    return; // IMPORTANT: stop here, don't open Razorpay
  }

    try {
      setLoading(true);

      const ok = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok) throw new Error("Razorpay script failed to load");

      const orderRes = await createOrder();
      const payload = orderRes.data;

      const options = {
        key: "rzp_test_RvOU1OoGPgDQEO",
        amount: payload.amount,
        currency: payload.currency,
        order_id: payload.orderId,
        name: "Admission",
        description: `Plan ${payload.planCode}`,
        handler: async (rpRes) => {
          const result = await verifyPayment({
            orderId: rpRes.razorpay_order_id,
            paymentId: rpRes.razorpay_payment_id,
            signature: rpRes.razorpay_signature,
          });

          if (result.ok) {
            navigate(`/student/${result.data.studentId}`);
          }
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
    <OnboardLayout currentStep={4} totalSteps={4} stepLabels={["Admission", "Plan", "Seat", "Payment"]}>
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-evergreen-900">Choose Payment Method</h2>
          <p className="mt-2 text-sm text-evergreen-800">
            Select how you'd like to proceed with your admission payment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleMethod("cash")}
            disabled={loading}
            className="
              group relative rounded-xl border-2 border-evergreen-200 bg-white p-5 text-left
              transition-all duration-200
              hover:border-pine-teal-300 hover:shadow-md
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-base font-semibold text-evergreen-900">Cash Payment</div>
                <div className="mt-1 text-sm text-evergreen-700">Verify with admin OTP</div>
              </div>
              <div className="ml-3 text-2xl">💵</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleMethod("online")}
            disabled={loading}
            className="
              group relative rounded-xl border-2 border-frosted-mint-300
              bg-linear-to-br from-frosted-mint-50 to-celadon-50
              p-5 text-left
              transition-all duration-200
              hover:border-frosted-mint-400 hover:shadow-lg hover:shadow-frosted-mint-100
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-base font-semibold text-evergreen-900">Online Payment</div>
                <div className="mt-1 text-sm text-evergreen-700">UPI, Card, Netbanking</div>
              </div>
              <div className="ml-3 text-2xl">💳</div>
            </div>
          </button>
        </div>

        {loading && (
          <div className="mt-6 flex items-center gap-3 rounded-lg border border-evergreen-200 bg-frosted-mint-50 p-4">
            <div className="flex h-5 w-5 animate-spin rounded-full border-2 border-evergreen-300 border-t-evergreen-700"></div>
            <span className="text-sm font-semibold text-evergreen-900">Processing your order...</span>
          </div>
        )}

        {method === "cash" && !loading && (
          <div className="mt-6 space-y-4 rounded-lg border-l-4 border-pine-teal-500 bg-frosted-mint-50 p-4">
            <div className="flex gap-3">
              <div className="text-xl">⏳</div>
              <div>
                <div className="font-semibold text-evergreen-900">Cash Payment Pending</div>
                <p className="mt-1 text-sm text-evergreen-800">
                  An OTP will be sent to verify your cash payment with the admin.
                </p>
              </div>
            </div>

            <CashPaymentOtp length={6} onSubmit={handleVerifyOtp} />
          </div>
        )}
      </div>
    </OnboardLayout>
  );
};

export default PaymentStep;
