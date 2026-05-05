# Adding a Payment Gateway to Buy Me a Chai

This document explains how payment gateways work in this project, documents the two built-in gateways (Razorpay and Dodo Payments), and tells you exactly how to add any new gateway yourself — with or without an AI tool.

Written so that even if you have never integrated a payment gateway before, you can follow this and get it working.

---

## Before You Read Further — Understand This Project's Constraint

Buy Me a Chai is a **fully static website**. There is no server. No backend. No database.

This means one important thing for payments: **we cannot make server-side API calls**. We cannot secretly use an API secret key. We can only use whatever the gateway exposes for frontend/client-side use.

Every gateway integration in this project must work within this constraint. This rules out some features (like server-side payment verification) and it rules in others (like static payment links and client-side SDKs).

This is a conscious decision. See master.md section 2 for the full reasoning.

---

## Part 1 — How Gateways Are Structured in This Project

Every gateway lives in one file:

```
src/gateways/[gatewayname].js
```

The filename must exactly match what you put in chai.config.js:

```javascript
gateway: "razorpay"   →   src/gateways/razorpay.js
gateway: "dodo"       →   src/gateways/dodo.js
gateway: "cashfree"   →   src/gateways/cashfree.js
```

Every gateway file must export one function with this exact shape:

```javascript
export async function initPayment(amount, config) {
  // opens payment UI
  // returns a Promise
  // Promise resolves if payment succeeds
  // Promise rejects if payment fails or user cancels
}
```

That is the entire contract. The page calls initPayment and does not care which gateway it is. When you swap gateways, only chai.config.js changes. No other file in the project needs to change.

---

## Part 2 — The Rules Every Gateway Must Follow

These are not suggestions. If your gateway breaks any of these rules, it will either not work or create a security problem.

Rule 1 — Public key only.
Never put a secret key in this project. Secret keys are for servers. You only ever use the public key (also called client key, key_id, publishable key depending on the gateway). This key is safe to expose in frontend code. The secret key is not.

Rule 2 — Load the SDK lazily.
If the gateway has a JavaScript SDK (a script tag you add to the page), do not add it to index.html. Load it programmatically inside initPayment() only when the supporter clicks the button. This keeps the page fast. See the loadScript utility in Part 3 for how to do this.

Rule 3 — Use the gateway's own checkout UI.
Do not build a card input form yourself. Open the gateway's hosted modal or redirect to their hosted page. This keeps PCI compliance the gateway's problem, not yours.

Rule 4 — Return a proper Promise.
The page uses await initPayment(...) and expects a Promise. Resolve it when payment succeeds. Reject it when payment fails or the user cancels. Handle all internal error states before rejecting — do not let raw gateway errors bubble up to the page.

Rule 5 — Amount in smallest currency unit.
Always pass amount in the smallest currency unit (paise for INR, cents for USD). The `initPayment` function receives this calculated amount from the UI, so you pass it directly to the gateway's API.

Rule 6 — No side effects.
Do not write to localStorage, cookies, or any external analytics service. Do not log payment details to the console in production.

---

## Part 3 — Razorpay Integration

### What Razorpay Does

Razorpay opens a payment modal (popup) directly on your page. The supporter picks their payment method (UPI, card, netbanking, wallet), pays, and the modal closes. The page is told whether it succeeded or failed.

Razorpay supports UPI (all Indian UPI apps), Indian debit and credit cards, netbanking, wallets, and international cards (you must enable this in your Razorpay dashboard — no code change needed here).

### The Known Limitation — Read This

Razorpay's recommended integration creates a server-side "order" before opening checkout. This order ID is passed to the modal and enables server-side payment verification.

We do not do this because we have no server.

We open Razorpay checkout without an order ID. Payments still go through. Money still lands in your account. What you lose is the ability to cryptographically verify the payment server-side.

For a voluntary tip tool where someone is choosing to support you, this tradeoff is acceptable. If you need verified payments (for selling products or access), you need a backend and should follow Razorpay's full Node.js integration docs instead.

### What You Need

A Razorpay account at razorpay.com. Your Key ID from Dashboard → Settings → API Keys. It looks like rzp_test_XXXXXXXXXXXX for test mode or rzp_live_XXXXXXXXXXXX for live. Never use the Key Secret in this project. Only the Key ID.

### Your chai.config.js for Razorpay

```javascript
gateway: "razorpay",
gatewayKey: "rzp_live_XXXXXXXXXXXX",   // Key ID only, never the secret
currency: "INR",
displayCurrency: "USD",
exchangeRate: 83.5,
suggestedAmounts: [2, 5, 10, 25],      // Amounts in displayCurrency (USD)
defaultAmount: 5,                      // Default in USD
```

### How It Works in Plain English

When the supporter clicks the button: Razorpay's script loads from their CDN. A modal opens on your page. The supporter picks UPI or card or netbanking and pays. If payment succeeds, the handler function fires and the Promise resolves. If the supporter closes the modal without paying, ondismiss fires and the Promise rejects. If the payment fails (card declined etc.), payment.failed fires and the Promise rejects.

### The Code

```javascript
// src/gateways/razorpay.js

export async function initPayment(amount, config) {

  // Load Razorpay's SDK. Injects a script tag and waits for it to load.
  // If already loaded (supporter clicked twice), returns immediately.
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  // Razorpay uses callbacks, not Promises.
  // We wrap it so the page can use clean async/await.
  return new Promise((resolve, reject) => {

    const options = {
      key: config.gatewayKey,        // Public Key ID only. Never the secret.
      amount: amount,                 // In paise. 5000 = ₹50.
      currency: config.currency || "INR",
      name: config.name,             // Appears in the modal header
      description: "Buy me a chai ☕",
      image: config.avatar,          // Your photo in the modal

      // No order_id — see Known Limitation above.
      // Payments work without it. Server-side verification is not possible.

      handler: function(response) {
        // Payment succeeded. Resolve the Promise.
        resolve(response);
      },

      theme: {
        color: config.accentColor || "#1D9E75",
      },

      modal: {
        ondismiss: function() {
          // Supporter closed the modal without paying.
          // Reject so the page can reset the button.
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function(response) {
      // Card declined, bank error, timeout, etc.
      reject(new Error(response.error.description || "Payment failed"));
    });

    rzp.open();
  });
}

// Injects a script tag and waits for it to load.
// Returns immediately if already present on the page.
// Copy this into any new gateway that needs to load an SDK.
function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.body.appendChild(script);
  });
}
```

### How the Page Uses This

```javascript
import { initPayment } from "./src/gateways/razorpay.js";
import config from "./chai.config.js";

async function handleButtonClick() {
  try {
    await initPayment(config.amount, config);
    showThankYou();
  } catch (err) {
    if (err.message === "Payment cancelled by user") {
      resetButton(); // just reset, no error message needed
    } else {
      showError("Something went wrong. Please try again.");
    }
  }
}
```

---

## Part 4 — Dodo Payments Integration

### What Dodo Payments Does

Dodo Payments redirects the supporter to a hosted checkout page on Dodo's domain. After payment, Dodo redirects them back to your page. No modal, no SDK, no script tag needed.

Dodo Payments supports international cards (Visa, Mastercard, Amex) and multiple currencies. It is a good choice if your audience is primarily international.

### Why Dodo Is the Simplest Possible Integration

Dodo has a feature called Static Payment Links. You create a product once in the Dodo dashboard and get a product ID. Your entire payment integration becomes a URL redirect:

```
https://checkout.dodopayments.com/buy/{product_id}?redirect_url={your_page}
```

No API call. No SDK. No backend. This is the cleanest zero-backend integration possible.

### The Known Limitation

Because Dodo redirects away from your page, the supporter briefly leaves your site. You must create your product in the Dodo dashboard manually before using this integration. The price is set in the Dodo dashboard, not in chai.config.js.

### What You Need

A Dodo Payments account at dodopayments.com. Create a product in the dashboard (set it as a one-time payment and set your amount there). Your Product ID — looks like prod_XXXXXXXXXXXX. No API key is needed for static payment links.

### Your chai.config.js for Dodo

```javascript
gateway: "dodo",
gatewayKey: "prod_XXXXXXXXXXXX",   // your Dodo Product ID
currency: "USD",
displayCurrency: "INR",
exchangeRate: 83.5,
```

### How It Works in Plain English

When the supporter clicks the button: we build a Dodo checkout URL using your product ID and redirect the supporter to it. They pay on Dodo's hosted page. Dodo sends them back to your page with ?payment_id=...&status=succeeded in the URL. On page load, we check for those URL params and show success or failure accordingly.

### The Code

```javascript
// src/gateways/dodo.js

export async function initPayment(amount, config) {

  // Build the Dodo Static Payment Link.
  // product ID comes from config.gatewayKey.
  // redirect_url is where Dodo sends the supporter after payment.
  // We strip any existing query params from the current URL to keep it clean.
  const params = new URLSearchParams({
    redirect_url: window.location.href.split("?")[0],
    quantity: "1",
  });

  const checkoutUrl =
    `https://checkout.dodopayments.com/buy/${config.gatewayKey}?${params.toString()}`;

  // Redirect to Dodo. Page navigation happens here.
  // Code after this line does not run.
  window.location.href = checkoutUrl;

  // Return a Promise that never resolves.
  // The page reloads when Dodo redirects back, so this is fine.
  return new Promise(() => {});
}


// Call this when your page loads.
// Detects if the supporter just returned from Dodo after paying.
//
// Returns:
//   "success" — payment succeeded, show thank you
//   "failed"  — payment failed, show error
//   null      — normal page load, not a Dodo return, do nothing

export function checkDodoReturn() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const paymentId = params.get("payment_id");

  if (!status && !paymentId) {
    return null; // Normal page load
  }

  // Clean the URL — removes ?payment_id=...&status=... so it looks normal
  window.history.replaceState({}, "", window.location.pathname);

  if (status === "succeeded") {
    return "success";
  }

  return "failed";
}
```

### How the Page Uses This

```javascript
import { initPayment, checkDodoReturn } from "./src/gateways/dodo.js";
import config from "./chai.config.js";

// Run on every page load
function onPageLoad() {
  const returnStatus = checkDodoReturn();
  if (returnStatus === "success") { showThankYou(); return; }
  if (returnStatus === "failed") { showError("Payment did not go through. Please try again."); return; }
  // null — normal load, show the page as usual
}

// Run when supporter clicks the button
async function handleButtonClick() {
  await initPayment(config.amount, config); // redirects — nothing after this runs
}
```

---

## Part 5 — Adding a New Gateway

### Step 1 — Figure out the flow type

Read the gateway's docs. Does it open a popup on your page? That is a modal flow — use razorpay.js as your template. Does it redirect to another page? That is a redirect flow — use dodo.js as your template.

### Step 2 — Find these four things in their docs before writing any code

The SDK script URL if modal-based. What the public key is called (key, apiKey, publicKey, key_id). What currency unit it expects (paise, cents, whole rupees). How it signals success and failure (callback, event, URL parameter).

### Step 3 — Create your file

```
src/gateways/[yourgateway].js
```

For modal gateways: copy razorpay.js, swap the SDK URL, swap the options object, swap the callback names. For redirect gateways: copy dodo.js, swap the checkout URL format, swap the return URL parameter names.

### Step 4 — Update chai.config.js

```javascript
gateway: "yourgateway",
gatewayKey: "your_public_key",
```

### Step 5 — Document it in this file

Add a section following the same format as Part 3 and Part 4. Add your gateway to the table in Part 7.

---

## Part 6 — AI Prompt for Adding a Gateway

Paste this into Claude, GitHub Copilot, or any AI tool. Fill in the bracketed sections.

```
I am adding a new payment gateway to a project called Buy Me a Chai.

WHAT THIS PROJECT IS:
A fully static website. No backend, no server, no secret keys in code.
Developers fork it, edit one config file, deploy to Vercel or GitHub Pages.
Supporters click a button and pay the developer directly via their configured gateway.

THE HARD CONSTRAINTS:
- No server, no backend, no secret keys in code
- Must work as a static site on Vercel or GitHub Pages
- Only use the gateway's public/client key
- Load any SDK via script tag injection inside the function, not in HTML
- Use the gateway's own hosted checkout UI, never build a card form

THE CONTRACT MY CODE MUST FOLLOW:
File: src/gateways/[GATEWAY_NAME].js
Export: async function initPayment(amount, config)
- amount = smallest currency unit (paise for INR, so ₹50 = 5000)
- config = full chai.config.js object. Gateway key is at config.gatewayKey
- Returns Promise — resolves on success, rejects on failure or cancel

For redirect-based gateways also export: function checkReturn()
- Called on page load to detect if user just returned from the gateway
- Returns "success", "failed", or null

REFERENCE — RAZORPAY (modal flow, use as template):
[paste full contents of src/gateways/razorpay.js here]

REFERENCE — DODO (redirect flow, use as template):
[paste full contents of src/gateways/dodo.js here]

GATEWAY I WANT TO ADD:
Name: [GATEWAY NAME]
Type: [modal / redirect]
Docs URL: [URL]
SDK script URL if modal: [URL or none]
Public key field name: [what do they call it?]
Currency unit: [paise / cents / whole units]
How success is signalled: [callback / event / URL param]
How failure is signalled: [same options]

TASK:
1. Write src/gateways/[name].js following the contract exactly
2. Comment every non-obvious line with WHY, not just what
3. Note any known limitations
4. List what fields the developer needs to add to chai.config.js
5. Show how the page calls initPayment and handles the result
```

---

## Part 7 — Supported Gateways

| Gateway | File | Flow | UPI | International | Status |
|---|---|---|---|---|---|
| Razorpay | src/gateways/razorpay.js | Modal | Yes | Yes (enable in dashboard) | Shipped |
| Dodo Payments | src/gateways/dodo.js | Redirect | No | Yes | Shipped |
| PayPal | src/gateways/paypal.js | Modal | No | Yes | Planned |
| Cashfree | src/gateways/cashfree.js | Modal | Yes | Yes | Planned |
| PayU | src/gateways/payu.js | Modal | Yes | Yes | Planned |

Want to add a gateway? Follow Part 5. Use the AI prompt in Part 6. Submit a PR.

---

Part of the Buy Me a Chai project. See master.md for full context and architectural decisions.