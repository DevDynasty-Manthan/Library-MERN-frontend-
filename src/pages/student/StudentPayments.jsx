import React, { useEffect, useMemo, useState } from "react";
import { getPayments } from "../../features/auth/authApi";
// Fix: Added missing ShieldCheck import
import { 
  CreditCard, 
  History, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Receipt,
  ShieldCheck 
} from "lucide-react";

const StudentPayments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getPayments();
        // Handle both response shapes (direct array or data wrapper)
        setPayments(res?.data || res || []);
      } catch (err) {
        setPayments([]);
        setError(err?.response?.data?.message || "Failed to load ledger");
      } finally {
        setLoading(false);
      }
    };
    loadPayments();
  }, []);

  const rows = useMemo(() => {
    return payments.map((p, index) => {
      const status = p?.status?.toLowerCase() || "pending";
      const amount = Number(p?.planId?.fees || p?.planFees || 0);
      
      return {
        id: p._id || index,
        srNo: (index + 1).toString().padStart(2, '0'),
        method: p?.method || "Cash",
        date: p?.createdAt 
          ? new Date(p.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) 
          : "Processing",
        plan: p?.planId?.code || p?.planName || "Standard Plan",
        amount: amount,
        due: typeof p?.dueAmount === "number" ? p.dueAmount : (status === "verified" ? 0 : amount),
        status: status
      };
    });
  }, [payments]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 font-display">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-[#11d4a4]"></div>
      <p className="text-gray-400 font-[900] uppercase tracking-[0.3em] text-[10px]">Loading Ledger...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-display selection:bg-[#11d4a4] selection:text-[#0d1b18]">
      {/* Header Banner - Aligned with code.html surface-dark style */}
      <div className="relative overflow-hidden bg-[#0d1b18] rounded-[48px] p-10 text-white shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#11d4a4]/10 border border-[#11d4a4]/20 text-[#11d4a4] text-[10px] font-[900] uppercase tracking-[0.2em] mb-6">
              <Receipt size={12} strokeWidth={3} /> Financial Records
            </div>
            <h1 className="text-4xl md:text-5xl font-[900] tracking-tighter mb-4">Payment History</h1>
            <p className="text-gray-400 font-bold max-w-md leading-relaxed">
              Detailed breakdown of your membership subscriptions and transaction status.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-6 border border-white/10 min-w-[160px]">
              <p className="text-[10px] font-[900] uppercase tracking-widest text-gray-500 mb-2">Total Paid</p>
              <p className="text-3xl font-[900] text-[#11d4a4]">₹{rows.reduce((acc, curr) => acc + curr.amount, 0)}</p>
            </div>
          </div>
        </div>
        {/* Decorative Blur Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#11d4a4]/10 blur-[120px] -mr-32 -mt-32"></div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[48px] border-2 border-[#e7f3f0] overflow-hidden shadow-sm">
        {error ? (
          <div className="p-20 text-center">
            <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
            <h3 className="text-xl font-[900] text-[#0d1b18] mb-2">Sync Interrupted</h3>
            <p className="text-gray-500 font-bold">{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f6f8f8] border-b-2 border-[#e7f3f0]">
                  <th className="px-8 py-6 text-left text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">#</th>
                  <th className="px-6 py-6 text-left text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">Method</th>
                  <th className="px-6 py-6 text-left text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">Payment Date</th>
                  <th className="px-6 py-6 text-left text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">Plan</th>
                  <th className="px-6 py-6 text-left text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">Amount</th>
                  <th className="px-8 py-6 text-right text-[10px] font-[900] uppercase tracking-[0.2em] text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e7f3f0]">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center opacity-20">
                        <History size={64} className="mb-4 text-[#4c9a86]" />
                        <p className="font-[900] uppercase tracking-widest text-[#4c9a86]">No Transactions Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.id} className="hover:bg-[#f6f8f8]/50 transition-colors group">
                      <td className="px-8 py-7">
                        <span className="font-[900] text-gray-300 group-hover:text-[#11d4a4] transition-colors">{r.srNo}</span>
                      </td>
                      <td className="px-6 py-7">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-[#e7f3f0] text-[#0d1b18]">
                            <CreditCard size={18} />
                          </div>
                          <span className="font-bold text-[#0d1b18] capitalize">{r.method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-7 font-bold text-gray-500 text-sm">
                        {r.date}
                      </td>
                      <td className="px-6 py-7 font-[900] text-[#0d1b18]">
                        {r.plan}
                      </td>
                      <td className="px-6 py-7">
                        <div className="font-[900] text-[#0d1b18] text-lg tracking-tight">₹{r.amount}</div>
                        {r.due > 0 && (
                          <span className="text-[10px] font-[900] text-rose-500 uppercase tracking-tighter">
                            ₹{r.due} Unpaid
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-7 text-right">
                        {r.status === "verified" ? (
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 size={12} strokeWidth={3} />
                            <span className="text-[10px] font-[900] uppercase tracking-wider">Verified</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/50 text-amber-700 border border-amber-200">
                            <Clock size={12} strokeWidth={3} />
                            <span className="text-[10px] font-[900] uppercase tracking-wider">Pending</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Trust Footer */}
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="h-px w-20 bg-[#e7f3f0]"></div>
        <div className="flex items-center gap-2 text-gray-400">
          <ShieldCheck size={16} className="text-[#11d4a4]" />
          <p className="text-[10px] font-[900] uppercase tracking-[0.3em]">Secure Billing Ledger</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPayments;