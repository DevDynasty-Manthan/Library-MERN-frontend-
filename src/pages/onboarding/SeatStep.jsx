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
          setSeatPayload(null);
          return;
        }

        const seatRes = await getSeats(planIdFromSession);
        const payload = seatRes?.data ?? seatRes;

        setSeatPayload(payload);
      } catch (err) {
        console.error("Error fetching seats:", err);
        setSeatPayload(null);
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-dark-emerald-900">
            Select Your Seat
          </h2>
          <p className="mt-2 text-base text-dark-emerald-700">
            Pick one available seat. Occupied seats are disabled.
          </p>
        </div>

        {/* Plan info */}
        {seatPayload && (
          <div className="mb-6 rounded-3xl border border-ash-grey-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-x-10 gap-y-2 text-base font-semibold text-dark-emerald-800">
              <div>
                Plan: <span className="text-dark-emerald-900">{seatPayload.planCode}</span>
              </div>
              <div>
                Capacity: <span className="text-dark-emerald-900">{seatPayload.capacity}</span>
              </div>
              <div>
                Occupied:{" "}
                <span className="text-dark-emerald-900">
                  {seatPayload.occupiedSeats?.length || 0}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Loading / empty states */}
        {loading && (
          <div className="rounded-3xl border border-ash-grey-200 bg-ash-grey-50 p-8 text-center text-dark-emerald-700 shadow-sm">
            <div className="mb-2 inline-block animate-spin text-2xl">🔄</div>
            <p className="text-base font-semibold">Loading available seats...</p>
          </div>
        )}

        {!loading && !seatPayload && (
          <div className="rounded-3xl border border-light-coral-200 bg-light-coral-50 p-6 text-light-coral-900">
            Plan not found in session. Go back and select a plan again.
          </div>
        )}

        {/* Seat grid */}
        {!loading && seatPayload && (
          <>
            <div className="rounded-3xl border border-ash-grey-200 bg-white p-6 shadow-sm">
              {/* Legend */}
              <div className="mb-5 flex flex-wrap items-center gap-5 text-sm font-semibold text-dark-emerald-700">
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded bg-pine-teal-100 ring-1 ring-pine-teal-300" />
                  Available
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded bg-ash-grey-200 ring-1 ring-ash-grey-300" />
                  Occupied
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-3.5 w-3.5 rounded bg-pine-teal-600 ring-1 ring-pine-teal-700" />
                  Selected
                </span>
              </div>

              <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
                {totalSeats.map((seatNo) => {
                  const isOccupied = occupiedSet.has(seatNo);
                  const isSelected = selectedSeat === seatNo;

                  const base =
                    "h-11 rounded-2xl text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-pine-teal-300/70";
                  const occupied =
                    "cursor-not-allowed bg-ash-grey-200 text-ash-grey-500 ring-1 ring-ash-grey-300";
                  const available =
                    "bg-pine-teal-50 text-dark-emerald-900 ring-1 ring-pine-teal-200 hover:bg-pine-teal-100";
                  const selected =
                    "bg-pine-teal-600 text-dark-emerald-950 ring-1 ring-pine-teal-700";

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
            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-2xl border border-ash-grey-200 bg-white px-5 py-3 text-base font-semibold text-dark-emerald-800 transition hover:bg-ash-grey-50 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
              >
                Back
              </button>

              <button
                type="button"
                disabled={!selectedSeat}
                onClick={handleContinue}
                className="rounded-2xl bg-pine-teal-600 px-6 py-3 text-base font-semibold text-dark-emerald-950 transition hover:bg-pine-teal-500 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-pine-teal-300/60"
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
