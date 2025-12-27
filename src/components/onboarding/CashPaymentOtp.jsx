import React, { useEffect, useRef, useState } from "react";

const CashPaymentOtp = ({ length = 6, onSubmit }) => {
  const [otp, setOtp] = useState(Array.from({ length }, () => ""));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (inputsRef.current[0]) inputsRef.current[0].focus();
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (value !== "" && isNaN(value)) return;

    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);

    if (value && index < length - 1) inputsRef.current[index + 1]?.focus();
    if (next.every((d) => d !== "")) onSubmit?.(next.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0)
      inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1)
      inputsRef.current[index + 1]?.focus();
  };

  return (
    <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-base font-semibold text-dark-emerald-900">
          Enter admin OTP
        </p>
        <p className="mt-1 text-sm text-dark-emerald-700">
          Enter the {length}-digit OTP to confirm cash payment.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {otp.map((val, index) => (
          <input
            key={index}
            value={val}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="
              h-14 w-12 rounded-2xl border border-ash-grey-200 bg-white
              text-center text-xl font-bold text-dark-emerald-900
              shadow-sm transition
              focus:outline-none focus:ring-2 focus:ring-pine-teal-300/70 focus:border-pine-teal-400
            "
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          className="text-base font-semibold text-pine-teal-700 hover:text-pine-teal-800"
          onClick={() => {
            setOtp(Array.from({ length }, () => ""));
            inputsRef.current[0]?.focus();
          }}
        >
          Clear
        </button>

        <span className="text-sm text-dark-emerald-700">
          Auto-verifies when all digits are entered.
        </span>
      </div>
    </div>
  );
};

export default CashPaymentOtp;
