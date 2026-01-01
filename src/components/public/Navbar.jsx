import React, { useState } from "react";
import { GraduationCap, User, LogOut, ChevronDown, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext"; // Adjust path as needed
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Plans", href: "#plans" },
    { name: "How it works", href: "#how-it-works" },
    { name: "Reviews", href: "#reviews" },
    { name: "Contact", href: "#contact" },
  ];

  console.log(user)
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e7f3f0] bg-white/90 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-6">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <GraduationCap className="text-[#11d4a4] group-hover:rotate-12 transition-transform" size={37} strokeWidth={2.5} />
            <h2 className="text-[28px] font-[900] leading-tight tracking-[-0.04em] text-[#0d1b18]">
              StudySpace
            </h2>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <nav className="flex items-center gap-10">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[18px] font-bold text-[#0d1b18]/70 hover:text-[#11d4a4] transition-colors tracking-tight"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-6">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="text-[18px] font-bold text-[#0d1b18] hover:text-[#11d4a4] transition-colors">
                    Log In
                  </Link>
                  <Link to="/signup" className="h-12 px-8 rounded-xl bg-[#11d4a4] text-[#0d1b18] font-[900] text-[16px] shadow-lg shadow-[#11d4a4]/20 hover:bg-[#0fc194] transition-all active:scale-95 flex items-center">
                    Get Started
                  </Link>
                </>
              ) : (
                /* User Profile Dropdown */
                <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 p-1.5 pr-4 rounded-full bg-[#f6f8f8] border-2 border-[#e7f3f0] hover:border-[#11d4a4]/40 transition-all group"
                  >
                    <div className="size-10 rounded-full bg-[#11d4a4] flex items-center justify-center text-[#0d1b18] font-black">
                      {user?.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-[900] text-[#0d1b18] leading-none uppercase tracking-tighter">
                        {user?.name?.split(' ')[0] || "Student"}
                      </p>
                      <p className="text-[10px] font-bold text-[#4c9a86] uppercase tracking-widest">Profile</p>
                    </div>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl border-2 border-[#e7f3f0] shadow-xl p-2 animate-in fade-in slide-in-from-top-2">
                      <Link 
                        to={`${user.role}/dashboard`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#f6f8f8] text-[#0d1b18] font-bold transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-[#11d4a4]" />
                        Dashboard
                      </Link>
                      <Link 
                        to="/student/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#f6f8f8] text-[#0d1b18] font-bold transition-colors"
                      >
                        <User size={18} className="text-[#11d4a4]" />
                        Account Settings
                      </Link>
                      <div className="h-px bg-[#e7f3f0] my-2 mx-2" />
                      <button 
                        onClick={() => { logout(); setIsDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-rose-50 text-rose-600 font-bold transition-colors"
                      >
                        <LogOut size={18} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}