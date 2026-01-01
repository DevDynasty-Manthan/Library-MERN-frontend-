import React, { useEffect, useMemo, useState } from "react";
import OnboardLayout from "../../layouts/OnboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import { getSeats, selectSeat, getSessionDetails } from "../../features/auth/authApi.js";
import { Loader2, ArrowLeft, ArrowRight, Armchair, Info, CheckCircle2 } from "lucide-react";

const SeatStep = () => {
  const navigate = useNavigate();

  const [seatPayload, setSeatPayload] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      await selectSeat({ seatNo: selectedSeat });
      navigate("/onboarding/payment");
    } catch (err) {
      console.error("Seat select failed:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardLayout
      currentStep={3}
      totalSteps={4}
      stepLabels={["Admission", "Plan", "Seat", "Payment"]}
    >
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-[900] text-[#0d1b18] tracking-tight mb-2">
          Reserve your spot
        </h1>
        <p className="text-lg text-gray-500 font-bold">
          Select a seat from the available options below to finalize your desk.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#11d4a4]">
          <Loader2 className="animate-spin mb-4" size={48} strokeWidth={2.5} />
          <p className="font-[900] uppercase tracking-widest text-sm text-gray-400">Loading Floor Map...</p>
        </div>
      ) : !seatPayload ? (
        <div className="rounded-[32px] border-2 border-red-100 bg-red-50 p-8 text-center">
          <p className="text-red-600 font-bold mb-4">No active session found. Please re-select your plan.</p>
          <button onClick={() => navigate(-1)} className="bg-[#0d1b18] text-white px-6 py-2 rounded-xl font-bold">Go Back</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Interactive Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-[32px] border-2 border-[#e7f3f0] p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between mb-8 pb-6 border-b border-[#e7f3f0] gap-4">
                <div className="flex items-center gap-2">
                  <Armchair size={20} className="text-[#11d4a4]" />
                  <span className="font-[900] text-[#0d1b18] uppercase tracking-wider text-sm">Study Hall Map</span>
                </div>
                
                {/* Legend */}
                <div className="flex gap-4 text-[10px] font-[900] uppercase tracking-widest text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-md bg-[#f6f8f8] border-2 border-gray-200" /> Available
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-md bg-[#11d4a4]" /> Selected
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <div className="w-3 h-3 rounded-md bg-gray-100" /> Occupied
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {totalSeats.map((seatNo) => {
                  const isOccupied = occupiedSet.has(seatNo);
                  const isSelected = selectedSeat === seatNo;

                  return (
                    <button
                      key={seatNo}
                      type="button"
                      disabled={isOccupied}
                      onClick={() => setSelectedSeat(seatNo)}
                      className={`
                        h-12 md:h-14 rounded-2xl text-sm font-[900] transition-all relative border-2
                        ${isOccupied 
                          ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed" 
                          : isSelected
                            ? "bg-[#11d4a4] border-[#11d4a4] text-[#0d1b18] shadow-lg shadow-[#11d4a4]/20 scale-105 z-10"
                            : "bg-white border-[#e7f3f0] text-[#0d1b18] hover:border-[#11d4a4] hover:bg-[#f6f8f8]"
                        }
                      `}
                    >
                      {seatNo}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex gap-3 p-4 bg-[#f6f8f8] rounded-2xl">
                <Info size={18} className="text-[#11d4a4] shrink-0" />
                <p className="text-xs font-bold text-gray-500 leading-relaxed">
                  Seats are assigned on a first-come, first-served basis. Your selection is reserved once you complete the payment in the next step.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-8">
            <div className="bg-[#0d1b18] rounded-[32px] p-8 text-white shadow-2xl">
              <h2 className="text-xl font-[900] mb-8 tracking-tight">Booking Details</h2>
              
              <div className="space-y-6 mb-10">
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-[900] uppercase tracking-[0.2em] text-[#11d4a4] mb-1">Selected Seat</p>
                    <p className="text-4xl font-[900]">{selectedSeat || "--"}</p>
                  </div>
                  {selectedSeat && <CheckCircle2 className="text-[#11d4a4]" size={32} />}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Plan Type</span>
                    <span className="text-[#11d4a4] uppercase">{seatPayload.planCode}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-gray-400">Availability</span>
                    <span>{seatPayload.capacity - (seatPayload.occupiedSeats?.length || 0)} left</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold text-gray-400">Total Capacity</span>
                    <span className="text-lg font-[900]">{seatPayload.capacity}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleContinue}
                  disabled={!selectedSeat || isSubmitting}
                  className="w-full h-14 bg-[#11d4a4] text-[#0d1b18] rounded-2xl font-[900] flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-20 active:scale-95"
                >
                  {isSubmitting ? "Processing..." : "Continue to Payment"}
                  <ArrowRight size={20} strokeWidth={3} />
                </button>
                
                <button
                  onClick={() => navigate(-1)}
                  className="w-full h-14 bg-white/5 text-white rounded-2xl font-[900] flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                >
                  <ArrowLeft size={18} strokeWidth={3} />
                  Change Plan
                </button>
              </div>
            </div>
          </div>

        </div>
      )}
    </OnboardLayout>
  );
};

export default SeatStep;