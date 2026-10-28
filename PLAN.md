# Campus Auction App — Basic Plan

**Goal:** A working app that demonstrates the full auction lifecycle:
list item → place bids → auction closes → seller approves → campus handover → sale complete.

> Priority: a reliable bidding and closing system matters more than visual polish. Get Phases 1–4 working first.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + TypeScript + Vite (Tailwind, React Router) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Real-time | Socket.IO |
| Images | Cloudinary (store URLs in DB) |
| Auth | JWT in HttpOnly cookies |
| Notifications | In-app + Web Notifications API |
| Deploy | Vercel (frontend), Render (backend + Postgres) |

---

## Phases

1. **MVP & UI setup** — Home page, auction cards, item details, login/register, navigation. Define roles and auction statuses.
2. **Listings & browsing** — Create/edit/cancel listings with photos. Search and filter by keyword, category, condition, price, closing soon. Per-item countdown.
3. **Live bidding** — Server-side bid validation, public bid history, current leading bid, real-time updates via Socket.IO.
4. **Closing & seller decision** — Auto-stop bidding at deadline, pick highest valid bid, seller approves/rejects, record outcome.
5. **Notifications** — In-app alerts (outbid, auction ended, seller decision, handover updates) plus browser pop-ups with permission.
6. **Test, deploy, demo** — Test simultaneous bids, closing edge cases, permissions, full purchase flow. Seed demo accounts and items.

---

## Database (6 tables)

- **users** — id, name, email, password_hash, campus_id
- **auctions** — id, seller_id, title, category, description, condition, starting_price, min_increment, closes_at, status, cancel_reason, cancelled_at
- **auction_images** — id, auction_id, image_url
- **bids** — id, auction_id, bidder_id, amount, created_at (append-only; use a sequence/id for tie-breaking)
- **sales** — id, auction_id (**UNIQUE**), winner_id, winning_amount, seller_decision, handover_status, outcome, handover_confirmed_by_seller_at, handover_confirmed_by_buyer_at, failure_reason
- **notifications** — id, user_id, auction_id, type, message, read_at

Notes: money as `NUMERIC`; timestamps in UTC.

**Auction statuses:**
`DRAFT → LIVE → ENDED → AWAITING_SELLER_DECISION → RESERVED → COMPLETED`
Other outcomes: `UNSOLD`, `REJECTED`, `CANCELLED`, `FAILED_PICKUP`

---

## Bidding Rules (enforced on the server)

- First bid ≥ starting price; later bids ≥ current price + minimum increment.
- Reject any bid after closing time (use the **server clock**, not the browser).
- Wrap each bid in a PostgreSQL transaction with `SELECT ... FOR UPDATE` on the auction row to handle simultaneous bids.
- Every bid records bidder, amount, and time. All bids are public.

**Example:** start ₹200, increment ₹20, leading ₹260 → ₹250/260/270 rejected, ₹280 accepted.

---

## Closing & Sale Flow

1. Closing time reached → bidding stops.
2. No bids → mark `UNSOLD`.
3. Bids exist → highest valid bid is provisional winner → `AWAITING_SELLER_DECISION`.
4. Seller **approves** → `RESERVED` for winner → handover confirmed → `COMPLETED`.
5. Seller **rejects**, cancels, or pickup fails → record clear outcome (`REJECTED` / `CANCELLED` / `FAILED_PICKUP`).

A periodic background job finalizes expired auctions (idempotent — safe to run repeatedly). The bid API also checks expiry independently.

---

## Rules & Clarifications (all enforced on the backend)

### Bidding
- **Seller cannot bid on their own auction.** Reject if `bidder_id = seller_id`.
- **Equal bids:** the first accepted bid stays the leader. A later bid of the same amount is rejected (it is below current price + increment). If amounts ever tie, order by `created_at`, then `id`.

### Editing a listing
- **Before any bid:** all fields may be edited.
- **After the first bid:** starting price, minimum increment, and closing time cannot be changed. Closing time may not be shortened. Only description and photos may be edited, and edits are logged.
- **Not editable once the auction is ENDED or later.**

### Cancelling a listing
- Allowed while `DRAFT` or `LIVE`. A reason is required and stored in `cancel_reason`.
- If bids exist, cancellation is allowed but all bidders are notified, and the bids are kept in history.
- Not allowed once `RESERVED`, `COMPLETED`, or in any terminal state. After a seller rejection, pickup failure, or `UNSOLD`, the item is simply relisted by hand.

### Closing and sales
- **One sale record per auction:** enforced by a `UNIQUE (auction_id)` constraint on `sales`.
- The closing job locks the auction row, checks `status = 'LIVE' AND closes_at <= now()`, and creates the sale with `INSERT ... ON CONFLICT DO NOTHING`. Retrying it is harmless.

### Handover
- Record **who** confirmed and **when**, separately for seller and buyer.
- Sale becomes `COMPLETED` when both confirm. Either party can report a failed pickup with a reason, which sets `FAILED_PICKUP`.
- Seller and winning buyer can both see the sale outcome in My activity.

### Campus access
- **Hackathon:** pre-seeded demo accounts or a fixed list of allowed emails. Clearly labelled as demo-only.
- **Production:** official campus email verification (e.g. one-time link to the college domain). Not built in the hackathon.

---

## Pages (8)

1. Marketplace (search, filters, cards with countdowns)
2. Auction detail (photos, details, bid form, bid history)
3. Create/edit listing
4. Seller dashboard (manage listings, approve/reject winners)
5. Notifications
6. My activity (bids, wins, reservations, purchases)
7. Login/register
8. Handover confirmation

---

## Out of Scope

Microservices, Kubernetes, AI models, extra pages beyond the eight above.
