import React from "react";
import { Check, Star, Zap } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Daily Pass",
      price: "₹50",
      period: "per day",
      description: "Perfect for occasional study sessions",
      popular: false,
      features: [
        "Single day access",
        "Normal room seating",
        "High-speed WiFi",
        "Power outlets at seat",
        "Access during library hours",
      ],
      cta: "Book Daily Pass",
      badge: null,
    },
    {
      name: "Normal Room",
      price: "₹500",
      period: "per month",
      description: "Dedicated seat in well-ventilated study area",
      popular: true,
      features: [
        "Dedicated reserved seat",
        "30-day billing cycle",
        "5 grace days for payment",
        "Small compartment storage",
        "High-speed WiFi included",
        "24/7 access to study space",
        "Locker facility",
      ],
      cta: "Get Started",
      badge: "Most Popular",
    },
    {
      name: "AC Room",
      price: "₹1,000",
      period: "per month",
      description: "Premium air-conditioned study environment",
      popular: false,
      features: [
        "All Normal Room features",
        "Fully air-conditioned space",
        "Larger compartment storage",
        "Priority seating selection",
        "Premium study desk",
        "Extended locker space",
        "Faster WiFi bandwidth",
      ],
      cta: "Go Premium",
      badge: "Premium",
    },
    {
      name: "Quarterly Plan",
      price: "₹1,350",
      period: "per 3 months",
      description: "Best value - Save ₹150 on Normal Room",
      popular: false,
      features: [
        "All Normal Room benefits",
        "Save ₹150 (₹450/month)",
        "90-day billing cycle",
        "Flexible seat transfer (1x/quarter)",
        "Extended grace period (7 days)",
        "Guest passes (2 per quarter)",
        "Priority support",
      ],
      cta: "Save More",
      badge: "Best Value",
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-bg">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Simple, transparent{" "}
            <span className="text-primary">pricing</span>
          </h2>
          <p className="text-muted text-xl leading-relaxed">
            Choose the plan that works best for your study schedule. All monthly
            plans include dedicated seating and core amenities. Cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-primary bg-surface shadow-2xl lg:scale-105"
                  : "border-border bg-surface hover:border-primary/50 hover:shadow-lg"
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                    plan.popular 
                      ? "bg-primary text-text" 
                      : plan.badge === "Premium"
                      ? "bg-text text-bg"
                      : "bg-primary/20 text-primary border-2 border-primary"
                  }`}>
                    {plan.popular && <Star className="w-4 h-4" strokeWidth={2.5} fill="currentColor" />}
                    {plan.badge === "Best Value" && <Zap className="w-4 h-4" strokeWidth={2.5} />}
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted text-base mb-4 min-h-[48px]">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-black tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-muted text-base">
                    /{plan.period.split(" per ")[1] || plan.period.split(" ")[1]}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8 min-h-[280px]">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check
                      className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-text leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full h-12 rounded-xl font-bold text-base transition-all ${
                  plan.popular
                    ? "bg-primary text-text hover:bg-primary-hover shadow-md hover:shadow-lg"
                    : "bg-bg border-2 border-border hover:border-primary hover:bg-primary/5"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-muted text-base">
            All prices include GST. Payment via cash, UPI, or online transfer.
          </p>
          <p className="text-muted text-base">
            Need a custom plan or bulk booking?{" "}
            <a href="#contact" className="text-primary font-semibold hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
