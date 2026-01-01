import React from "react";
import HeroSection from "../../components/public/HeroSection.jsx";
import FeaturesSection from "../../components/public/FeaturesSection.jsx";
import PricingSection from "../../components/public/PricingSection.jsx";
import HowItWorks from "../../components/public/HowItWorks.jsx";
import FAQSection from "../../components/public/FAQSection.jsx";
import ReviewsSection from "../../components/public/ReviewsSection.jsx";
import ContactSection from "../../components/public/Contact.jsx";



export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection/>
      <HowItWorks/>
      <PricingSection/>
      <FAQSection/>
      <ReviewsSection/>
      <ContactSection/>
    </>
  );
}
