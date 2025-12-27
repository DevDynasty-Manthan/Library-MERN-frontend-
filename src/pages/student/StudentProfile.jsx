import React, { useEffect, useMemo, useState } from "react";
import { getStudentData } from "../../features/auth/authApi.js";

const StudentProfile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  // Edit state (UI only for now)
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getStudentData(); // { ok, data }
        const student = res?.data;

        setProfile(student);
        setForm({
          name: student?.userId?.name || "",
          email: student?.userId?.email || "",
          phone: student?.userId?.phone || "",
        });
      } catch (e) {
        setError(
          e?.response?.data?.message || e?.message || "Failed to load profile"
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const initials = useMemo(() => {
    const n = (profile?.userId?.name || "Student").trim();
    return n.slice(0, 1).toUpperCase();
  }, [profile]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 text-dark-emerald-800 shadow-sm">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-deep-crimson-200 bg-deep-crimson-50 p-6 text-deep-crimson-900 shadow-sm">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 text-dark-emerald-800 shadow-sm">
        No profile data found.
      </div>
    );
  }

  const handleCancel = () => {
    setIsEditing(false);
    setForm({
      name: profile?.userId?.name || "",
      email: profile?.userId?.email || "",
      phone: profile?.userId?.phone || "",
    });
  };

  const handleSave = async () => {
    // IMPORTANT:
    // These fields belong to User model, so later you should call PATCH /users/me
    // For now just update local UI so you can see the edit working.
    setProfile((prev) => ({
      ...(prev || {}),
      userId: {
        ...(prev?.userId || {}),
        name: form.name,
        email: form.email,
        phone: form.phone,
      },
    }));
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-dark-emerald-900">My Profile</h1>
        <p className="mt-2 text-base text-dark-emerald-700">
          View and update your basic details.
        </p>
      </div>

      {/* Profile card */}
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-pine-teal-100 text-dark-emerald-900">
              <span className="text-2xl font-bold">{initials}</span>
            </div>

            <div>
              <p className="text-xl font-semibold text-dark-emerald-900">
                {profile?.userId?.name || "Student"}
              </p>
              <p className="mt-1 text-sm text-dark-emerald-700">
                Student account
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 px-5 py-3 text-base font-semibold text-dark-emerald-800 transition hover:bg-ash-grey-100 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
              >
                Edit
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-2xl border border-ash-grey-200 bg-white px-5 py-3 text-base font-semibold text-dark-emerald-800 transition hover:bg-ash-grey-50 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
              >
                Cancel
              </button>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={!isEditing}
              className="rounded-2xl bg-pine-teal-600 px-5 py-3 text-base font-semibold text-dark-emerald-950 transition hover:bg-pine-teal-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
            >
              Save
            </button>
          </div>
        </div>

        {/* Fields */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {/* Name */}
          <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-4">
            <p className="text-sm font-semibold text-dark-emerald-800">Name</p>
            {!isEditing ? (
              <p className="mt-1 text-base text-dark-emerald-900">
                {profile?.userId?.name || "—"}
              </p>
            ) : (
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-ash-grey-200 bg-white p-3 text-dark-emerald-900 outline-none focus:border-pine-teal-400 focus:ring-2 focus:ring-pine-teal-300/70"
                placeholder="Enter name"
              />
            )}
          </div>

          {/* Email */}
          <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-4">
            <p className="text-sm font-semibold text-dark-emerald-800">Email</p>
            {!isEditing ? (
              <p className="mt-1 text-base text-dark-emerald-900">
                {profile?.userId?.email || "—"}
              </p>
            ) : (
              <input
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-ash-grey-200 bg-white p-3 text-dark-emerald-900 outline-none focus:border-pine-teal-400 focus:ring-2 focus:ring-pine-teal-300/70"
                placeholder="Enter email"
              />
            )}
          </div>

          {/* Phone */}
          <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-4">
            <p className="text-sm font-semibold text-dark-emerald-800">Phone</p>
            {!isEditing ? (
              <p className="mt-1 text-base text-dark-emerald-900">
                {profile?.userId?.phone || "—"}
              </p>
            ) : (
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value }))
                }
                className="mt-2 w-full rounded-2xl border border-ash-grey-200 bg-white p-3 text-dark-emerald-900 outline-none focus:border-pine-teal-400 focus:ring-2 focus:ring-pine-teal-300/70"
                placeholder="Enter phone"
              />
            )}
          </div>
        </div>
      </div>

      {/* Membership */}
      <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-dark-emerald-900">
          Membership
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-4">
            <p className="text-sm font-semibold text-dark-emerald-800">Plan</p>
            <p className="mt-1 text-base text-dark-emerald-900">
              {profile?.plan?.name || profile?.plan?.code || "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-4">
            <p className="text-sm font-semibold text-dark-emerald-800">Seat</p>
            <p className="mt-1 text-base text-dark-emerald-900">
              {profile?.SeatNo ?? "—"}
            </p>
          </div>

          <div className="rounded-2xl border border-ash-grey-200 bg-ash-grey-50 p-4">
            <p className="text-sm font-semibold text-dark-emerald-800">Status</p>
            <p className="mt-1 text-base font-semibold text-pine-teal-700">
              {profile?.membershipStatus || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
