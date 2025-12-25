# Admission / Registration Onboarding (MERN)

Multi-step onboarding flow with Plan selection → Seat selection → Payment (Cash/Online via Razorpay) → Final registration.

## Tech Stack

- Frontend: React + React Router + Axios + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Payment Gateway (Online): Razorpay Standard Checkout

---

## What is implemented till now

### Backend (Completed)
- Step 1: Admission basic details saved to `RegistrationSession`
- Step 2: Personal/Education details saved to `RegistrationSession`
- Step 3: Plan selection saved to `RegistrationSession`
- Step 4: Seat selection + seat assignment logic
- Step 4 (extra): Get available seats for a plan
- Step 5: Payment
  - Online: Create Razorpay order + verify payment signature
  - Finalize: Create `User`, `Student`, `Payment`, `seatAssignment` and mark session complete

### Frontend (Completed)
- Step 3 (Plans UI): Fetch plans, show them, store selected plan in session
- Step 4 (Seats UI): Fetch planId from session, fetch seats by planId, select seat, submit
- Step 5 (Payment UI):
  - Show cash + online options
  - Online loads Razorpay Checkout script, creates order from backend, opens Razorpay checkout, verifies payment

---

## Core concept: RegistrationSession

`RegistrationSession` is the single source of truth for onboarding progress:
- Stores step-wise data (`step1`, `step2`, `step3`, `step4`, `step5`)
- Tracks what is completed and what is pending
- Allows resuming onboarding (refresh safe)

---

## Step-wise workflow

## Step 3: Plan selection

### Backend
- Client selects a plan
- Backend saves the plan in session:
  - `session.step3.planId = selectedPlanId`
  - `session.step3.completed = true`

### Frontend
- Fetch available plans
- User selects one plan
- Call backend step3 API to store it in session

---

## Step 4: Seat selection

### Backend: Get available seats
**Endpoint**
- `GET /api/seats/available?planId=<planId>`

**Logic**
- Validate `planId`
- Find plan and its `capacity`
- Fetch already assigned seats (`seatAssignment` where `status="assigned"`)
- Return:
  - `totalSeats` (1..capacity)
  - `occupiedSeats`
  - `availableSeats`

### Frontend
**SeatStep behaviour**
1. Call session status/details API
2. Read planId from session
3. Call `GET /seats/available?planId=...`
4. Render a seat grid:
   - occupied seats disabled
   - user selects one seat
5. On continue:
   - call backend `step4_selectSeat` to lock the seat

---

## Step 5: Payment

Two options:
- Cash (verification flow)
- Online (Razorpay)

### Cash workflow (planned / simple version)
1. User selects Cash
2. System creates a pending cash payment intent/status
3. Admin/receiver verifies cash by OTP or admin confirmation
4. Backend marks payment verified and completes onboarding

> Note: Admin-side verification is recommended so user cannot fake cash confirmation.

---

## Online workflow (Razorpay Standard Checkout)

### 1) Create order (Backend)
**Endpoint**
- `POST /api/onboarding/step5/create-order`

**Backend checks**
- Session exists
- Step4 is completed (seat selected)
- Plan exists and has valid `fees`

**Razorpay Order Create**
Backend creates order with:
- `amount`: `fees * 100` (paise)
- `currency`: `"INR"`
- `receipt`: short string (<= 40 chars)
- `notes`: metadata (sessionId, planId, seatNo, email)

Backend stores:
- `session.step5.orderId`
- `session.step5.amount`
- `session.step5.completed = false`

Backend returns to frontend:
- `keyId` (public Razorpay key_id)
- `orderId`
- `amount` (paise)
- `currency`

### 2) Open checkout (Frontend)
1. Load Razorpay script `https://checkout.razorpay.com/v1/checkout.js`
2. Call create-order API
3. Build checkout options:
   - `key`
   - `order_id`
   - `amount`
   - `currency`
   - `handler` callback

4. Open:
- `new window.Razorpay(options).open()`

### 3) Verify payment (Backend)
After success, Razorpay returns:
- `razorpay_payment_id`
- `razorpay_order_id`
- `razorpay_signature`

Frontend sends these to:
- `POST /api/onboarding/step5/verify-payment`

Backend:
- Generates HMAC SHA256 using Razorpay key_secret:
  - message = `orderId + "|" + paymentId`
- Compares with received signature
- If valid:
  - creates User, Payment, Student, seatAssignment
  - marks session complete

---

## Common issues faced + fixes

### 1) planId becomes null in seats request
**Reason**
- React state updates are async; calling API immediately after `setPlanId()` uses old value.

**Fix**
- Use a single init function:
  - get session → get planId → call seats API
OR
- Use a second `useEffect` that depends on `planId`

---

### 2) Seats API returns object but UI checks `seats.length`
**Reason**
- Backend returns:
  - `{ ok: true, data: { totalSeats: [], availableSeats: [] } }`
So `data` is an object, not an array.

**Fix**
- Store payload correctly and map `payload.totalSeats`

---

### 3) Razorpay create order failed: `receipt length must be no more than 40`
**Reason**
- Receipt exceeded Razorpay limit.

**Fix**
- Make receipt shorter (example: `onb_<sessionId>`)
- Put detailed info in `notes`

---

### 4) Razorpay checkout error: Authentication key missing
**Reason**
- `options.key` was undefined OR wrong nesting while reading response.

**Fix**
- Ensure backend sends public `keyId`
- Ensure frontend passes `key: keyId`

---

### 5) Verify payment failed: `email is required`
**Reason**
- Session schema path mismatch (email not found at `session.step1.email`).

**Fix**
- Use `req.user.email` or `session.email` consistently when creating the User.
- Add validation before creating documents.

---

## API summary (important)

- `GET /api/plans`
- `POST /api/onboarding/step3/plan`
- `GET /api/seats/available?planId=...`
- `POST /api/onboarding/step4/seat`
- `POST /api/onboarding/step5/create-order`
- `POST /api/onboarding/step5/verify-payment`
- `GET /api/onboarding/status` (session resume)

---

## Next steps (future improvements)
- Add cash OTP verification + admin panel flow
- Add Razorpay webhook for reliability (payment update even if user closes tab)
- Add idempotency checks (avoid duplicate user creation on retry)
- Improve seat lock strategy (hold seat for X minutes until payment completes)
