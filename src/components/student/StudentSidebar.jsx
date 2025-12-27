import React from "react";
import { NavLink, Link } from "react-router-dom";

const baseLink =
  "flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60";

const StudentSidebar = () => {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-ash-grey-200 bg-white md:block">
      <div className="px-5 py-5">
        {/* Sidebar header */}
        <Link to="/student/dashboard" className="block">
          <div className="rounded-3xl border border-ash-grey-200 bg-ash-grey-50 px-4 py-4">
            <p className="text-lg font-semibold text-dark-emerald-900">Student</p>
            <p className="mt-1 text-sm text-dark-emerald-700">Library Portal</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="mt-5 space-y-2">
          <NavLink
            to="/student/dashboard"
            className={({ isActive }) =>
              `${baseLink} ${
                isActive
                  ? "bg-pine-teal-600 text-dark-emerald-950 shadow-sm"
                  : "text-dark-emerald-800 hover:bg-pine-teal-50"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/student/payments"
            className={({ isActive }) =>
              `${baseLink} ${
                isActive
                  ? "bg-pine-teal-600 text-dark-emerald-950 shadow-sm"
                  : "text-dark-emerald-800 hover:bg-pine-teal-50"
              }`
            }
          >
            Payments
          </NavLink>

          <NavLink
            to="/student/profile"
            className={({ isActive }) =>
              `${baseLink} ${
                isActive
                  ? "bg-pine-teal-600 text-dark-emerald-950 shadow-sm"
                  : "text-dark-emerald-800 hover:bg-pine-teal-50"
              }`
            }
          >
            Profile
          </NavLink>
        </nav>

        {/* Bottom action */}
        <div className="mt-6 border-t border-ash-grey-200 pt-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseLink} ${
                isActive
                  ? "bg-pine-teal-600 text-dark-emerald-950 shadow-sm"
                  : "text-dark-emerald-800 hover:bg-pine-teal-50"
              }`
            }
          >
            Home
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;
