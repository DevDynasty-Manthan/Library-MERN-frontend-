import React from "react";
import { UserPlus, CalendarDays, Armchair, Wallet, BookOpen } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Register",
      text: "Create your free student account.",
      step: "1"
    },
    {
      icon: CalendarDays,
      title: "Plan",
      text: "Choose Daily, Weekly or Monthly.",
      step: "2"
    },
    {
      icon: Armchair,
      title: "Seat",
      text: "Select your preferred desk on map.",
      step: "3"
    },
    {
      icon: Wallet,
      title: "Pay",
      text: "Secure online or cash with OTP.",
      step: "4"
    },
    {
      icon: BookOpen,
      title: "Study",
      text: "Check-in and start focusing.",
      step: "Check"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="container-wide">
        {/* Section Header */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl lg:text-[84px] font-[900] leading-[0.95] tracking-[-0.05em] text-text">
            How it <span className="text-primary">works.</span>
          </h2>
          <p className="mt-8 text-muted text-xl lg:text-2xl font-medium tracking-tight">
            Follow these simple steps to secure your dedicated study spot.
          </p>
        </div>

        {/* Steps Grid - 5 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Step Number Badge */}
                <div className="mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary text-text font-[900] text-xl flex items-center justify-center shadow-lg shadow-primary/20">
                    {step.step === "Check" ? "✓" : step.step}
                  </div>
                  {/* Decorative line between steps for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block h-[2px] flex-1 bg-border-2 mt-0"></div>
                  )}
                </div>

                <div className="p-8 rounded-[32px] border border-border bg-bg/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 min-h-[240px]">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center mb-6 shadow-sm group-hover:border-primary/50 transition-colors">
                    <Icon className="text-primary" size={28} strokeWidth={2.5} />
                  </div>

                  <h3 className="text-2xl font-[900] text-text mb-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted text-base font-semibold leading-snug">
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}