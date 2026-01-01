import React, { useEffect, useMemo, useState } from "react";
import { getAllStudentUsers } from "../../features/auth/adminApi";
import ExpandableTable from "../../components/admin/ExpandableTable.jsx";
import { Users, Search, Filter, Phone, Calendar, MoreHorizontal, ShieldCheck } from "lucide-react";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await getAllStudentUsers();
        // Postman shows the array is in response.data
        setStudents(response.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to sync registry");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const columns = ["#", "Student Identity", "Plan Details", "Status", "Actions"];

  const rows = useMemo(() => {
    return students
      .filter(s => {
        const name = s.userId?.name || "";
        const email = s.userId?.email || "";
        return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
               email.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .map((student, index) => ({
        id: student._id,
        srNo: (index + 1).toString().padStart(2, '0'),
        seatNo: student.SeatNo || "—",
        name: student.userId?.name || "Unknown Member",
        email: student.userId?.email || "No Email",
        phone: student.userId?.phone || "N/A",
        // Mapping from your 'plan' object in the API response
        planName: student.plan?.code || "No Plan", 
        planFees: student.plan?.fees || 0,
        status: (student.membershipStatus || "pending").toLowerCase(),
        enrolledAt: student.createdAt,
        education: student.education,
        age: student.age,
        purpose: student.purpose?.join(", ") || "General"
      }));
  }, [students, searchTerm]);

  const renderCell = (row, col) => {
    switch (col) {
      case "#":
        return <span className="font-[900] text-[#4c9a86]">{row.srNo}</span>;
      case "Student Identity":
        return (
          <div className="flex flex-col">
            <span className="font-[900] text-[#0d1b18] text-sm">{row.name}</span>
            <span className="text-[10px] font-bold text-[#4c9a86] uppercase tracking-tighter">{row.email}</span>
          </div>
        );
      case "Plan Details":
        return (
          <div className="flex flex-col">
            <span className="font-[900] text-[#0d1b18] text-sm">{row.planName}</span>
            <span className="text-[10px] font-black text-[#11d4a4] uppercase">Seat {row.seatNo}</span>
          </div>
        );
      case "Status":
        const isActive = row.status === "active";
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${
            isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
          }`}>
            <div className={`size-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-[900] uppercase tracking-widest">{row.status}</span>
          </div>
        );
      case "Actions":
        return <button className="p-2 text-[#4c9a86] hover:text-[#0d1b18]"><MoreHorizontal size={18} /></button>;
      default: return "";
    }
  };

  const renderExpanded = (row) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h5 className="text-[10px] font-black text-[#4c9a86] uppercase tracking-widest">Academic & Background</h5>
        <p className="text-sm font-bold text-[#0d1b18]">Education: <span className="font-normal">{row.education}</span></p>
        <p className="text-sm font-bold text-[#0d1b18]">Purpose: <span className="font-normal">{row.purpose}</span></p>
        <p className="text-sm font-bold text-[#0d1b18]">Age: <span className="font-normal">{row.age}</span></p>
      </div>
      <div className="space-y-3">
        <h5 className="text-[10px] font-black text-[#4c9a86] uppercase tracking-widest">Contact Details</h5>
        <div className="flex items-center gap-2 text-sm text-[#0d1b18] font-bold">
            <Phone size={14} className="text-[#11d4a4]"/> {row.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#0d1b18] font-bold">
            <Calendar size={14} className="text-[#11d4a4]"/> Joined {new Date(row.enrolledAt).toLocaleDateString()}
        </div>
      </div>
      <div className="bg-[#0d1b18] rounded-2xl p-5 text-white flex flex-col justify-center">
        <p className="text-[9px] font-black text-[#11d4a4] uppercase tracking-widest mb-1">Monthly Billing</p>
        <h4 className="text-2xl font-black">₹{row.planFees}</h4>
      </div>
    </div>
  );

  if (loading) return <div className="p-20 text-center font-bold text-[#4c9a86] animate-pulse">Syncing Database...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-[900] text-[#0d1b18] tracking-tighter">Student Registry</h2>
          <p className="text-[#4c9a86] font-bold text-sm">Reviewing {rows.length} active memberships</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border-2 border-[#e7f3f0] rounded-xl text-sm font-bold focus:border-[#11d4a4] outline-none transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border-2 border-[#e7f3f0] overflow-hidden shadow-sm">
        <ExpandableTable 
          columns={columns} 
          rows={rows} 
          renderCell={renderCell} 
          renderExpanded={renderExpanded} 
        />
      </div>
    </div>
  );
};

export default AdminStudents;