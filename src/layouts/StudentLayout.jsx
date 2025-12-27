import React from "react";
import { Outlet, Link } from "react-router-dom";
import StudentSidebar from "../components/student/StudentSidebar.jsx";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-ash-grey-50">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <StudentSidebar />

        {/* Right area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-10 border-b border-ash-grey-200 bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between px-6 py-4">
              {/* Logo / Home */}
              <Link to="/" className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-pine-teal-600 text-base font-bold text-dark-emerald-950">
                  L
                </div>

                <div className="leading-tight">
                  <div className="text-lg font-semibold text-dark-emerald-900">
                    Library
                  </div>
                  <div className="text-sm text-dark-emerald-700">
                    Back to Home
                  </div>
                </div>
              </Link>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Link
                  to="/student/dashboard"
                  className="rounded-2xl border border-ash-grey-200 bg-white px-5 py-3 text-base font-semibold text-dark-emerald-800 transition hover:bg-pine-teal-50 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
                >
                  Dashboard
                </Link>

                <button className="rounded-2xl bg-pine-teal-600 px-5 py-3 text-base font-semibold text-dark-emerald-950 transition hover:bg-pine-teal-500 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60">
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-6 py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
