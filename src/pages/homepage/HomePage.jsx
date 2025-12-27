import React from "react";
import { Link } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";

const HomePage = () => {
  return (
    <PublicLayout>
      <section className="relative flex h-full flex-col overflow-hidden">
        {/* constant full-page background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://i.pinimg.com/1200x/1a/e2/e3/1ae2e36b4bca01d0e0daf5699c86bbfa.jpg')",
          }}
        />

        {/* dark overlay for readability */}
        <div className="absolute inset-0 bg-dark-emerald-950/85" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-1 flex-col justify-center px-6 py-16 md:py-24">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            {/* LEFT: text content */}
            <div className="flex-1 space-y-7 text-platinum-50">
              <span className="inline-flex items-center rounded-full bg-dark-emerald-900/60 px-4 py-2 text-sm font-semibold text-pine-teal-200">
                Private study library · Fixed seating
              </span>

              <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                Your personal study seat
                <span className="block text-pine-teal-200">
                  to stay consistent every day.
                </span>
              </h1>

              <p className="max-w-xl text-base text-platinum-200/90 md:text-lg">
                Study Point gives you a calm, distraction‑free space with fixed
                seats, clear plans, and simple tracking of your membership and
                due dates—so you only focus on your preparation.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="rounded-2xl bg-pine-teal-600 px-7 py-3 text-base font-semibold text-dark-emerald-950 shadow-lg transition hover:bg-pine-teal-500 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/70"
                >
                  Get your seat
                </Link>

                <Link
                  to="/plans"
                  className="rounded-2xl border border-pine-teal-300/60 bg-transparent px-7 py-3 text-base font-semibold text-platinum-100 transition hover:bg-dark-emerald-900/40 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
                >
                  View plans
                </Link>
              </div>

              <div className="mt-5 grid gap-6 text-sm text-platinum-200/90 sm:grid-cols-2">
                <div className="rounded-2xl border border-dark-emerald-800/60 bg-dark-emerald-950/30 p-5">
                  <p className="font-semibold text-pine-teal-200">
                    Fixed seat for you
                  </p>
                  <p className="mt-1">
                    Choose a plan and get your own permanent space.
                  </p>
                </div>

                <div className="rounded-2xl border border-dark-emerald-800/60 bg-dark-emerald-950/30 p-5">
                  <p className="font-semibold text-pine-teal-200">
                    Flexible timings
                  </p>
                  <p className="mt-1">Perfect for college, job and exam prep.</p>
                </div>
              </div>
            </div>

            {/* RIGHT: student image card */}
            <div className="w-full max-w-md flex-1">
              <div className="overflow-hidden rounded-3xl border border-platinum-300/20 bg-dark-emerald-900/50 shadow-xl">
                <div className="relative h-72 md:h-96">
                  <img
                    src="https://i.pinimg.com/1200x/4a/39/79/4a3979b4d28e2e48f018a3444d4dd415.jpg"
                    alt="Student studying in library compartment"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-dark-emerald-950/25" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-dark-emerald-950/80 px-5 py-4 text-sm text-platinum-100">
                    <div>
                      <p className="font-semibold text-platinum-50">
                        Silent Study Zone
                      </p>
                      <p className="mt-1 text-xs text-platinum-200/80">
                        Individual cabins with power outlets and soft lighting.
                      </p>
                    </div>

                    <span className="rounded-full bg-pine-teal-500/20 px-4 py-2 text-xs font-semibold text-pine-teal-200">
                      Limited seats
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* small bottom highlight row */}
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              { title: "Clean & quiet", desc: "Distraction‑free environment." },
              { title: "Simple plans", desc: "Clear pricing and duration." },
              { title: "Track dues", desc: "Know your renewal dates." },
            ].map((x) => (
              <div
                key={x.title}
                className="rounded-2xl border border-dark-emerald-800/60 bg-dark-emerald-950/30 p-5"
              >
                <p className="text-lg font-semibold text-pine-teal-200">
                  {x.title}
                </p>
                <p className="mt-1 text-sm text-platinum-200/80">{x.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;
