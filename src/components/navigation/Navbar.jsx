import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext.jsx";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-emerald-800 bg-dark-emerald-950/95 text-platinum-50 backdrop-blur">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        {/* Left: logo + title */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-pine-teal-500 ring-1 ring-pine-teal-300/60">
            <img
              src="https://i.pinimg.com/736x/13/ea/9d/13ea9d70df14a98b23f51fb7b8b663bb.jpg"
              alt="Study Point logo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="leading-tight">
            <div className="text-lg font-semibold tracking-tight text-platinum-50 md:text-xl">
              Study Point
            </div>
            <div className="text-sm text-platinum-200 group-hover:text-pine-teal-200 transition">
              Private study library
            </div>
          </div>
        </Link>

        {/* Center links (desktop) */}
        <div className="hidden items-center gap-8 text-base text-platinum-200 md:flex">
          <Link to="/" className="transition hover:text-pine-teal-200">
            Home
          </Link>
          <Link to="/about" className="transition hover:text-pine-teal-200">
            About
          </Link>
          <Link to="/plans" className="transition hover:text-pine-teal-200">
            Plans
          </Link>
          <Link to="/contacts" className="transition hover:text-pine-teal-200">
            Contacts
          </Link>
        </div>

        {/* Right actions (desktop) */}
        <div className="hidden items-center gap-3 sm:flex">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/student/dashboard")}
                className="rounded-2xl border border-pine-teal-300/50 bg-dark-emerald-900/40 px-5 py-3 text-base font-semibold text-platinum-50 shadow-lg transition hover:bg-dark-emerald-900/60 hover:border-pine-teal-200/70 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
              >
                Profile ({user?.name || "Student"})
              </button>

              <button
                onClick={handleLogout}
                className="rounded-2xl bg-pine-teal-600 px-5 py-3 text-base font-semibold text-dark-emerald-950 shadow-lg transition hover:bg-pine-teal-500 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-2xl border border-platinum-300/30 px-4 py-2.5 text-base text-platinum-100 transition hover:border-pine-teal-300/60 hover:text-pine-teal-100 hover:bg-dark-emerald-900/30"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-2xl bg-pine-teal-600 px-5 py-2.5 text-base font-semibold text-dark-emerald-950 transition hover:bg-pine-teal-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu icon */}
        <button
          className="inline-flex items-center justify-center rounded-xl p-3 text-platinum-100 hover:bg-dark-emerald-900/50 sm:hidden"
          aria-label="Open menu"
        >
          <span className="block h-0.5 w-6 bg-platinum-100" />
          <span className="mt-1.5 block h-0.5 w-6 bg-platinum-100" />
          <span className="mt-1.5 block h-0.5 w-6 bg-platinum-100" />
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
