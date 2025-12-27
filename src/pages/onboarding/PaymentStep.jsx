import React, { useEffect, useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { createOrder, verifyPayment } from "../../features/auth/authApi.js";
import { useNavigate } from "react-router-dom";
import {
  sendOtpForVerification,
  verifyOtp as verifyOtpApi,
} from "../../features/auth/authApi.js";
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
  const navigate = useNavigate();
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const handleVerifyOtp = async (otp) => {
    try {
      setLoading(true);
      const result = await verifyOtpApi({ OTP: otp });
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

    // Cash flow: only send OTP + show input
    if (selected === "cash") {
      try {
        setLoading(true);
        const result = await sendOtpForVerification();
        console.log("OTP send result:", result);
      } catch (err) {
        console.error(
          "sendOtpForVerification failed:",
          err?.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
      return;
    }

    // Online flow: open Razorpay
    try {
      setLoading(true);

      const ok = await loadRazorpayScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
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
    <OnboardLayout
      currentStep={4}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark-emerald-900">
            Choose Payment Method
          </h2>
          <p className="mt-2 text-base text-dark-emerald-700">
            Select how you'd like to proceed with your admission payment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* CASH */}
          <button
            type="button"
            onClick={() => handleMethod("cash")}
            disabled={loading}
            className="
              group relative rounded-2xl border-2 border-ash-grey-200 bg-white p-6 text-left
              transition-all duration-200
              hover:border-pine-teal-300 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-lg font-semibold text-dark-emerald-900">
                  Cash Payment
                </div>
                <div className="mt-1 text-base text-dark-emerald-700">
                  Verify with admin OTP
                </div>
              </div>
              <div className="ml-3 text-3xl">💵</div>
            </div>
          </button>

          {/* ONLINE */}
          <button
            type="button"
            onClick={() => handleMethod("online")}
            disabled={loading}
            className="
              group relative rounded-2xl border-2 border-pine-teal-200
              bg-gradient-to-br from-pine-teal-50 to-ash-grey-50
              p-6 text-left
              transition-all duration-200
              hover:border-pine-teal-300 hover:shadow-md
              focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60
              disabled:cursor-not-allowed disabled:opacity-50
            "
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-lg font-semibold text-dark-emerald-900">
                  Online Payment
                </div>
                <div className="mt-1 text-base text-dark-emerald-700">
                  UPI, Card, Netbanking
                </div>
              </div>
              <div className="ml-3 text-3xl">💳</div>
            </div>
          </button>
        </div>

        {loading && (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-5">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-ash-grey-300 border-t-pine-teal-600" />
            <span className="text-base font-semibold text-dark-emerald-900">
              Processing...
            </span>
          </div>
        )}

        {method === "cash" && !loading && (
          <div className="mt-6 space-y-4 rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-5">
            <div className="flex gap-3">
              <div className="text-2xl">⏳</div>
              <div>
                <div className="text-lg font-semibold text-dark-emerald-900">
                  Cash Payment Pending
                </div>
                <p className="mt-1 text-base text-dark-emerald-700">
                  An OTP was sent to verify your cash payment with the admin.
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
