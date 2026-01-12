import React, { useEffect, useState } from "react";
import { getPlansAndSeatData } from "../../features/auth/adminApi";
import { Search, ChevronDown, ChevronUp, Clock } from "lucide-react";

const AdminSeatsPlans = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const response = await getPlansAndSeatData();
      // Ensure we handle the data structure coming from your specific API
      setSeats(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load seat assignments");
    } finally {
      setLoading(false);
    }
  };

  const filteredSeats = seats.filter((seat) => {
    const matchesSearch =
      seat.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seat.seatNo?.toString().includes(searchTerm);
    
    // Status logic: In your controller, status is often 'assigned' or determined by isOccupied
    const currentStatus = seat.isOccupied ? "assigned" : "available";
    const matchesFilter = filterStatus === "all" || currentStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#11d4a4] mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">Syncing assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[900] text-[#0d1b18]">Seat Management</h1>
          <p className="text-gray-500 font-bold">{seats.length} total seats in system</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by student or seat #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border-2 border-gray-100 focus:border-[#11d4a4] outline-none font-bold"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-4 rounded-xl bg-white border-2 border-gray-100 focus:border-[#11d4a4] outline-none font-bold"
          >
            <option value="all">All Status</option>
            <option value="assigned">Occupied</option>
            <option value="available">Vacant</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase">Seat</th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase">Student</th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase">Plan Details</th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase">Due Date</th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSeats.map((seat) => (
                <React.Fragment key={seat._id}>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-10 h-10 rounded-xl bg-[#11d4a4]/10 text-[#11d4a4] flex items-center justify-center font-[900]">
                        {seat.seatNo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-[900] text-[#0d1b18]">{seat.userId?.name || "System Reserved"}</p>
                      <p className="text-xs text-gray-500 font-bold">{seat.userId?.email || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-700">{seat.planId?.code || "No Plan"}</p>
                      <p className="text-xs text-[#11d4a4] font-[900]">₹{seat.planId?.fees || 0}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-[900] uppercase tracking-tighter ${
                        seat.isOccupied ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"
                      }`}>
                        {seat.isOccupied ? "Occupied" : "Vacant"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {/* Using the logic from your step5 controller */}
                      <p className="text-sm font-bold text-gray-700">
                        {seat.assignedAt ? new Date(new Date(seat.assignedAt).getTime() + 30*24*60*60*1000).toLocaleDateString() : "---"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleRow(seat._id)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        {expandedRow === seat._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Detail View */}
                  {expandedRow === seat._id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan="6" className="px-8 py-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-[900] text-gray-400">Contact Info</label>
                            <p className="font-bold">{seat.userId?.phone || "No phone linked"}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-[900] text-gray-400">Assignment Date</label>
                            <p className="font-bold">{seat.assignedAt ? new Date(seat.assignedAt).toLocaleDateString() : "Not assigned"}</p>
                          </div>
                          <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                              <Clock size={18} />
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-[900] text-gray-400">Grace Period</p>
                              <p className="text-sm font-bold">7 Days Active</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminSeatsPlans;