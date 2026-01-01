import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentData } from "../../features/auth/authApi.js";
import { 
  ChevronRight, 
  Zap, 
  Armchair, 
  ShieldCheck, 
  UserCircle, 
  CreditCard, 
  User,
  AlertCircle,
  LayoutDashboard,
  Calendar,
  Sparkles
} from "lucide-react";

const StatCard = ({ label, value, hint, icon: Icon, color }) => (
  <div className="bg-white rounded-[40px] p-8 border-2 border-[#e7f3f0] hover:border-[#11d4a4]/40 hover:shadow-xl hover:shadow-[#11d4a4]/5 transition-all group relative overflow-hidden h-full">
    <div className="flex justify-between items-start mb-8">
      <div className={`p-4 rounded-[20px] ${color} bg-opacity-10 text-emerald-600`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#4c9a86] mb-1">Live Status</span>
        <div className="size-2 rounded-full bg-[#11d4a4] animate-pulse"></div>
      </div>
    </div>
    <p className="text-xs font-[900] uppercase tracking-widest text-[#4c9a86] mb-2">{label}</p>
    <h3 className="text-3xl font-[900] text-[#0d1b18] tracking-tighter leading-none">{value}</h3>
    {hint && (
      <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e7f3f0] text-[#0d1b18] text-[10px] font-[900] uppercase tracking-wider">
        <Sparkles size={10} className="text-[#11d4a4]" fill="#11d4a4" /> {hint}
      </div>
    )}
  </div>
);

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getStudentData();
        setStudent(res?.data || res || null);
      } catch (e) {
        setError(e?.response?.data?.message || "Internal sync failure. Please retry.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const ui = useMemo(() => {
    if (!student) return { name: "Member", plan: "—", seat: "—", status: "—" };
    return {
      name: student?.userId?.name || "Member",
      plan: student?.plan?.code || "No Plan",
      seat: student?.SeatNo !== undefined && student?.SeatNo !== null ? student.SeatNo : "Unassigned",
      status: student?.membershipStatus || "Inactive"
    };
  }, [student]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
      <div className="relative">
        <div className="size-16 rounded-full border-4 border-[#e7f3f0]"></div>
        <div className="size-16 rounded-full border-4 border-t-[#11d4a4] border-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-[#4c9a86] font-[900] uppercase tracking-[0.4em] text-[10px]">Initializing Dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto mt-20 p-12 bg-white rounded-[48px] border-2 border-rose-100 text-center shadow-2xl">
      <div className="bg-rose-50 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="text-rose-500" size={40} />
      </div>
      <h2 className="text-2xl font-[900] text-[#0d1b18] mb-3">Sync Error</h2>
      <p className="text-gray-500 font-bold mb-8 leading-relaxed">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-10 py-4 bg-[#0d1b18] text-white rounded-2xl font-[900] uppercase tracking-widest text-xs hover:bg-black transition-all"
      >
        Retry Sync
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Welcome Header Banner - Cloned from code.html Pine Dark Style */}
      <div className="relative overflow-hidden bg-[#0d1b18] rounded-[48px] p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11d4a4]/10 border border-[#11d4a4]/20 text-[#11d4a4] text-[10px] font-[900] uppercase tracking-[0.2em]">
              <LayoutDashboard size={14} /> Control Center
            </div>
            <div>
              <h1 className="text-5xl md:text-6xl font-[900] tracking-tighter mb-4">
                Hello, {ui.name.split(' ')[0]}
              </h1>
              <p className="text-gray-400 font-bold max-w-lg leading-relaxed text-lg">
                {ui.plan === "No Plan" 
                  ? "Your account is active. Choose a subscription to unlock your seat." 
                  : `Your Premium workspace is active. ${30 - new Date().getDate()} days remaining in current cycle.`}
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-6 border border-white/10 flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-[900] uppercase tracking-widest text-gray-500 mb-1">Today</span>
              <span className="text-xl font-[900]">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="h-10 w-px bg-white/10"></div>
            <Calendar className="text-[#11d4a4]" size={24} />
          </div>
        </div>
        
        {/* Design Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#11d4a4]/10 blur-[120px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#11d4a4]/5 blur-[80px] -ml-20 -mb-20"></div>
      </div>

      {/* Stats Grid - Using Stitch Surface geometry */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard 
          label="Subscription" 
          value={ui.plan} 
          icon={Zap} 
          color="bg-amber-500" 
          hint={ui.plan !== "No Plan" ? "RENEWAL PENDING" : "NONE"} 
        />
        <StatCard 
          label="Assigned Seat" 
          value={isNaN(ui.seat) ? ui.seat : `Desk ${ui.seat}`} 
          icon={Armchair} 
          color="bg-blue-500" 
          hint="QUIET ZONE" 
        />
        <StatCard 
          label="Verification" 
          value={ui.status} 
          icon={ShieldCheck} 
          color="bg-emerald-500" 
          hint="ID VERIFIED"
        />
        <Link to="/student/profile" className="block transition-all hover:scale-[1.02]">
           <StatCard label="Account" value="Settings" icon={UserCircle} color="bg-purple-500" hint="MANAGE" />
        </Link>
      </div>

      {/* Quick Actions - Contrast container */}
      <div className="bg-[#f6f8f8] rounded-[56px] p-10 border-2 border-[#e7f3f0]">
        <div className="flex items-center justify-between mb-10 px-4">
          <h2 className="text-2xl font-[900] text-[#0d1b18] tracking-tighter">Fast Access</h2>
          <div className="h-px flex-1 bg-[#e7f3f0] mx-8"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/student/payments" className="group flex items-center justify-between p-8 bg-white rounded-[32px] border-2 border-transparent hover:border-[#11d4a4] shadow-sm hover:shadow-xl hover:shadow-[#11d4a4]/5 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="bg-[#e7f3f0] p-4 rounded-2xl text-[#0d1b18] group-hover:bg-[#11d4a4] group-hover:text-white transition-all">
                <CreditCard size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="block font-[900] text-[#0d1b18] text-lg leading-none mb-1">Payment History</span>
                <span className="text-[10px] font-bold text-[#4c9a86] uppercase tracking-widest">Invoices & Receipts</span>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-[#11d4a4] group-hover:translate-x-2 transition-all" />
          </Link>
          
          <Link to="/student/profile" className="group flex items-center justify-between p-8 bg-white rounded-[32px] border-2 border-transparent hover:border-[#11d4a4] shadow-sm hover:shadow-xl hover:shadow-[#11d4a4]/5 transition-all duration-300">
            <div className="flex items-center gap-6">
              <div className="bg-[#e7f3f0] p-4 rounded-2xl text-[#0d1b18] group-hover:bg-[#11d4a4] group-hover:text-white transition-all">
                <User size={24} strokeWidth={2.5} />
              </div>
              <div>
                <span className="block font-[900] text-[#0d1b18] text-lg leading-none mb-1">Personal Details</span>
                <span className="text-[10px] font-bold text-[#4c9a86] uppercase tracking-widest">Profile & Security</span>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:text-[#11d4a4] group-hover:translate-x-2 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;