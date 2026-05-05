# Buy4Chai — Payment Gateway Integration Guide

> The complete reference for how payments work in Buy4Chai.
> If you're a developer, contributor, or AI tool reading this — start here.
> This document is the source of truth for all gateway integration decisions.

---

## Before You Read — The Core Constraint

Buy4Chai is a **fully static website**. No server. No backend. No database.

This one constraint determines everything about how gateways work here. It rules out some integrations (anything needing secret keys or server-side API calls) and shapes how we handle amounts, verification, and UPI.

---

## Part 1 — The Two Payment Systems

Buy4Chai has two independent payment systems. They can run together or alone.

### System A: Gateway

A payment gateway (Razorpay, Dodo, PayPal, etc.) handles card payments, netbanking, and international transactions. Configured via `gateway` in `chai.config.js`.

### System B: UPI

UPI is India's direct payment protocol. Works with any UPI ID — no API, no SDK, no gateway account needed. Configured via the `upi` block in `chai.config.js`. UPI is independent of the gateway and can be enabled or disabled separately.

**On the supporter page:**
- If both are enabled → Gateway button appears first, then "Or pay via UPI" section below
- If only gateway → Only gateway button shown
- If only UPI → Only UPI section shown
- If neither → Page hides the payment UI entirely (edge case, not recommended)

---

## Part 2 — Gateway Tiers

Not every developer has full API access. Buy4Chai supports four tiers of integration, from zero-code to full SDK.

### Tier 0 — Manual Links (No API)

**What you need:** Pre-created payment links or buttons from your gateway dashboard.

**What you can do:** Accept fixed preset amounts. No custom amounts.

**Setup time:** 5 minutes.

**How it works:** Each preset amount maps to a pre-created link. When a supporter clicks ₹100, they're redirected to the link you created for ₹100.

```js
// chai.config.js
export default {
  gateway: "manual-links",
  allowCustomAmount: false, // Must be false — links are fixed price

  paymentLinks: {
    50:  "https://rzp.io/l/yourlink-50",
    100: "https://rzp.io/l/yourlink-100",
    250: "https://rzp.io/l/yourlink-250",
    500: "https://rzp.io/l/yourlink-500",
  },

  suggestedAmounts: [50, 100, 250, 500], // Must match paymentLinks keys
}
```

**When to use this:** You have a Razorpay/PayU/Instamojo account but don't want to deal with API keys. Just create payment links in the dashboard and paste them in.

---

### Tier 1 — Static Product IDs

**What you need:** A gateway account where you create products with fixed prices.

**What you can do:** Accept fixed preset amounts. No custom amounts.

**Setup time:** 15 minutes.

**How it works:** You create a product in the gateway dashboard for each amount. Each product has a unique ID. The gateway file maps amounts to product IDs and redirects to the hosted checkout.

```js
// chai.config.js — Dodo example
export default {
  gateway: "dodo",
  gatewayKey: "prod_XXXXXXXXXXXX", // Your primary/default product ID
  allowCustomAmount: false,

  // Optional: Multiple product IDs for different amounts
  // If not set, gatewayKey is used for all amounts
  productIds: {
    200: "prod_aaa111",  // $2 equivalent
    500: "prod_bbb222",  // $5 equivalent
    1000: "prod_ccc333", // $10 equivalent
  },
}
```

**Examples:** Dodo Payments, Gumroad, Lemon Squeezy.

---

### Tier 2 — Dynamic SDK (Full API)

**What you need:** API access and a public/client key from your gateway.

**What you can do:** Accept any amount including custom amounts. Full UX control.

**Setup time:** 20 minutes.

**How it works:** A JavaScript SDK loads on click, opens a modal/overlay, and you pass the amount dynamically at runtime. The user can pay any amount they choose.

```js
// chai.config.js — Razorpay example
export default {
  gateway: "razorpay",
  gatewayKey: "rzp_live_XXXXXXXXXXXX", // Public Key ID only
  allowCustomAmount: true, // SDK supports it

  suggestedAmounts: [50, 100, 250, 500],
  defaultAmount: 100,
  currency: "INR",
}
```

**Examples:** Razorpay SDK, Stripe Payment Element, PayPal JS SDK, Cashfree.

---

### Tier 3 — UPI Direct (No Gateway at All)

**What you need:** Just a UPI ID (e.g. `yourname@paytm`).

**What you can do:** Accept any amount, including custom. Cannot verify payments.

**Setup time:** 2 minutes.

**How it works:** Buy4Chai generates a UPI payment URL with the amount embedded. On mobile, this opens the user's UPI app directly. On desktop, a QR code is shown.

```js
// chai.config.js — UPI only (no gateway)
export default {
  gateway: null, // No gateway

  upi: {
    enabled: true,
    id: "yourname@paytm",
    name: "Your Name",
  },

  suggestedAmounts: [50, 100, 250, 500],
  allowCustomAmount: true,
  currency: "INR",
}
```

**Note:** UPI cannot confirm whether payment was made. The page shows a "thank you" message but cannot verify. For a voluntary tip tool, this is acceptable.

---

## Part 3 — UPI Configuration

UPI is independent of the gateway. You can add it alongside any gateway or use it as the sole payment method.

### UPI + Gateway Together

```js
export default {
  // Primary gateway
  gateway: "razorpay",
  gatewayKey: "rzp_live_...",

  // UPI shown below the gateway button
  upi: {
    enabled: true,
    id: "yourname@upi",
    name: "Your Name",
  },
}
```

On the supporter page, supporters see:
1. "Support with Razorpay" button (gateway)
2. A divider "Or pay via UPI"
3. UPI QR code + copy button (UPI)

### UPI Only (No Gateway)

```js
export default {
  gateway: null,

  upi: {
    enabled: true,
    id: "yourname@upi",
    name: "Your Name",
  },
}
```

Page shows only the UPI section. No gateway button.

### Gateway Only (No UPI)

```js
export default {
  gateway: "razorpay",
  gatewayKey: "rzp_live_...",

  upi: {
    enabled: false, // or just omit the upi block entirely
  },
}
```

### UPI Behaviour

| Device | Behaviour |
|--------|-----------|
| Mobile (Android/iOS) | "Pay via UPI" button → opens UPI app directly |
| Desktop | QR code shown → supporter scans with phone |
| Any | UPI ID shown with copy button as fallback |

The UPI URL format:
```
upi://pay?pa={upiId}&pn={name}&am={amount}&cu=INR&tn=Buy4Chai
```

---

## Part 4 — The `allowCustomAmount` Toggle

This toggle controls whether supporters can enter a custom amount beyond the presets.

```js
// chai.config.js
allowCustomAmount: true  // Show custom amount input
allowCustomAmount: false // Show presets only, no custom input
```

**Rules:**

| Gateway Type | allowCustomAmount: true | allowCustomAmount: false |
|-------------|------------------------|--------------------------|
| Tier 2 (SDK) | ✅ Works — amount passed to SDK | ✅ Works — preset only |
| Tier 1 (Static) | ⚠️ Not supported — must set false | ✅ Works — preset only |
| Tier 0 (Manual Links) | ⚠️ Not supported — must set false | ✅ Works — preset only |
| UPI | ✅ Works — amount in UPI URL | ✅ Works — preset only |

If `allowCustomAmount: true` is set for a Tier 0/1 gateway, the UI will ignore the setting and treat it as `false`. The gateway file exports its capabilities (see Part 5) and the UI respects them.

---

## Part 5 — The Gateway Contract

Every gateway file lives at `src/gateways/[name].js` and must export:

### Required Export: `gatewayCapabilities`

```js
export const gatewayCapabilities = {
  // Can this gateway accept a dynamically passed amount?
  supportsCustomAmount: true | false,

  // Does this gateway need pre-created links/product IDs per amount?
  requiresPresetLinks: true | false,

  // How does verification work?
  verificationType: "client" | "redirect" | "none",

  // What tier is this gateway?
  tier: 0 | 1 | 2 | 3,
};
```

### Required Export: `initPayment`

```js
export async function initPayment(amount, config) {
  // amount: Amount in smallest currency unit (paise for INR — ₹100 = 10000)
  // config: Full chai.config.js object
  // Returns: Promise — resolves on success, rejects on failure or cancel
}
```

### Optional Export: `checkReturn`

Required for redirect-based gateways (Tier 0, Tier 1) that send the supporter to an external page and back.

```js
export function checkReturn() {
  // Called on every page load
  // Returns: "success" | "failed" | null
  // "success" — show thank you message
  // "failed"  — show error message
  // null      — normal page load, do nothing
}
```

### Optional Export: `getUPIUrl` (UPI only)

```js
export function getUPIUrl(amount, config) {
  // Returns a UPI payment URL string
  // Used by the UI to generate QR code and deep link
}
```

---

## Part 6 — Built-In Gateway Reference

### Razorpay (Tier 2 — Dynamic SDK)

**Capabilities:**
```js
export const gatewayCapabilities = {
  supportsCustomAmount: true,
  requiresPresetLinks: false,
  verificationType: "client",
  tier: 2,
};
```

**What you need:** Razorpay account → Dashboard → API Keys → Key ID (starts with `rzp_live_` or `rzp_test_`). Never use the Key Secret.

**Known limitation:** Without a backend, we cannot create an `order_id` before opening checkout. Payments go through and land in your account, but server-side signature verification is not possible. For a voluntary tip tool, this is acceptable.

**Config:**
```js
gateway: "razorpay",
gatewayKey: "rzp_live_XXXXXXXXXXXX",
allowCustomAmount: true,
currency: "INR",
suggestedAmounts: [50, 100, 250, 500],
```

**Implementation:** See `src/gateways/razorpay.js` — fully commented.

---

### Dodo Payments (Tier 1 — Static Product)

**Capabilities:**
```js
export const gatewayCapabilities = {
  supportsCustomAmount: false,
  requiresPresetLinks: false, // Uses single gatewayKey (product ID)
  verificationType: "redirect",
  tier: 1,
};
```

**What you need:** Dodo account → Create a Product (one-time payment, set your price) → Product ID (starts with `prod_`). No API key needed for static links.

**Known limitation:** Amount is fixed at product creation time. Cannot accept custom amounts without creating a separate product per amount.

**Config:**
```js
gateway: "dodo",
gatewayKey: "prod_XXXXXXXXXXXX",
allowCustomAmount: false, // Must be false
currency: "USD",
suggestedAmounts: [2, 5, 10, 25], // Must match products you've created
```

**Implementation:** See `src/gateways/dodo.js` — fully commented.

---

### Manual Links (Tier 0 — Pure Links)

**Capabilities:**
```js
export const gatewayCapabilities = {
  supportsCustomAmount: false,
  requiresPresetLinks: true,
  verificationType: "none",
  tier: 0,
};
```

**What you need:** Pre-created payment links for each amount. Works with any gateway that lets you share a link (Razorpay payment buttons, Instamojo, PayU, etc.).

**Config:**
```js
gateway: "manual-links",
allowCustomAmount: false,
paymentLinks: {
  50:  "https://rzp.io/l/yourlink-50",
  100: "https://rzp.io/l/yourlink-100",
  250: "https://rzp.io/l/yourlink-250",
  500: "https://rzp.io/l/yourlink-500",
},
suggestedAmounts: [50, 100, 250, 500],
```

**Implementation:** See `src/gateways/manual-links.js`.

---

### UPI Direct (Tier 3 — Protocol)

**Capabilities:**
```js
export const gatewayCapabilities = {
  supportsCustomAmount: true,
  requiresPresetLinks: false,
  verificationType: "none",
  tier: 3,
};
```

**What you need:** A UPI ID. Nothing else.

**How QR works:** The UPI URL (`upi://pay?...`) is encoded into a QR code using a client-side library. No server needed. The QR changes dynamically when the supporter picks a different amount.

**Config:**
```js
// As primary payment (no gateway)
gateway: null,
upi: {
  enabled: true,
  id: "yourname@paytm",
  name: "Your Name",
},
allowCustomAmount: true,
currency: "INR",
```

**Implementation:** See `src/gateways/upi-direct.js`.

---

## Part 7 — Decision Tree for Adding a New Gateway

```
START: I want to add [Gateway Name]
│
▼
Does it require a backend/server API call?
│
├── YES → ❌ OUT OF SCOPE for Buy4Chai static tier
│         Document as "requires backend" in the table
│         Reserve the file name for future webhook support
│
└── NO
    │
    ▼
    What does it need to open checkout?
    │
    ├── Loads a JS SDK → TIER 2
    │   Template: src/gateways/razorpay.js
    │   supportsCustomAmount: true
    │
    ├── Redirect to a pre-created product/link → TIER 1
    │   Template: src/gateways/dodo.js
    │   supportsCustomAmount: false
    │   requiresPresetLinks: false (single product ID)
    │
    ├── Redirect to pre-created per-amount links → TIER 0
    │   Template: src/gateways/manual-links.js
    │   supportsCustomAmount: false
    │   requiresPresetLinks: true
    │
    └── UPI ID or direct protocol → TIER 3
        Template: src/gateways/upi-direct.js
        supportsCustomAmount: true
        verificationType: "none"
```

---

## Part 8 — Gateway Comparison Table

| Gateway | Tier | Custom Amt | Verification | India | Global | Status |
|---------|------|-----------|--------------|-------|--------|--------|
| Razorpay SDK | 2 | ✅ | Client | ✅ | ✅* | Shipped |
| Dodo Static | 1 | ❌ | Redirect | ❌ | ✅ | Shipped |
| UPI Direct | 3 | ✅ | ❌ None | ✅ | ❌ | Shipped |
| Manual Links | 0 | ❌ | ❌ None | ✅ | ✅ | Shipped |
| PayPal JS SDK | 2 | ✅ | Client | ❌** | ✅ | Planned |
| Cashfree | 2 | ✅ | Client | ✅ | ✅ | Planned |
| Stripe Checkout | 2 | ✅ | Redirect | Limited | ✅ | Planned |
| PayU | 2 | ✅ | Client | ✅ | ✅ | Planned |

*Razorpay international requires enabling in dashboard — no code change.
**PayPal requires Indian PayPal business account; limited for INR payouts.

---

## Part 9 — Future Architecture (Planned, Not Built)

Buy4Chai is currently 100% static. This section documents the planned path for developers who eventually need more.

### Phase 2: Optional Webhook Support (Planned)

Gateways like Razorpay fire `payment.captured` webhooks after successful payment. A developer who wants email confirmations or supporter analytics can add a Vercel serverless function to handle these.

When implemented, the config will support:

```js
// Future only — not available yet
webhookUrl: "https://yoursite.vercel.app/api/webhook/razorpay",
features: {
  emailConfirmation: true,
  analytics: true,
},
```

**What changes when you add webhooks:**
- Gateway files: **No changes needed** — they already pass payment IDs back on success
- You add: `/api/webhook/[gateway].js` (serverless function)
- You add: `webhookUrl` to config
- The core static site stays exactly as-is

The gateway contract is designed to be forward-compatible with this. `initPayment` already returns the payment response object, which contains the payment ID needed for webhook verification.

### Phase 3: Verified Gateways (Future)

Some integrations require a server-side session before checkout (Stripe PaymentIntent, Razorpay order_id). These will be supported via optional serverless functions but will never be required for the base static deployment.

---

## Part 10 — AI Prompt for Adding a New Gateway

Paste this into Claude, Copilot, or any AI tool. Fill in the bracketed sections.

```
I am adding a new payment gateway to Buy4Chai.

WHAT BUY4CHAI IS:
A fully static React + Vite site. No backend, no server, no secret keys in code.
Developers fork it, edit chai.config.js, deploy to Vercel or GitHub Pages.
Supporters click a button and pay directly via the configured gateway.

THE HARD CONSTRAINTS:
- No server, no backend, no secret keys in code ever
- Must work as a static site
- Only use the gateway's public/client key
- Load any SDK via script tag injection, never in HTML
- Use the gateway's hosted checkout UI — never build a custom card form

GATEWAY TIERS (pick one):
Tier 0: Manual Links — pre-created links per amount, no API, requiresPresetLinks: true
Tier 1: Static Product — single product/session ID, redirect, no custom amounts
Tier 2: Dynamic SDK — JS SDK loads on click, dynamic amount, modal/overlay
Tier 3: UPI/Protocol — direct payment URL, no SDK, amount in URL

THE GATEWAY CONTRACT MY CODE MUST FOLLOW:
File: src/gateways/[name].js

Export 1 (required): gatewayCapabilities object
  supportsCustomAmount: boolean
  requiresPresetLinks: boolean
  verificationType: "client" | "redirect" | "none"
  tier: 0 | 1 | 2 | 3

Export 2 (required): async function initPayment(amount, config)
  amount = paise for INR (₹100 = 10000)
  config = full chai.config.js object
  Returns Promise: resolves on success, rejects on failure or cancel

Export 3 (optional, redirect gateways): function checkReturn()
  Returns "success" | "failed" | null

REFERENCE IMPLEMENTATIONS:
Tier 2 (Dynamic SDK): src/gateways/razorpay.js
Tier 1 (Static Product): src/gateways/dodo.js
Tier 0 (Manual Links): src/gateways/manual-links.js
Tier 3 (UPI): src/gateways/upi-direct.js

GATEWAY I WANT TO ADD:
Name: [GATEWAY NAME]
Tier: [0 | 1 | 2 | 3]
SDK script URL (if Tier 2): [URL or none]
Public key field name: [what do they call it in their docs?]
Currency unit expected: [paise / cents / whole units]
How success is signalled: [callback / event / URL param]
How failure is signalled: [same options]
Does it fire webhooks? [yes / no — for documentation only, not for implementation]

TASK:
1. Write src/gateways/[name].js following the contract exactly
2. Export gatewayCapabilities with correct values for this gateway's tier
3. Comment every non-obvious line with WHY, not just WHAT
4. Note any known limitations (amount limits, currency restrictions, etc.)
5. Write the chai.config.js snippet the developer needs to paste
6. Show example output of checkReturn() if this is a redirect gateway
```

---

## Part 11 — Steps to Add a New Gateway

1. Read Part 7 (Decision Tree) — figure out the tier
2. Copy the template file for that tier from `src/gateways/`
3. Find four things in the gateway's docs before writing any code:
   - The SDK script URL or checkout URL format
   - What the public key is called
   - What currency unit they expect (paise, cents, whole rupees)
   - How success/failure is communicated (callback, event, URL param)
4. Create `src/gateways/[yourgateway].js`
5. Export `gatewayCapabilities`, `initPayment`, and `checkReturn` if needed
6. Update `chai.config.js` with your new gateway name
7. Add your gateway to the table in Part 8
8. Add a full section in Part 6 with your gateway's details

---

*Part of the Buy4Chai project. See master.md for core philosophy.*
*Last updated: May 2026*
*If you're an AI reading this — the gateway contract in Part 5 is the thing that matters most. Read it before writing any code.*