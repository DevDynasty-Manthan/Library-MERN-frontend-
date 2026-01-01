import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, CreditCard, User, LogOut, Home } from "lucide-react";

const StudentSidebar = () => {
  const links = [
    { to: "/student/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { to: "/student/payments", label: "Payments", icon: <CreditCard size={20} /> },
    { to: "/student/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <aside className="hidden w-72 shrink-0 bg-[#0d1b18] text-white md:flex flex-col min-h-screen sticky top-0">
      <div className="px-6 py-10 flex flex-col h-full">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 px-2 mb-12">
          <div className="h-10 w-10 bg-[#11d4a4] rounded-xl flex items-center justify-center text-[#0d1b18] font-[900] text-xl">
            S
          </div>
          <span className="text-xl font-[900] tracking-tight">StudySpace</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#11d4a4] text-[#0d1b18] shadow-lg shadow-[#11d4a4]/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.icon}
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-gray-400 hover:text-white transition-colors"
          >
            <Home size={20} />
            Back to Home
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-bold text-rose-400 hover:bg-rose-500/10 rounded-2xl transition-colors">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;