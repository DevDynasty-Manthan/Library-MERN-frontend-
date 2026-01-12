import React, { useEffect, useState } from "react";
import { getAllStudentUsers, getAllPayments, getPlansAndSeatData } from "../../features/auth/adminApi.js";
import { Users, DollarSign, Armchair, Clock, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRevenue: 0,
    activeSeats: 0,
    pendingPayments: 0,
  });
  const [latestPayments, setLatestPayments] = useState([]);
  const [expiringSeats, setExpiringSeats] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data
      const [studentsRes, paymentsRes, seatsRes] = await Promise.all([
        getAllStudentUsers(),
        getAllPayments(),
        getPlansAndSeatData(),
      ]);

      const students = studentsRes.data || [];
      const payments = paymentsRes.data || [];
      const seats = seatsRes.data || [];

      // Calculate stats
      const totalRevenue = payments
        .filter((p) => p.status === "verified")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

      const pendingPayments = payments.filter((p) => p.status === "pending").length;
      const activeSeats = seats.filter((s) => s.status === "assigned").length;

      setStats({
        totalStudents: students.length,
        totalRevenue,
        activeSeats,
        pendingPayments,
      });

      // Latest 5 payments
      setLatestPayments(
        payments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );

      // Seats expiring in next 7 days
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      setExpiringSeats(
        seats
          .filter((s) => {
            const endDate = new Date(s.endAt);
            return endDate >= now && endDate <= nextWeek;
          })
          .sort((a, b) => new Date(a.endAt) - new Date(b.endAt))
          .slice(0, 5)
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#11d4a4] mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-[900] text-[#0d1b18] mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 font-bold">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Students */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#11d4a4] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="text-blue-600" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-[900] text-green-600 uppercase tracking-wider">
              +12%
            </span>
          </div>
          <h3 className="text-2xl font-[900] text-[#0d1b18] mb-1">{stats.totalStudents}</h3>
          <p className="text-sm text-gray-500 font-bold">Total Students</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#11d4a4] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign className="text-green-600" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-[900] text-green-600 uppercase tracking-wider">
              <TrendingUp size={12} className="inline" /> +8%
            </span>
          </div>
          <h3 className="text-2xl font-[900] text-[#0d1b18] mb-1">₹{stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-sm text-gray-500 font-bold">Total Revenue</p>
        </div>

        {/* Active Seats */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#11d4a4] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Armchair className="text-purple-600" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-[900] text-gray-400 uppercase tracking-wider">
              Active
            </span>
          </div>
          <h3 className="text-2xl font-[900] text-[#0d1b18] mb-1">{stats.activeSeats}</h3>
          <p className="text-sm text-gray-500 font-bold">Active Seats</p>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-[#11d4a4] transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Clock className="text-orange-600" size={24} strokeWidth={2.5} />
            </div>
            <span className="text-xs font-[900] text-orange-600 uppercase tracking-wider">
              Review
            </span>
          </div>
          <h3 className="text-2xl font-[900] text-[#0d1b18] mb-1">{stats.pendingPayments}</h3>
          <p className="text-sm text-gray-500 font-bold">Pending Payments</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Payments */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h2 className="text-lg font-[900] text-[#0d1b18] mb-4">Latest Payments</h2>
          <div className="space-y-3">
            {latestPayments.length === 0 ? (
              <p className="text-gray-400 text-sm font-bold text-center py-8">No payments yet</p>
            ) : (
              latestPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                >
                  <div className="flex-1">
                    <p className="font-[900] text-[#0d1b18] text-sm">
                      {payment.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">
                      {payment.method} • {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-[900] text-[#0d1b18]">₹{payment.amount}</p>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        payment.status === "verified"
                          ? "text-green-600"
                          : payment.status === "pending"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Seats Expiring Soon */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
          <h2 className="text-lg font-[900] text-[#0d1b18] mb-4">Seats Expiring Soon</h2>
          <div className="space-y-3">
            {expiringSeats.length === 0 ? (
              <p className="text-gray-400 text-sm font-bold text-center py-8">No seats expiring soon</p>
            ) : (
              expiringSeats.map((seat) => (
                <div
                  key={seat._id}
                  className="flex items-center justify-between p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-all"
                >
                  <div className="flex-1">
                    <p className="font-[900] text-[#0d1b18] text-sm">
                      {seat.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">
                      Seat #{seat.seatNo} • {seat.planId?.code || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-[900] text-orange-600">
                      {new Date(seat.endAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500 font-bold">Expires</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
