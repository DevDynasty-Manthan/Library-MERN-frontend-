import React from "react";
import { CheckCircle, Wifi } from "lucide-react"; //

export default function HeroSection() {
  return (
    <section className="py-12 md:py-24 bg-bg">
      {/* Container ensures exactly 10% side margins (80% width) */}
      <div className="container-wide">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-[1.2] text-center lg:text-left">
            <h1 className="text-6xl md:text-7xl lg:text-[104px] font-[900] leading-[0.95] tracking-[-0.05em] text-text">
              Reserve your <br className="hidden lg:block" /> 
              study seat.{" "}
              <span className="text-primary">Renew monthly.</span> <br className="hidden lg:block" />
              Pay online or cash.
            </h1>

            <p className="mt-8 text-muted text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              A dedicated, quiet space designed for your academic success. 
              Manage your subscription seamlessly with our student-focused portal.
            </p>

            <div className="mt-12 flex flex-wrap gap-5 justify-center lg:justify-start">
              <button className="h-[72px] px-12 rounded-2xl bg-primary text-text font-[900] text-xl hover:bg-primary-hover transition-all shadow-xl shadow-primary/30 active:scale-95">
                Get Started
              </button>
              <button className="h-[72px] px-12 rounded-2xl bg-surface border-2 border-border-2 text-text font-bold text-xl hover:bg-black/5 transition-all">
                View Plans
              </button>
            </div>

            {/* Icon Bar with Lucide Icons */}
            <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-lg font-bold text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle 
                  className="text-primary" 
                  size={28} 
                  strokeWidth={3} // Added strokeWidth to match the "Heavy" look of the reference
                />
                <span className="text-text">Instant confirmation via SMS & Email</span>
              </div>
            </div>
          </div>

          {/* Image Container */}
          <div className="flex-1 w-full">
            <div className="relative w-full aspect-[4/3.5] lg:aspect-[4/3] rounded-[60px] overflow-hidden shadow-2xl border-[10px] border-surface">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
                style={{
                  backgroundImage:
                    'url("https://i.pinimg.com/736x/34/eb/c9/34ebc96d6d7c3e08ba9c64385a1af643.jpg")',
                }}
              />
              <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}