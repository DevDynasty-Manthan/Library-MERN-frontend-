import React, { useEffect, useMemo, useState } from "react";
import { getStudentData } from "../../features/auth/authApi.js";
import { 
  User, Mail, Phone, ShieldCheck, 
  Armchair, Zap, Edit3, Save, X, 
  CheckCircle, Fingerprint, Calendar,
  AlertCircle, Loader2
} from "lucide-react";

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getStudentData();
        const student = res?.data || res;

        console.log("✅ Profile loaded:", student); // Debug log

        if (!student) {
          throw new Error("No profile data received");
        }

        setProfile(student);
        setForm({
          name: student?.userId?.name || "",
          email: student?.userId?.email || "",
          phone: student?.userId?.phone || "",
        });
      } catch (e) {
        console.error("❌ Profile load error:", e);
        setError(e?.response?.data?.message || e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const initials = useMemo(() => {
    const n = (profile?.userId?.name || "S").trim();
    return n.slice(0, 1).toUpperCase();
  }, [profile]);

  // ✅ Added missing handleCancel function
  const handleCancel = () => {
    setForm({
      name: profile?.userId?.name || "",
      email: profile?.userId?.email || "",
      phone: profile?.userId?.phone || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    // UI-only update (you can add API call here later)
    setProfile((prev) => ({
      ...prev,
      userId: { 
        ...prev?.userId, 
        name: form.name, 
        email: form.email, 
        phone: form.phone 
      },
    }));
    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] gap-6">
        <div className="relative">
          <div className="size-16 rounded-full border-4 border-[#e7f3f0]"></div>
          <div className="size-16 rounded-full border-4 border-t-[#11d4a4] border-transparent animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="text-[#4c9a86] font-[900] uppercase tracking-[0.4em] text-[10px]">Loading Profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-12 bg-white rounded-[48px] border-2 border-rose-100 text-center shadow-2xl">
        <div className="bg-rose-50 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-rose-500" size={40} />
        </div>
        <h2 className="text-2xl font-[900] text-[#0d1b18] mb-3">Failed to Load Profile</h2>
        <p className="text-gray-500 font-bold mb-8 leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-[#0d1b18] text-white rounded-2xl font-[900] uppercase tracking-widest text-xs hover:bg-black transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto mt-20 p-12 bg-white rounded-[48px] border-2 border-gray-100 text-center">
        <p className="text-gray-500 font-bold">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4">
      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-8 right-8 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#0d1b18] text-white px-6 py-4 rounded-[24px] shadow-2xl border border-[#11d4a4]/30 flex items-center gap-3">
            <div className="bg-[#11d4a4] rounded-full p-1 text-[#0d1b18]">
              <CheckCircle size={16} strokeWidth={3} />
            </div>
            <span className="font-bold text-sm">Profile updated successfully</span>
          </div>
        </div>
      )}

      {/* Profile Header Block */}
      <div className="relative overflow-hidden bg-[#0d1b18] rounded-[48px] p-8 md:p-12 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="h-32 w-32 rounded-[40px] bg-[#11d4a4] flex items-center justify-center text-[#0d1b18] text-5xl font-[900] shadow-2xl rotate-3 transition-transform group-hover:rotate-0">
                {initials}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#11d4a4] h-8 w-8 rounded-full border-[6px] border-[#0d1b18] flex items-center justify-center">
                <ShieldCheck size={12} className="text-[#0d1b18]" strokeWidth={3} />
              </div>
            </div>
            
            <div className="text-center md:text-left">
              <span className="text-[#11d4a4] text-[10px] font-[900] uppercase tracking-[0.3em] mb-3 block">Official Student Record</span>
              <h1 className="text-4xl md:text-5xl font-[900] tracking-tighter mb-4 capitalize">
                {profile?.userId?.name || "Student"}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <Fingerprint size={14} className="text-[#11d4a4]" />
                  <span className="text-xs font-bold text-gray-300">ID: {profile?._id?.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                  <Calendar size={14} className="text-[#11d4a4]" />
                  <span className="text-xs font-bold text-gray-300">
                    Joined {profile?.createdAt ? new Date(profile.createdAt).getFullYear() : new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)} 
                className="bg-[#11d4a4] text-[#0d1b18] px-8 py-4 rounded-2xl font-[900] text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#11d4a4]/20 flex items-center gap-2"
              >
                <Edit3 size={18} /> Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button 
                  onClick={handleCancel} 
                  className="bg-white/10 text-white px-6 py-4 rounded-2xl font-[900] text-sm hover:bg-white/20 transition-all flex items-center gap-2"
                >
                  <X size={18} /> Cancel
                </button>
                <button 
                  onClick={handleSave} 
                  className="bg-[#11d4a4] text-[#0d1b18] px-8 py-4 rounded-2xl font-[900] text-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Save size={18} /> Save
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#11d4a4]/10 blur-[120px] -mr-32 -mt-32 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#11d4a4]/5 blur-[80px] -ml-20 -mb-20 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[48px] border-2 border-[#e7f3f0] p-8 md:p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-[900] text-[#0d1b18] flex items-center gap-4">
                <div className="p-2 bg-[#e7f3f0] rounded-xl text-[#11d4a4]">
                  <User size={24} />
                </div>
                Account Information
              </h2>
            </div>
            
            <div className="grid gap-8">
              {[
                { label: "Full Name", value: form.name, key: "name", icon: User, type: "text" },
                { label: "Email Address", value: form.email, key: "email", icon: Mail, type: "email" },
                { label: "Contact Phone", value: form.phone, key: "phone", icon: Phone, type: "tel" }
              ].map((field) => (
                <div key={field.key} className="relative">
                  <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400 mb-3 block ml-1">
                    {field.label}
                  </label>
                  <div className={`group flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-300 ${
                    isEditing 
                      ? 'bg-white border-[#11d4a4] shadow-xl shadow-[#11d4a4]/5' 
                      : 'bg-[#f6f8f8] border-transparent'
                  }`}>
                    <field.icon size={20} className={isEditing ? 'text-[#11d4a4]' : 'text-gray-400'} />
                    {isEditing ? (
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                        className="w-full bg-transparent font-bold text-[#0d1b18] outline-none text-lg"
                        placeholder={`Your ${field.label}`}
                      />
                    ) : (
                      <span className="font-bold text-[#0d1b18] text-lg">{field.value || "Not Set"}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Status Area */}
        <div className="space-y-8">
          <div className="bg-[#f6f8f8] rounded-[48px] border-2 border-[#e7f3f0] p-8 flex flex-col gap-8">
            <h3 className="text-[10px] font-[900] uppercase tracking-[0.3em] text-gray-400 text-center">Membership Status</h3>
            
            <div className="space-y-4">
              {/* Plan Card - ✅ Handle both plan and planId */}
              <div className="bg-white p-6 rounded-[32px] border-2 border-[#e7f3f0] flex items-center gap-5 transition-transform hover:scale-[1.02]">
                <div className="p-4 bg-amber-50 text-amber-500 rounded-2xl">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <p className="text-[10px] font-[900] text-gray-400 uppercase tracking-widest mb-1">Plan</p>
                  <p className="font-[900] text-[#0d1b18] text-xl">
                    {profile?.plan?.code || profile?.planId?.name || "No Plan"}
                  </p>
                </div>
              </div>

              {/* Seat Card */}
              <div className="bg-white p-6 rounded-[32px] border-2 border-[#e7f3f0] flex items-center gap-5 transition-transform hover:scale-[1.02]">
                <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
                  <Armchair size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-[900] text-gray-400 uppercase tracking-widest mb-1">Seat</p>
                  <p className="font-[900] text-[#0d1b18] text-xl">
                    {profile?.SeatNo !== undefined && profile?.SeatNo !== null 
                      ? `Desk ${profile.SeatNo}` 
                      : "Not Assigned"}
                  </p>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-[#0d1b18] p-6 rounded-[32px] border-2 border-transparent flex items-center gap-5 shadow-xl">
                <div className="p-4 bg-[#11d4a4]/20 text-[#11d4a4] rounded-2xl">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-[900] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-[900] text-[#11d4a4] uppercase text-sm tracking-tighter">
                    {profile?.membershipStatus || "Active"}
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <div className="mt-4 p-6 bg-white rounded-[32px] border-2 border-dashed border-[#e7f3f0] text-center">
              <p className="text-xs font-bold text-gray-400 leading-relaxed mb-2">
                Monthly Fee: ₹{profile?.plan?.monthlyFee || profile?.planId?.fees || profile?.plan?.fees || 0}
              </p>
              <p className="text-xs font-bold text-gray-400 leading-relaxed">
                Need to change your plan or report a seat issue?
              </p>
              <button className="mt-4 text-[#11d4a4] font-[900] text-sm uppercase tracking-widest hover:underline decoration-2 underline-offset-8">
                Contact Admin
              </button>
            </div>
          </div>

          {/* Education Info Card */}
          {profile?.education && (
            <div className="bg-white rounded-[32px] border-2 border-[#e7f3f0] p-6">
              <h4 className="text-[10px] font-[900] uppercase tracking-[0.3em] text-gray-400 mb-4">Academic Info</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Education</p>
                  <p className="font-bold text-[#0d1b18]">{profile.education}</p>
                </div>
                {profile.age && (
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Age</p>
                    <p className="font-bold text-[#0d1b18]">{profile.age} years</p>
                  </div>
                )}
                {profile.purpose && profile.purpose.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Purpose</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.purpose.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-[#f6f8f8] rounded-full text-xs font-bold text-[#0d1b18]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
