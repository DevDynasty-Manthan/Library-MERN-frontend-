import React, { useEffect, useMemo, useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import { getSeats, selectSeat, getSessionDetails } from "../../features/auth/authApi.js";

const SeatStep = () => {
  const navigate = useNavigate();

  // backend payload object: { planId, planCode, capacity, occupiedSeats, availableSeats, totalSeats }
  const [seatPayload, setSeatPayload] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);

  const occupiedSet = useMemo(() => {
    const occ = seatPayload?.occupiedSeats || [];
    return new Set(occ);
  }, [seatPayload]);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        const sessionDetails = await getSessionDetails();

        const planIdFromSession =
          sessionDetails?.data?.sessionData?.plan?._id ||
          sessionDetails?.data?.sessionData?.plan;

        if (!planIdFromSession) {
          setLoading(false);
          return;
        }

        const seatRes = await getSeats(planIdFromSession);
        // IMPORTANT: depends on your getSeats() helper.
        // If getSeats returns response.data => seatRes.data is payload
        // If getSeats returns response.data.data => seatRes is payload
        const payload = seatRes?.data ?? seatRes;

        setSeatPayload(payload);
      } catch (err) {
        console.error("Error fetching seats:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const totalSeats = seatPayload?.totalSeats || [];

  const handleContinue = async () => {
    if (!selectedSeat) return;
    try {
      await selectSeat({ seatNo: selectedSeat });
      navigate("/onboarding/payment");
    } catch (err) {
      console.error("Seat select failed:", err);
    }
  };

  return (
    <OnboardLayout
      currentStep={3}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">Select your seat</h2>
          <p className="mt-1 text-sm text-slate-600">
            Pick one available seat. Occupied seats are disabled.
          </p>
        </div>

        {/* Plan info */}
        {seatPayload && (
          <div className="mb-5 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-700">
              <div>
                Plan: <span className="font-medium">{seatPayload.planCode}</span>
              </div>
              <div>
                Capacity: <span className="font-medium">{seatPayload.capacity}</span>
              </div>
              <div>
                Occupied: <span className="font-medium">{seatPayload.occupiedSeats?.length || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* Loading / empty states */}
        {loading && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-700">
            Loading available seats...
          </div>
        )}

        {!loading && !seatPayload && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-amber-900">
            Plan not found in session. Go back and select a plan again.
          </div>
        )}

        {/* Seat grid */}
        {!loading && seatPayload && (
          <>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-emerald-100 ring-1 ring-emerald-300" />
                  Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-slate-200 ring-1 ring-slate-300" />
                  Occupied
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded bg-emerald-600 ring-1 ring-emerald-700" />
                  Selected
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {totalSeats.map((seatNo) => {
                  const isOccupied = occupiedSet.has(seatNo);
                  const isSelected = selectedSeat === seatNo;

                  const base =
                    "h-10 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400";
                  const occupied =
                    "cursor-not-allowed bg-slate-200 text-slate-400 ring-1 ring-slate-300";
                  const available =
                    "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200 hover:bg-emerald-100";
                  const selected =
                    "bg-emerald-600 text-white ring-1 ring-emerald-700";

                  return (
                    <button
                      key={seatNo}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setSelectedSeat(seatNo)}
                      className={[
                        base,
                        isOccupied ? occupied : available,
                        isSelected ? selected : "",
                      ].join(" ")}
                      title={isOccupied ? "Occupied" : `Seat ${seatNo}`}
                    >
                      {seatNo}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!selectedSeat}
                onClick={handleContinue}
                className="rounded-md bg-emerald-600 px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue
              </button>
            </div>
          </>
        )}
      </div>
    </OnboardLayout>
  );
};

export default SeatStep;
