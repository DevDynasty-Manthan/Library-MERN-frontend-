import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getStudentData } from "../../features/auth/authApi.js";

const StatCard = ({ label, value, hint, to }) => {
  const card = (
    <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <p className="text-sm font-semibold text-dark-emerald-700">{label}</p>
      <p className="mt-2 text-2xl font-bold text-dark-emerald-900">{value}</p>
      {hint && <p className="mt-2 text-sm text-dark-emerald-700">{hint}</p>}
    </div>
  );

  return to ? (
    <Link
      to={to}
      className="block rounded-3xl focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
    >
      {card}
    </Link>
  ) : (
    card
  );
};

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getStudentData(); // { ok, data }
        setStudent(res?.data || null);
      } catch (e) {
        setStudent(null);
        setError(e?.response?.data?.message || e?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const ui = useMemo(() => {
    const name = student?.userId?.name || "Student";
    const plan = student?.plan?.code || student?.plan?.name || "—";
    const seat = student?.SeatNo ?? "—";
    const status = student?.membershipStatus || "—";

    return { name, plan, seat, status };
  }, [student]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 text-dark-emerald-800 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-deep-crimson-200 bg-deep-crimson-50 p-6 text-deep-crimson-900 shadow-sm">
        {error}
        <div className="mt-4">
          <Link
            to="/onboarding/admission"
            className="inline-block rounded-2xl bg-pine-teal-600 px-5 py-3 text-base font-semibold text-dark-emerald-950 hover:bg-pine-teal-500"
          >
            Complete onboarding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-dark-emerald-900">
          Welcome, {ui.name}
        </h1>
        <p className="mt-2 text-base text-dark-emerald-700">
          Here’s your membership overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Plan" value={ui.plan} hint="Your selected plan" />
        <StatCard label="Seat No" value={String(ui.seat)} hint="Your assigned seat" />
        <StatCard label="Membership" value={ui.status} hint="Current status" />
        <StatCard label="Profile" value="View" hint="Account details" to="/student/profile" />
      </div>

      {/* Quick actions */}
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-dark-emerald-900">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/student/profile"
            className="rounded-2xl bg-pine-teal-600 px-5 py-3 text-base font-semibold text-dark-emerald-950 transition hover:bg-pine-teal-500"
          >
            Go to Profile
          </Link>

          <Link
            to="/student/payments"
            className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 px-5 py-3 text-base font-semibold text-dark-emerald-800 transition hover:bg-ash-grey-100"
          >
            Payment history (later)
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
