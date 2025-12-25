import React from 'react'
import PublicLayout from '../../layouts/PublicLayout'
const HomePage = () => {
 return (
    <PublicLayout>
      <section className="relative overflow-hidden h-full flex flex-col">
        {/* constant full-page background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/1a/e2/e3/1ae2e36b4bca01d0e0daf5699c86bbfa.jpg')",
          }}
        />
        {/* dark overlay for readability */}
        <div className="absolute inset-0 bg-evergreen-950/80" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24 flex-1 flex flex-col justify-center">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            {/* LEFT: text content */}
            <div className="flex-1 space-y-6 text-evergreen-50">
              <span className="inline-flex items-center rounded-full bg-evergreen-900/60 px-3 py-1 text-xs font-medium text-frosted-mint-200">
                Private study library · Fixed seating
              </span>

              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Your personal study seat
                <span className="block text-frosted-mint-300">
                  to stay consistent every day.
                </span>
              </h1>

              <p className="max-w-xl text-sm md:text-base text-frosted-mint-100/90">
                Study Point gives you a calm, distraction‑free space with fixed
                seats, clear plans, and simple tracking of your membership and
                due dates—so you only focus on your preparation.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="rounded-full bg-frosted-mint-300 px-6 py-2 text-sm font-semibold text-evergreen-950 shadow-md hover:bg-frosted-mint-200 transition"
                >
                  Get your seat
                </Link>
                <Link
                  to="/plans"
                  className="rounded-full border border-frosted-mint-300/80 bg-transparent px-6 py-2 text-sm font-semibold text-frosted-mint-100 hover:bg-frosted-mint-100/10 transition"
                >
                  View plans
                </Link>
              </div>

              <div className="mt-4 flex flex-wrap gap-6 text-xs md:text-sm text-frosted-mint-100/90">
                <div>
                  <p className="font-semibold text-frosted-mint-200">
                    Fixed seat for you
                  </p>
                  <p>Choose a plan and get your own permanent space.</p>
                </div>
                <div>
                  <p className="font-semibold text-frosted-mint-200">
                    Flexible timings
                  </p>
                  <p>Perfect for college, job and exam prep.</p>
                </div>
              </div>
            </div>

            {/* RIGHT: student image card (on top of same bg) */}
            <div className="flex-1 w-full max-w-md">
              <div className="overflow-hidden rounded-3xl bg-evergreen-900/70 border border-frosted-mint-200/20 shadow-xl">
                <div className="relative h-64 md:h-80">
                  <img
                    src="https://i.pinimg.com/1200x/4a/39/79/4a3979b4d28e2e48f018a3444d4dd415.jpg"
                    alt="Student studying in library compartment"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-evergreen-950/25" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl bg-evergreen-950/80 px-4 py-3 text-xs text-frosted-mint-100">
                    <div>
                      <p className="font-semibold">Silent Study Zone</p>
                      <p className="text-[11px] text-frosted-mint-100/80">
                        Individual cabins with power outlets and soft lighting.
                      </p>
                    </div>
                    <span className="rounded-full bg-frosted-mint-300/20 px-3 py-1 text-[11px] text-frosted-mint-200">
                      Limited seats
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export default HomePage
import { Link } from "react-router-dom";


