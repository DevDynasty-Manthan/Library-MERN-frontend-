import React from "react";
import { Outlet } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  Armchair, 
  CreditCard, 
  BarChart3, 
  Settings, 
  LogOut,
  ShieldCheck
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Students", icon: Users, path: "/admin/students" },
    { name: "Seat Management", icon: Armchair, path: "/admin/seats" },
    { name: "Payments", icon: CreditCard, path: "/admin/payments" },
    { name: "Reports", icon: BarChart3, path: "/admin/reports" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen w-full bg-[#f6f8f8] font-display antialiased overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-72 hidden md:flex flex-col h-full bg-white border-r-2 border-[#e7f3f0] flex-shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-[#0d1b18] rounded-xl size-10 flex items-center justify-center">
              <ShieldCheck className="text-[#11d4a4]" size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-[#0d1b18] text-lg font-[900] leading-tight tracking-tighter">StudySpace</h1>
              <p className="text-[#4c9a86] text-[10px] font-[900] uppercase tracking-[0.2em]">Admin Console</p>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group ${
                  isActive(item.path)
                    ? "bg-[#11d4a4] text-[#0d1b18]"
                    : "text-gray-500 hover:bg-[#f6f8f8] hover:text-[#0d1b18]"
                }`}
              >
                <item.icon size={22} strokeWidth={isActive(item.path) ? 2.5 : 2} />
                <span className={`text-sm tracking-tight ${isActive(item.path) ? "font-[900]" : "font-bold"}`}>
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Admin Profile / Logout Area (Bottom) */}
        <div className="mt-auto p-6 border-t-2 border-[#e7f3f0]">
          <div className="bg-[#f6f8f8] rounded-3xl p-4 mb-4 flex items-center gap-3 border-2 border-transparent hover:border-[#e7f3f0] transition-all">
            <div className="size-10 rounded-full bg-[#0d1b18] flex items-center justify-center text-[#11d4a4] font-black">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-[900] text-[#0d1b18] truncate leading-none uppercase tracking-tighter">
                {user?.name || "Super Admin"}
              </p>
              <p className="text-[10px] font-bold text-[#4c9a86] uppercase tracking-widest mt-1">Administrator</p>
            </div>
          </div>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50 text-rose-600 font-[900] uppercase tracking-widest text-[10px] hover:bg-rose-100 transition-colors"
          >
            <LogOut size={14} strokeWidth={3} />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content Scroll Area */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-[1400px] mx-auto p-6 md:p-10 lg:p-12">
          <Outlet/>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;