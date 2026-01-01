import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I reserve a seat?",
      answer:
        'Click "Get Started" or "Book a Seat", select your preferred plan, choose an available seat from the seat map, and complete the payment. You\'ll receive instant confirmation via SMS and email.',
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept cash payments at our office, UPI transfers, and online bank transfers. All payment details will be shared after you select your seat.",
    },
    {
      question: "Can I cancel or change my plan?",
      answer:
        "Yes! Monthly and quarterly plans can be cancelled anytime with a 7-day notice. You can upgrade from Normal to AC room anytime. Downgrades take effect from the next billing cycle.",
    },
    {
      question: "What's included in the grace period?",
      answer:
        "Normal Room plans get 5 grace days, while quarterly plans get 7 days. During grace days, your seat remains reserved even if payment is pending. After grace days, your seat may be reassigned.",
    },
    {
      question: "Is there 24/7 access?",
      answer:
        "Yes! Monthly and quarterly plan holders get round-the-clock access with their access card. Daily pass holders can access during library operating hours (6 AM - 11 PM).",
    },
    {
      question: "Can I try before committing to a monthly plan?",
      answer:
        "Absolutely! Book a Daily Pass for ₹50 to experience our study space. If you upgrade to a monthly plan within 3 days, we'll credit ₹50 towards your first month.",
    },
    {
      question: "What happens if I miss a payment?",
      answer:
        "You'll receive payment reminders via SMS and email 3 days before your due date. If payment isn't received within the grace period, your seat will be temporarily suspended until payment is completed.",
    },
    {
      question: "Are lockers included in all plans?",
      answer:
        "Monthly and quarterly plans include a free locker. Daily pass holders can rent a locker for ₹20/day based on availability.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-bg">
      <div className="container-wide">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Frequently asked{" "}
            <span className="text-primary">questions</span>
          </h2>
          <p className="text-muted text-xl leading-relaxed">
            Everything you need to know about StudySpace. Can't find your
            answer?{" "}
            <a href="#contact" className="text-primary font-semibold hover:underline">
              Contact us
            </a>
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-2xl bg-surface overflow-hidden transition-all duration-300 hover:border-primary/50"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-bg/50 transition-colors"
              >
                <span className="text-lg font-bold pr-8">{faq.question}</span>
                <ChevronDown
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  strokeWidth={2.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <p className="px-6 pb-6 text-muted text-base leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
