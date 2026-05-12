# Contributing to Buy4Chai ☕

First off - genuinely, thank you. It means a lot that you're here.

Buy4Chai started as a frustration, Stripe invite-only, Buy Me a Coffee broken for Indian devs, UPI IDs shared in DMs like it's 2010. If you're contributing, you probably get it. You've likely felt it too.

Every line of code, every doc fix, every gateway added makes this better for every developer who finds it next. That's the whole point. So whatever you're here to build- welcome, and let's make it count.

This guide will get you from zero to your first PR in under 15 minutes.

---

## Table of Contents

- [The Philosophy](#the-philosophy)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Types of Contributions](#types-of-contributions)
- [Adding a Payment Gateway](#adding-a-payment-gateway)
- [Branch & Commit Convention](#branch--commit-convention)
- [PR Checklist](#pr-checklist)
- [Code Style Notes](#code-style-notes)
- [Getting Help](#getting-help)

---

## The Philosophy

Before writing a single line, read these two things:

- `master.md` — the why behind every decision
- `gateway.md` — the contract every gateway must follow

Buy4Chai is **fully static**. No backend, no server, no secret keys — ever. If your contribution requires any of those, it's out of scope for now. Keep friction low, keep it forkable, keep it yours.

---

## Getting Started

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Buy4Chai.git
cd Buy4Chai

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev

# 4. Open the app
# Supporter page:  http://localhost:3000
# Setup wizard:    http://localhost:3000/#setup?key=chai123
```

That's it. No environment variables needed to run locally. The test Razorpay key (`rzp_test_`) auto-simulates a successful payment so you can test the full flow without a real key.

---

## Project Structure

```
Buy4Chai/
├── src/
│   ├── gateways/          ← One file per payment gateway
│   │   ├── razorpay.js    ← Reference implementation (read this first)
│   │   ├── dodo.js        ← Redirect flow example
│   │   ├── manual-links.js
│   │   └── upi-direct.js
│   ├── App.jsx            ← Hash router + dark mode + theme injection
│   ├── SupporterPage.jsx  ← What supporters see
│   ├── SetupPage.jsx      ← 6-section setup wizard for developers
│   └── index.css          ← CSS variables + theme tokens
├── public/
│   ├── badges/            ← Badge SVG variants
│   ├── logo.svg
│   └── avatar.png
├── chai.config.js         ← The only file a developer needs to edit
├── master.md              ← Philosophy and decisions log
├── design.md              ← Design system and component architecture
└── gateway.md             ← Gateway integration contract
```

The most important file for contributors is whichever one your issue touches. Always read the relevant `.md` doc before touching code.

---

## Types of Contributions

### Good First Issues
Look for issues labeled `good first issue`. These are scoped, well-documented, and won't require you to understand the entire codebase. A good example is the color picker in `SetupPage.jsx` — it's self-contained and the acceptance criteria are clear.

### Gateway Integrations
Adding a new payment gateway is the highest-value contribution. Read `gateway.md` completely before starting. The AI prompt in Part 10 of that file will generate a solid starting point for you.

### UI Improvements
The supporter page and setup wizard are intentionally minimal. Improvements are welcome as long as they don't increase configuration complexity or break the 10-minute onboarding target. If in doubt, open a discussion issue first.

### Documentation
Docs are a first-class contribution here. If something confused you, it'll confuse the next person. Fix it.

---

## Adding a Payment Gateway

Read `gateway.md` completely before starting — it has the full contract, tier system, decision tree, and reference implementations.

The fastest way to add a new gateway is the AI prompt in `gateway.md` Part 10. Paste it into Claude or Copilot with your gateway's docs attached and it'll generate a compliant implementation for you.

Once done, add your gateway to the table in Part 8 and document it in Part 6. That's the only hard requirement for the PR to be merged.

---

## Branch & Commit Convention

NOTHING MUCH TO SAY JUST MAKE SURE THE NAME TELLS WHAT IT DOES

```bash
# Branch naming
feature/your-feature-name
fix/what-youre-fixing
docs/what-youre-documenting
gateway/gateway-name

# Examples
feature/accent-color-picker
fix/upi-qr-mobile-layout
docs/contributing-guide
gateway/cashfree
```

Commit messages should be clear and lowercase:

```bash
# Good
feat: add accent color picker to setup wizard
fix: upi qr not rendering on ios safari
docs: add cashfree gateway to gateway.md
gateway: add cashfree tier 2 integration

# Not great
Updated stuff
fix bug
WIP
```

---

## PR Checklist

Before opening a PR, please go through the full payment flow locally and make sure everything works end to end - pick an amount, go through checkout, see the thank you screen. If the payment system is broken in any way, the PR isn't ready yet.

Beyond that:

- [ ] `npm run build` completes without errors
- [ ] Supporter page renders correctly in both light and dark mode
- [ ] Setup wizard still generates valid `chai.config.js` output
- [ ] If you added a gateway — `gatewayCapabilities` is exported and documented in `gateway.md`
- [ ] No secret keys, no backend calls, no localStorage usage anywhere
- [ ] No unicode characters (curly quotes, arrows) inside JSX text nodes — use HTML entities or ASCII
- [ ] CSS theming uses CSS variables (`var(--text-primary)`) not hardcoded colors or Tailwind `dark:` classes

---

## Code Style Notes

**Theming** — always use CSS variables, never hardcode colors or use Tailwind `dark:` modifier classes. This is what makes the theme system bulletproof.

```jsx
// Good
<p style={{ color: 'var(--text-muted)' }}>...</p>
<div className="theme-text">...</div>

// Not good
<p className="text-gray-500 dark:text-gray-300">...</p>
```

**JSX text** — esbuild chokes on certain unicode characters. Keep JSX text nodes to plain ASCII. Use `&rarr;` instead of `→`, `&#x2019;` instead of `'`.

**No form tags** — use `onClick` and `onChange` handlers instead of HTML `<form>` elements.

**Gateway files** — comment every non-obvious line with WHY, not just WHAT. These files double as documentation for the next person adding a gateway.

---

## Getting Help

Stuck? Open an issue or comment on the one you're working on. Tag `@vassu-v` and you'll get a response fast.

If you're adding a gateway and need help understanding the contract, the AI prompt in `gateway.md` Part 10 is genuinely useful — paste it into Claude or Copilot with your gateway's docs attached.

---

Built with love for the open source community 🇮🇳

If this helped you, consider giving the repo a ⭐ - it helps more developers find it.
