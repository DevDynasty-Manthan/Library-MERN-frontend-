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
    if (e.key === "Backspace" && !otp[index] && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowLeft" && index > 0) inputsRef.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  return (
    <div className="rounded-xl border border-evergreen-200 bg-frosted-mint-50 p-4">
      <div className="mb-3">
        <p className="text-sm font-semibold text-evergreen-900">Enter admin OTP</p>
        <p className="mt-1 text-xs text-evergreen-800">
          Enter the {length}-digit OTP to confirm cash payment.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {otp.map((val, index) => (
          <input
            key={index}
            value={val}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className="
              h-12 w-11 rounded-lg border border-evergreen-200 bg-white
              text-center text-lg font-bold text-evergreen-900
              shadow-sm transition
              focus:outline-none focus:ring-2 focus:ring-evergreen-400 focus:border-evergreen-400
            "
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          className="text-sm font-semibold text-pine-teal-700 hover:text-pine-teal-800"
          onClick={() => {
            setOtp(Array.from({ length }, () => ""));
            inputsRef.current[0]?.focus();
          }}
        >
          Clear
        </button>

        <span className="text-xs text-evergreen-700">
          Auto-verifies when all digits are entered.
        </span>
      </div>
    </div>
  );
};

export default CashPaymentOtp;
