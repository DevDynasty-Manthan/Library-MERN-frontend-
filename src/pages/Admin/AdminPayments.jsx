import React, { useEffect, useState } from "react";
import { getAllPayments } from "../../features/auth/adminApi";
import { Search, Filter, ChevronDown, ChevronUp } from "lucide-react";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getAllPayments();
      setPayments(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || payment.status === filterStatus;
    
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
          <p className="text-gray-500 font-bold">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-[900] text-[#0d1b18]">Payments</h1>
          <p className="text-gray-500 font-bold">{payments.length} total transactions</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-white border-2 border-gray-100 focus:border-[#11d4a4] outline-none font-bold text-[#0d1b18] placeholder:text-gray-400"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-4 rounded-xl bg-white border-2 border-gray-100 focus:border-[#11d4a4] outline-none font-bold text-[#0d1b18]"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-[900] text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-400 font-bold">
                    No payments found
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment) => (
                  <React.Fragment key={payment._id}>
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-[900] text-[#0d1b18]">{payment.userId?.name || "N/A"}</p>
                        <p className="text-xs text-gray-500 font-bold">{payment.userId?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-[900] text-[#0d1b18]">₹{payment.amount || 0}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-700">{payment.planId?.code || "N/A"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-[900] bg-gray-100 text-gray-700 uppercase">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-[900] uppercase tracking-wider ${
                            payment.status === "verified"
                              ? "bg-green-50 text-green-600"
                              : payment.status === "pending"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-gray-700">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 font-bold">
                          {new Date(payment.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRow(payment._id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-bold transition-all"
                        >
                          {expandedRow === payment._id ? (
                            <>
                              <ChevronUp size={16} />
                              Hide
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} />
                              Details
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Row */}
                    {expandedRow === payment._id && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-xs font-[900] text-gray-600 uppercase tracking-wider mb-1">
                                Transaction ID
                              </p>
                              <p className="font-bold text-[#0d1b18] text-sm break-all">
                                {payment.transactionId || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-[900] text-gray-600 uppercase tracking-wider mb-1">
                                Order ID
                              </p>
                              <p className="font-bold text-[#0d1b18] text-sm break-all">
                                {payment.orderId || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-[900] text-gray-600 uppercase tracking-wider mb-1">
                                Plan Fees
                              </p>
                              <p className="font-bold text-[#0d1b18]">₹{payment.planId?.fees || 0}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;
