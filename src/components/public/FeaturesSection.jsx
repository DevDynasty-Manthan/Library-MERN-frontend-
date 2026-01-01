import React from "react";
import { Wifi, Clock, Lock, Users, CreditCard, CheckCircle2 } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description:
        "Lightning-fast internet connectivity with dedicated bandwidth for uninterrupted studying.",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description:
        "Study on your schedule with round-the-clock access to your reserved seat.",
    },
    {
      icon: Lock,
      title: "Secure Lockers",
      description:
        "Personal storage lockers to keep your belongings safe while you focus on learning.",
    },
    {
      icon: Users,
      title: "Quiet Environment",
      description:
        "Distraction-free zones designed specifically for serious students and professionals.",
    },
    {
      icon: CreditCard,
      title: "Flexible Payment",
      description:
        "Pay monthly via online transfer, UPI, or cash. Cancel anytime with no penalties.",
    },
    {
      icon: CheckCircle2, // Matches the reference style better
      title: "Instant Booking",
      description:
        "Reserve your seat in seconds with instant confirmation via SMS and email.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-bg">
      <div className="container-wide">
        {/* Header - Massive and Tight like the Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-5xl md:text-7xl lg:text-[84px] font-[900] leading-[0.95] tracking-[-0.05em] text-text mb-8">
            Everything you need to <br className="hidden md:block" />
            <span className="text-primary">focus and succeed</span>
          </h2>
          <p className="text-muted text-xl lg:text-2xl font-medium max-w-2xl mx-auto tracking-tight leading-relaxed">
            Premium amenities designed to create the perfect study
            environment for dedicated learners.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-10 rounded-[32px] border border-border bg-white hover:border-primary/40 hover:shadow-[0_20px_40px_-15px_rgba(17,212,164,0.1)] transition-all duration-500"
              >
                {/* Icon Box */}
                <div className="w-16 h-16 rounded-2xl bg-bg border border-border flex items-center justify-center mb-8 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                  <Icon 
                    className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-500" 
                    strokeWidth={2.5} 
                  />
                </div>
                
                {/* Text Content */}
                <h3 className="text-2xl font-[900] text-text mb-4 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-muted text-[17px] font-semibold leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}