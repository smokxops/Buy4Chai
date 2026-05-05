# Buy Me a Chai — Master Document
> The single source of truth for every decision, nuance, scope, and direction of this project.
> If you're a contributor, an AI, or a future version of the founder reading this — start here.

---

## 1. Why This Exists

Indian developers doing open source, bounty hunting, or content creation cannot receive supporter payments through the tools Western developers take for granted.

- **Buy Me a Coffee** — uses Stripe for payouts. Stripe is invite-only in India with no clear criteria.
- **Ko-fi** — same problem.
- **GitHub Sponsors** — waitlisted, also Stripe-backed.
- **Workarounds** — sharing UPI in DMs (janky), PayPal (fees + friction), registering a US LLC (expensive, inaccessible).

The pain is real. The workarounds are all either infrastructure-only (Razorpay, Dodo) or geographically broken (Stripe). Nobody has built the **UX layer** — the clean badge + supporter page experience — on top of the gateways that actually work in India.

**chai4.me** exists but is UPI-only and platform-owned. It doesn't support international payments and doesn't let developers own their own deployment.

**Buy Me a Chai** fills the gap: a self-hostable, gateway-agnostic supporter page that any developer can fork, configure in one file, and deploy in under 10 minutes.

---

## 2. Core Philosophy

### We are the door, not the bank
We own zero of the payment layer. Every rupee goes directly from supporter to developer via whatever gateway the developer has configured. We have no platform account, no fees, no cut. Legal compliance (RBI, KYC, international transfers) belongs to the gateway — Razorpay, Dodo, or whoever the developer plugs in.

This is a feature, not a limitation. It means:
- No regulatory risk for the project
- No platform fees ever
- Developers own their money and their relationship with their gateway

### Docs are the product
The code will be rewritten. The UI will evolve. But the gateway integration contract and the documentation must be so clean and so complete that any developer — or any AI handed the codebase — can add a new payment gateway without asking anyone for help. The docs are not optional in any version, including MVP.

### Friction is the enemy
If setting this up takes more than 10 minutes, most developers won't do it. Every decision — stack choice, config design, deployment story — is evaluated against this constraint. Simplicity beats features every time.

### Fork-and-deploy, not platform
Developers fork the repo, edit one config file, and deploy to Vercel/GitHub Pages/Netlify. There is no central platform, no accounts, no logins. Each developer's page lives at their own URL. This keeps the project open source, zero-cost, and infinitely scalable without any infrastructure on our part.

---

## 3. Validation Summary

Before any code was written, the idea was tested in the field.

**Reddit (r/indiandevs, r/developersIndia):**
- Post: "Stripe is invite-only in India and it's genuinely killing the open source support culture here"
- 7.6K views, 28 upvotes, 24 comments
- Key finding: people know Razorpay and Dodo exist as infrastructure, but nobody has a clean UX layer on top. The UX gap comment (283 views, 4 upvotes) was the most engaged item in the thread.
- Workarounds cited: Razorpay (no badge UX), PayPal (high fees), Dodo (buggy UI), US LLC (inaccessible).

**LinkedIn DM (Parth Bhovad, indie developer):**
- Independently resonated with the idea
- Said "there is a high chance devs and others will use it"
- Expressed interest in using it for his own personal brand page
- Confirmed Dodo Payments works for his use case but acknowledged the UX gap

**Competitor discovered (chai4.me):**
- Already exists, built in India
- UPI-only, no international payments
- Platform-owned (not self-hostable)
- Validates the demand; does not close the gap we're solving

**Horror_Implement_411 (Reddit commenter):**
- Independently thinking about building on top of UPI internationally
- Raised the RBI B2C donation restriction issue (important context, not our problem to solve)
- Confirmed the gap exists from a builder's perspective

**Conclusion:** The pain is real, the gap is unoccupied, one competitor exists but has a clear ceiling. Validated enough to build.

---

## 4. What We Are Building

### The Core Flow
```
Badge on GitHub/LinkedIn README
        ↓
Supporter clicks badge
        ↓
Developer's self-hosted page (their Vercel URL)
        ↓
Supporter picks amount → Gateway checkout opens
        ↓
Money goes directly to developer's gateway account
```

### The Three Components

**1. The Page**
A self-hostable React/Vite application that developers deploy as their narrative supporter page. It uses a storytelling layout to sell a mission, not just a transaction. Includes a protected Setup Wizard for 0-code configuration.

**2. The Badge**
A single SVG file and a markdown/HTML snippet. Developers paste one line into their README or LinkedIn. Points to their deployed page URL.

**3. The Gateway Docs**
A clean integration contract (`gateway.md`) that defines exactly how any payment gateway must be wired in. Includes the reference implementation (Razorpay), a second example (Dodo Payments), and a copyable AI prompt for adding any new gateway.

---

## 5. MVP Scope

MVP is the smallest thing that proves the end-to-end flow works and can be put in front of a real developer.

### What V1 (Current) includes

| Component | Detail |
|---|---|
| Narrative UI | 2-column editorial layout with Story, Gallery, and Pinned Projects. |
| Dual Currency | Real-time USD/INR toggle with exchange rate handling and local formatting. |
| Protected Setup | Password-gated wizard (`/#setup?key=...`) with "Setup Lockdown" feature. |
| Profile block | High-res avatar, Name, bold Bio, and Social links. |
| Support Menu | Refined overlay with presets, custom amounts, and currency swapping. |
| Payment gateway | Razorpay AND Dodo Payments fully integrated. Client-side checkout. |
| Thank-you | Custom animated thank-you section post-payment. |
| Badge | High fidelity, realistic Chai glass SVG + markdown snippet |
| Config | `chai.config.js` — single file controlling everything. |
| Deployment | Fully static. Works on Vercel, GitHub Pages, Netlify. |

### What is explicitly excluded

- Any backend / serverless function (maintaining zero-infra cost)
- Analytics / Payment history (respecting privacy & static nature)
- Multi-language support (English only for now)

### MVP success criteria
A developer who has never seen this project before can:
1. Fork the repo
2. Run locally and use the Setup Wizard (`/#setup`) to generate their config
3. Deploy to Vercel
4. Paste the badge into their README
5. Have a working supporter page — in under 10 minutes

---

## 6. V1 Scope (Post-MVP)

With MVP complete and utilizing React + Vite, the focus shifts to feature additions:

| Feature | Rationale |
|---|---|
| Project showcase | 2-3 project cards so supporters understand what they're funding |
| Accent color picker | Single hex in config, entire page recolors |
| More Gateways | PayPal, Cashfree, Stripe |
| Better badge variants | Dark/light variants, different sizes |

---

## 7. Gateway Integration Architecture

This is the most important technical decision in the project. Get this right and the project scales forever. Get it wrong and every new gateway requires someone to understand the whole codebase.

### The Contract

Every payment gateway integration must live in `src/gateways/[name].js` and export exactly one function:

```javascript
/**
 * Initiate a payment through this gateway.
 *
 * @param {number} amount - Amount in smallest currency unit (paise for INR, cents for USD)
 * @param {object} config - The full chai.config.js object
 * @returns {Promise<void>} - Resolves on successful payment, rejects on failure or cancel
 */
export async function initPayment(amount, config) {
  // Implementation here
}
```

### Rules every gateway must follow
1. Load its SDK lazily (script tag injection or dynamic import) — don't bundle it
2. Use only `config.gatewayKey` (the public/client key). Never a secret key.
3. Open the gateway's checkout UI — do not build a custom payment form
4. Return a Promise that resolves on success and rejects on failure or user cancel
5. Handle its own error states internally before rejecting

### Why this contract exists
- The page calls `initPayment(amount, config)` and doesn't care which gateway it is
- Swapping gateways = changing one field in `chai.config.js`
- Adding a new gateway = one new file, no changes anywhere else
- AI tools can generate a new gateway file given just this contract as context

### Reference implementations: Razorpay & Dodo
Razorpay is the default gateway and the canonical example for popup/modal flows. Dodo Payments is the example for redirect flows. When reading `src/gateways/razorpay.js` or `src/gateways/dodo.js`, every line is commented to explain not just what it does but why — so it doubles as documentation for anyone writing a new gateway.

---

## 8. Configuration Design

```javascript
// chai.config.js — the only file a developer needs to touch
export default {
  // Identity
  name: "Your Name",
  avatar: "https://github.com/yourusername.png",  // or relative path to local image
  bio: "One line about what you build",

  // Social links — all optional, only renders what's provided
  socials: {
    github: "yourusername",
    twitter: "yourhandle",
    linkedin: "yourprofile",
    website: "https://yoursite.com",
  },

  // Payment configuration
  gateway: "razorpay",           // matches filename in src/gateways/
  gatewayKey: "rzp_live_...",    // public key only, never secret
  defaultAmount: 100,            // default selected amount
  currency: "INR",
  thankYouMessage: "You made my day!",
}
```

### Key decisions in this design
- **One file, flat structure** — no nested config objects to confuse new users
- **Gateway as string** — maps directly to `src/gateways/[gateway].js`, no registry needed
- **Socials as object with optional keys** — the page renders only what's provided

---

## 9. Deployment Story

### Target: 10-minute onboarding

```
1. Fork repo on GitHub                          (~1 min)
2. Run locally & generate config in Wizard      (~3 min)
3. Commit config & push to GitHub               (~1 min)
4. Import on Vercel → deploy                    (~3 min)
5. Paste badge into GitHub README               (~1 min)
```

### Static build requirement
The page must build as a fully static site (via Vite). No Node.js server, no backend, no database. This enables:
- GitHub Pages (free, zero config)
- Vercel (auto-detects, free tier)
- Netlify (auto-detects, free tier)
- Any static host

### No backend, ever (MVP and v1)
Razorpay's client-side checkout works with a public key only. No order creation API call is needed for the basic flow. This keeps deployment dead simple.

The tradeoff: we cannot verify payments server-side. This is acceptable for a voluntary support tool — it's not an e-commerce checkout. Document this limitation clearly.

---

## 10. The Badge

### Requirements
- Must be an SVG that renders correctly on GitHub README, LinkedIn, and any markdown renderer
- Must be a single file — no external dependencies
- Must be clearly recognizable as a "support me" badge
- Must be easy to customize (link URL is the only thing that changes)

### Snippet format
```markdown
[![Buy me a chai](https://raw.githubusercontent.com/yourusername/buymeachai/main/public/badge.svg)](https://your-vercel-url.vercel.app)
```

### Design direction
Warm brown/amber tones. High fidelity Chai glass. Clean, minimal. Inspired by shields.io style but with personality. Culturally distinct from the generic "buy me a coffee" badge.

---

## 11. Documentation Structure

```
/
├── README.md                  — Quick start (fork → config → deploy → badge)
├── master.md                  — This file. Every decision and nuance.
├── design.md                  — Design system, tokens, and component architecture.
├── gateway.md                 — Integration contract + Razorpay reference + Dodo example + AI prompt
├── chai.config.js             — Config file (the thing developers edit)
├── public/                    — Static assets (logo, badge, avatar)
└── src/
    ├── SupporterPage.jsx      — Public facing UI
    ├── SetupPage.jsx          — Developer onboarding wizard
    └── gateways/
        ├── razorpay.js        — Reference implementation
        └── dodo.js            — Second example
```

### gateway.md must contain
1. The integration contract (exact function signature + rules)
2. Full Razorpay implementation with line-by-line comments
3. Full Dodo Payments implementation
4. Step-by-step guide: "Adding [Your Gateway] in 4 steps"
5. The AI prompt — a copyable block that works with Claude, Copilot, or any LLM.

---

## 12. Decisions Log

Every non-obvious decision made during design, and why.

| Decision | Alternatives considered | Why we chose this |
|---|---|---|
| React + Vite SPA | Single HTML file | Far superior UI/UX, easier to build the Setup Wizard, and easier for external devs to contribute to components. |
| In-app Setup Wizard | CLI Tool | CLI limits deployment options and forces local dev. Web UI is completely frictionless. |
| Fork-and-deploy | Hosted platform | No infra cost, no regulatory risk, stays fully open source. |
| Razorpay default | PayPal, Cashfree | Most widely adopted by Indian devs, handles international cards natively. |
| Public key only | Serverless function | Eliminates backend requirement entirely, stays static. |
| JS Config | JSON or .env | JS allows comments, which are documentation for non-technical users. |

---

## 13. What This Is Not

To keep the project focused, these are explicitly out of scope — not just for MVP, but as a philosophical decision.

- **Not a payment platform.** We do not hold, route, or touch money.
- **Not a SaaS.** There is no central server, no accounts, no subscriptions.
- **Not a creator monetization tool.** We're dev-focused. Project showcase, not YouTube-style tiers.
- **Not Stripe for India.** We're not solving the payment infrastructure problem. We're building UX on top of gateways that already solved it.
- **Not multi-currency by default.** INR first. The gateway handles currency conversion for international supporters.

---

## 14. How to Contribute

### Adding a new payment gateway
Read `gateway.md`. Implement the contract. Submit a PR with:
- `src/gateways/[name].js` — implementation
- An entry in `gateway.md` — documentation for your gateway
- A note in `README.md` under "Supported Gateways"

### Improving the page UI
The page is intentionally minimal. Improvements welcome if they don't increase configuration complexity or break the 10-minute onboarding target.

---

## 15. Version Roadmap

| Version | Focus | Status |
|---|---|---|
| MVP | React rewrite, Setup Wizard, Razorpay + Dodo | **Complete** |
| V1 | Narrative UI, Dual-Currency, Gallery, Project Pinning, Setup Security | **Complete** |
| V2 | Color theme picker, more gateways (PayPal, Cashfree) | Planned |
| V3 | Multi-language support, custom badge generator | Future |

---

*Last updated: May 2026*
*This document should be updated whenever a significant decision is made or the scope changes.*
*If you're an AI reading this to help with the codebase — this is the full context. Trust this over any assumptions.*