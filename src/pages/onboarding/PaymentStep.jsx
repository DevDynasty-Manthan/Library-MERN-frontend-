import React, { useEffect, useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { createOrder, verifyPayment } from "../../features/auth/authApi.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import {
  sendOtpForVerification,
  verifyOtp as verifyOtpApi,
} from "../../features/auth/authApi.js";
import CashPaymentOtp from "../../components/onboarding/CashPaymentOtp.jsx";
import { Loader2, CreditCard, Banknote, ShieldCheck, Info, ArrowRight } from "lucide-react";

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
  const { login } = useAuth();
  const [method, setMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const handleVerifyOtp = async (otp) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔐 Submitting OTP:", otp);
      
      const result = await verifyOtpApi({ OTP: otp });
      
      console.log("✅ OTP Verification Response:", result);
      
      if (result.ok) {
        // ✅ Pass full result object - AuthContext will extract result.data.token and result.data.user
        login(result.data);
        
        console.log("✅ User logged in successfully");
        console.log("📦 localStorage.token:", localStorage.getItem("token")?.substring(0, 30) + "...");
        console.log("📦 localStorage.user:", localStorage.getItem("user"));
        
        // Navigate to profile
        navigate("/student/profile", { replace: true });
      } else {
        setError(result.msg || "OTP verification failed");
      }
    } catch (error) {
      console.error("❌ OTP verification failed:", error);
      setError(error?.response?.data?.msg || error?.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMethod = async (selected) => {
    setMethod(selected);
    setError(null);

    if (selected === "cash") {
      try {
        setLoading(true);
        const response = await sendOtpForVerification();
        
        console.log("📧 OTP sent successfully:", response);
        
        if (!response.ok) {
          setError("Failed to send OTP. Please try again.");
        }
      } catch (err) {
        console.error("❌ Failed to send OTP:", err);
        setError(err?.response?.data?.msg || err?.message || "Failed to send OTP");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Online payment flow
    try {
      setLoading(true);
      const ok = await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!ok) throw new Error("Razorpay script failed to load");

      const orderRes = await createOrder();
      const payload = orderRes.data;

      console.log("💳 Order created:", payload);

      const options = {
        key: "rzp_test_RvOU1OoGPgDQEO",
        amount: payload.amount,
        currency: payload.currency,
        order_id: payload.orderId,
        name: "StudySpace Admission",
        description: `Plan: ${payload.planCode}`,
        handler: async (rpRes) => {
          try {
            setLoading(true);
            
            console.log("🔐 Verifying payment:", rpRes.razorpay_order_id);
            
            const result = await verifyPayment({
              orderId: rpRes.razorpay_order_id,
              paymentId: rpRes.razorpay_payment_id,
              signature: rpRes.razorpay_signature,
            });

            console.log("✅ Payment Verification Response:", result);

            if (result.ok) {
              // ✅ Pass full result object - AuthContext will extract result.data.token and result.data.user
              login(result.data);
              
              console.log("✅ User logged in successfully");
              console.log("📦 After login() called:");
              console.log("   localStorage.token:", localStorage.getItem("token")?.substring(0, 30) + "...");
              console.log("   localStorage.user:", localStorage.getItem("user"));

              const storedUser = JSON.parse(localStorage.getItem("user"));
              console.log("   Parsed user:", storedUser);
              console.log("   User name:", storedUser?.name);
              
              // Navigate to profile
              navigate("/student/profile", { replace: true });
            } else {
              setError(result.msg || "Payment verification failed");
              setLoading(false);
            }
          } catch (err) {
            console.error("❌ Payment verification error:", err);
            setError(err?.response?.data?.msg || err?.message || "Payment verification failed");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment cancelled. Please try again.");
          }
        },
        theme: {
          color: "#11d4a4"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false); // Reset loading after modal opens
    } catch (err) {
      console.error("❌ Payment order creation failed:", err);
      setError(err?.response?.data?.msg || err?.message || "Failed to create payment order");
      setLoading(false);
    }
  };

  return (
    <OnboardLayout
      currentStep={4}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-[900] text-[#0d1b18] tracking-tight mb-4">
            Finalize Admission
          </h1>
          <p className="text-lg text-gray-500 font-bold max-w-md mx-auto">
            Choose your preferred payment method to secure your study space.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Info size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 font-bold text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ONLINE OPTION */}
          <button
            type="button"
            onClick={() => handleMethod("online")}
            disabled={loading}
            className={`group relative flex flex-col p-8 rounded-[32px] border-2 transition-all text-left ${
              method === "online"
                ? "border-[#11d4a4] bg-[#f6f8f8] shadow-lg shadow-[#11d4a4]/10"
                : "border-[#e7f3f0] bg-white hover:border-[#11d4a4]/50"
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
              method === "online" ? "bg-[#11d4a4] text-[#0d1b18]" : "bg-[#f6f8f8] text-gray-400 group-hover:text-[#11d4a4]"
            }`}>
              <CreditCard size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-[900] text-[#0d1b18] mb-2">Online Payment</h3>
            <p className="text-sm text-gray-500 font-bold leading-relaxed mb-6">
              Instant activation via UPI, Cards, or Netbanking.
            </p>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-[900] uppercase tracking-widest text-[#11d4a4]">
              Secure Transaction <ArrowRight size={14} />
            </div>
          </button>

          {/* CASH OPTION */}
          <button
            type="button"
            onClick={() => handleMethod("cash")}
            disabled={loading}
            className={`group relative flex flex-col p-8 rounded-[32px] border-2 transition-all text-left ${
              method === "cash"
                ? "border-[#11d4a4] bg-[#f6f8f8] shadow-lg shadow-[#11d4a4]/10"
                : "border-[#e7f3f0] bg-white hover:border-[#11d4a4]/50"
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
              method === "cash" ? "bg-[#11d4a4] text-[#0d1b18]" : "bg-[#f6f8f8] text-gray-400 group-hover:text-[#11d4a4]"
            }`}>
              <Banknote size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-[900] text-[#0d1b18] mb-2">Cash at Desk</h3>
            <p className="text-sm text-gray-500 font-bold leading-relaxed mb-6">
              Pay at the library reception. Requires admin OTP.
            </p>
            <div className="mt-auto flex items-center gap-2 text-[10px] font-[900] uppercase tracking-widest text-gray-400">
              Manual Verification <ArrowRight size={14} />
            </div>
          </button>
        </div>

        {/* Status / OTP Area */}
        <div className="mt-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-[#11d4a4] bg-[#f6f8f8] rounded-[32px] border-2 border-[#e7f3f0]">
              <Loader2 className="animate-spin mb-4" size={32} strokeWidth={2.5} />
              <p className="font-[900] uppercase tracking-widest text-xs text-gray-400">
                {method === "cash" ? "Verifying OTP..." : "Processing Payment..."}
              </p>
            </div>
          ) : method === "cash" && (
            <div className="bg-[#0d1b18] text-white p-8 rounded-[32px] shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-4 mb-8">
                <div className="bg-[#11d4a4]/20 p-3 rounded-2xl text-[#11d4a4]">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-[900] tracking-tight">Admin Verification</h3>
                  <p className="text-sm text-gray-400 font-bold">Please enter the 6-digit OTP provided by the library administrator.</p>
                </div>
              </div>
              
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <CashPaymentOtp length={6} onSubmit={handleVerifyOtp} />
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-500 font-bold">
                <Info size={14} className="text-[#11d4a4]" />
                Your seat will be confirmed once the OTP is verified.
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-12 flex items-center justify-center gap-6 opacity-40 grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-4" />
          <div className="h-4 w-px bg-gray-300" />
          <p className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#0d1b18]">SSL Encrypted</p>
        </div>
      </div>
    </OnboardLayout>
  );
};

export default PaymentStep;
