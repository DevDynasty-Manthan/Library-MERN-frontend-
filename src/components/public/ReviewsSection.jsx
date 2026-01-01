import React from "react";
import { Star, Quote } from "lucide-react";

export default function ReviewsSection() {
  const reviews = [
    {
      name: "Priya Sharma",
      role: "Engineering Student",
      review:
        "The AC room is perfect for long study sessions. Great WiFi and the dedicated seat makes all the difference during exam prep.",
      image: "https://ui-avatars.com/api/?name=Priya+Sharma&background=11d4a4&color=0d1b18&bold=true",
    },
    {
      name: "Rahul Verma",
      role: "UPSC Aspirant",
      review:
        "Best decision I made! Quiet environment, comfortable seating, and 24/7 access helped me stay consistent with my preparation.",
      image: "https://ui-avatars.com/api/?name=Rahul+Verma&background=11d4a4&color=0d1b18&bold=true",
    },
    {
      name: "Anita Desai",
      role: "MBA Student",
      review:
        "Monthly plan is super affordable. The locker facility and reserved seat mean I can just come and start working immediately.",
      image: "https://ui-avatars.com/api/?name=Anita+Desai&background=11d4a4&color=0d1b18&bold=true",
    },
    {
      name: "Karan Patel",
      role: "CA Student",
      review:
        "Tried daily pass first, then upgraded to quarterly. The savings are real and the study environment is consistently excellent.",
      image: "https://ui-avatars.com/api/?name=Karan+Patel&background=11d4a4&color=0d1b18&bold=true",
    },
  ];

  return (
    <section id="reviews" className="py-24 bg-bg">
      <div className="container-wide">
        {/* Header - Massive Text matching the Hero */}
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl lg:text-[84px] font-[900] leading-[0.95] tracking-[-0.05em] text-text">
            Loved by <br />
            <span className="text-primary">students.</span>
          </h2>
          <p className="mt-8 text-muted text-xl lg:text-2xl font-medium tracking-tight max-w-2xl">
            Join hundreds of successful students who chose StudySpace for their
            academic journey.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-[40px] border border-border bg-white hover:border-primary/40 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col justify-between"
            >
              <div>
                {/* Floating Quote Icon */}
                <div className="mb-8 w-12 h-12 rounded-2xl bg-bg flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Quote className="text-primary" size={24} fill="currentColor" fillOpacity={0.1} />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-primary"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-text text-[17px] font-semibold leading-relaxed mb-10 italic">
                  "{review.review}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-border group-hover:ring-primary/20 transition-all"
                />
                <div>
                  <p className="font-[900] text-lg text-text tracking-tight leading-none mb-1">
                    {review.name}
                  </p>
                  <p className="text-muted text-sm font-bold uppercase tracking-wider">
                    {review.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}