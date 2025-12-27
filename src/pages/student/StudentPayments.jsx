import React, { useEffect, useMemo, useState } from "react";
import { getPayments } from "../../features/auth/authApi"; // <-- your helper

const StudentPayments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getPayments(); // expected: { ok, data: [...] }
        setPayments(res?.data || []);
      } catch (err) {
        setPayments([]);
        setError(err?.response?.data?.message || err?.message || "Failed to load payments");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  const rows = useMemo(() => {
    return payments.map((p, index) => {
      const method = p?.method || "—";

      // date from createdAt (needs timestamps: true in mongoose)
      const paymentDate = p?.createdAt
        ? new Date(p.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—";

      // plan label (depends on whether you populate planId)
      const planLabel =
        p?.planId?.name || p?.planId?.code || p?.planName || "—";

     const amount = Number(p?.planId?.fees ?? 0);

      // placeholder logic until you finalize how due is stored
      const dueAmount =
        typeof p?.dueAmount === "number"
          ? p.dueAmount
          : p?.status === "verified"
          ? 0
          : amount;

      return {
        srNo: index + 1,
        method,
        paymentDate,
        planLabel,
        amount,
        dueAmount,
      };
    });
  }, [payments]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-dark-emerald-900">Payments</h1>
        <p className="mt-2 text-base text-dark-emerald-700">
          View your payment history.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-ash-grey-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-dark-emerald-800">Loading payments...</div>
        ) : error ? (
          <div className="p-6 text-deep-crimson-800">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead className="bg-ash-grey-50">
                <tr className="text-left text-sm font-semibold text-dark-emerald-800">
                  <th className="px-5 py-4">Sr.No</th>
                  <th className="px-5 py-4">Method</th>
                  <th className="px-5 py-4">Date of payment</th>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Due amount</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-ash-grey-200">
                {rows.length === 0 ? (
                  <tr>
                    <td className="px-5 py-6 text-dark-emerald-700" colSpan={6}>
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr key={r.srNo} className="text-sm text-dark-emerald-800">
                      <td className="px-5 py-4">{r.srNo}</td>
                      <td className="px-5 py-4">{r.method}</td>
                      <td className="px-5 py-4">{r.paymentDate}</td>
                      <td className="px-5 py-4">{r.planLabel}</td>
                      <td className="px-5 py-4">₹{r.amount}</td>
                      <td className="px-5 py-4">₹{r.dueAmount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPayments;
