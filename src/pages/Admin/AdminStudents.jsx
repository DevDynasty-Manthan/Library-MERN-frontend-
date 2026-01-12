import React, { useEffect, useMemo, useState } from "react";
import { getAllStudentUsers } from "../../features/auth/adminApi";
import ExpandableTable from "../../components/admin/ExpandableTable.jsx";
import { Users, Search, Phone, Calendar, MoreHorizontal, MapPin } from "lucide-react";

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

  const columns = ["#", "Student Identity", "Plan Details", "Status", "Due Date", "Actions"];

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
        // In your controller, seat is stored as seatId (populated)
        seatNo: student.seatId?.seatNo || "—", 
        name: student.userId?.name || "Unknown Member",
        email: student.userId?.email || "No Email",
        phone: student.userId?.phone || "N/A",
        // Controller uses 'planId' field name
        planName: student.planId?.code || "No Plan", 
        planFees: student.planId?.fees || 0,
        // Controller changed 'membershipStatus' to 'status'
        status: (student.status || "pending").toLowerCase(),
        enrolledAt: student.admissionDate || student.createdAt,
        dueDate: student.dueDate,
        education: student.education,
        age: student.age,
        purpose: Array.isArray(student.purpose) ? student.purpose.join(", ") : student.purpose || "General"
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
            <span className="text-[10px] font-black text-[#11d4a4] uppercase flex items-center gap-1">
              <MapPin size={10}/> Seat {row.seatNo}
            </span>
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
      case "Due Date":
        return (
          <span className="text-xs font-bold text-gray-600">
            {row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "N/A"}
          </span>
        );
      case "Actions":
        return <button className="p-2 text-[#4c9a86] hover:text-[#0d1b18] transition-colors"><MoreHorizontal size={18} /></button>;
      default: return "";
    }
  };

  const renderExpanded = (row) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="space-y-3">
        <h5 className="text-[10px] font-black text-[#4c9a86] uppercase tracking-widest">Academic & Background</h5>
        <p className="text-sm font-bold text-[#0d1b18]">Education: <span className="font-normal text-gray-600">{row.education || "Not specified"}</span></p>
        <p className="text-sm font-bold text-[#0d1b18]">Purpose: <span className="font-normal text-gray-600">{row.purpose}</span></p>
        <p className="text-sm font-bold text-[#0d1b18]">Age: <span className="font-normal text-gray-600">{row.age || "N/A"}</span></p>
      </div>
      <div className="space-y-3">
        <h5 className="text-[10px] font-black text-[#4c9a86] uppercase tracking-widest">Contact & Registry</h5>
        <div className="flex items-center gap-2 text-sm text-[#0d1b18] font-bold">
            <Phone size={14} className="text-[#11d4a4]"/> {row.phone}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#0d1b18] font-bold">
            <Calendar size={14} className="text-[#11d4a4]"/> Joined {new Date(row.enrolledAt).toLocaleDateString()}
        </div>
      </div>
      <div className="bg-[#0d1b18] rounded-2xl p-5 text-white flex flex-col justify-center relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10">
            <ShieldCheck size={80} />
        </div>
        <p className="text-[9px] font-black text-[#11d4a4] uppercase tracking-widest mb-1">Active Plan Fee</p>
        <h4 className="text-2xl font-black">₹{row.planFees}</h4>
        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-tighter">Due: {row.dueDate ? new Date(row.dueDate).toDateString() : 'N/A'}</p>
      </div>
    </div>
  );

  if (loading) return (
    <div className="h-64 flex flex-col items-center justify-center space-y-4">
        <div className="size-10 border-4 border-[#e7f3f0] border-t-[#11d4a4] rounded-full animate-spin" />
        <p className="font-black text-[#4c9a86] text-sm uppercase tracking-widest">Syncing Registry...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-[900] text-[#0d1b18] tracking-tighter">Student Registry</h2>
          <p className="text-[#4c9a86] font-bold text-sm">Managing {rows.length} verified library memberships</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#11d4a4] transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-white border-2 border-[#e7f3f0] rounded-xl text-sm font-bold focus:border-[#11d4a4] outline-none transition-all w-full md:w-72 shadow-sm"
          />
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