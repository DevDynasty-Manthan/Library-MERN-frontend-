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
    <div className="w-full">
      {/* Header Info */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="size-12 rounded-full bg-[#11d4a4]/10 flex items-center justify-center mb-4 text-[#11d4a4]">
          <span className="material-symbols-outlined text-2xl">verified_user</span>
        </div>
        <h4 className="text-2xl font-[900] tracking-tight text-white mb-2">Admin Verification</h4>
        <p className="text-gray-400 text-sm font-bold leading-relaxed max-w-xs">
          Please enter the {length}-digit code provided by the library administrator.
        </p>
      </div>

      {/* OTP Input Fields */}
      <div className="flex flex-col items-center gap-8">
        <fieldset className="flex gap-2 sm:gap-3 justify-center items-center">
          {otp.map((val, index) => (
            <React.Fragment key={index}>
              <input
                ref={(el) => (inputsRef.current[index] = el)}
                value={val}
                type="text"
                inputMode="numeric"
                maxLength={1}
                placeholder="•"
                className="
                  flex h-12 w-10 sm:h-14 sm:w-12 text-center 
                  bg-white/5 rounded-lg border border-white/10 
                  focus:border-[#11d4a4] focus:ring-2 focus:ring-[#11d4a4]/20 
                  text-xl font-[900] text-white transition-all 
                  placeholder-gray-600 outline-none
                "
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
              {/* Visual Spacer after the 3rd input if length is 6 */}
              {length === 6 && index === 2 && (
                <div className="flex items-center justify-center w-2 sm:w-4">
                  <div className="w-full h-1 bg-gray-700 rounded-full"></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </fieldset>

        {/* Action / Helper Footer */}
        <div className="w-full flex flex-col gap-4 items-center">
          <div className="flex items-center justify-center gap-1 text-sm font-bold">
            <span className="text-gray-500">Didn't get the code?</span>
            <button
              type="button"
              className="text-[#11d4a4] hover:underline transition-colors"
              onClick={() => {
                setOtp(Array.from({ length }, () => ""));
                inputsRef.current[0]?.focus();
              }}
            >
              Request Again
            </button>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#11d4a4]/5 border border-[#11d4a4]/10">
            <span className="material-symbols-outlined text-[#11d4a4] text-xs">info</span>
            <span className="text-[10px] uppercase font-[900] tracking-widest text-gray-400">
              Auto-verifies on completion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashPaymentOtp;