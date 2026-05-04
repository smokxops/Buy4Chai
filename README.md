<div align="center">
  <img src="public/logo.svg" width="120" alt="Buy Me a Chai Logo" />
  <h1>Buy Me a Chai ☕</h1>
  <p><strong>The narrative-driven, self-hosted supporter page for the modern Indian developer.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Stack-React_|_Vite_|_Tailwind-blue?style=flat-square" alt="Stack" />
    <img src="https://img.shields.io/badge/Fees-0%25-green?style=flat-square" alt="Fees" />
    <img src="https://img.shields.io/badge/License-MIT-orange?style=flat-square" alt="License" />
  </p>

  <p>
    <a href="https://your-deployment-url.vercel.app"><strong>View Demo</strong></a> •
    <a href="#-deployment-in-10-minutes"><strong>Deploy Yours</strong></a> •
    <a href="master.md"><strong>The Manifesto</strong></a>
  </p>
</div>

---

## 🛑 The Infrastructure Gap

Platforms like **Buy Me a Coffee** and **GitHub Sponsors** rely on Stripe. In India, Stripe is invite-only, leaving thousands of developers stranded.

Sharing a UPI ID in a README feels "janky." Using PayPal involves massive fees. **Buy Me a Chai** fixes this by building a world-class **UX Layer** on top of the gateways that actually work in India (Razorpay & Dodo Payments).

## ✨ Why this is better

- **📖 Narrative-First Design:** Move beyond transactional forms. Build a connection with your supporters through an editorial-style layout that showcases your mission, your story, and your gallery.
- **💱 Dual-Currency Engine:** A first-of-its-kind system for Indian developers. Set prices in USD, receive in INR. Supporters can toggle currencies in real-time with automatic conversion.
- **💸 0% Platform Fees:** We aren't a middleman. Money moves directly from your supporters to your Razorpay or Dodo account. You keep every rupee.
- **🛡️ Self-Hosted Sovereignty:** You own the deployment. No platform accounts, no vendor lock-in. Host it on your own domain using Vercel, GitHub Pages, or Netlify for free.
- **🔐 Protected Onboarding:** A professional 6-step setup wizard (`/#setup`) that handles everything from identity to gateway keys, gated by a security key for production safety.

---

## 🎨 The Experience

| **Storytelling** | **Project Showcase** | **Dual Currency** |
| :--- | :--- | :--- |
| Build a narrative around your work. Let people know *why* they should support you. | Pin your best open-source projects with high-quality preview cards. | Automatic USD/INR conversion with a simple supporter-facing toggle. |

---

## 🚀 Deployment in 10 Minutes

### 1. Fork & Clone
Fork this repository to your own GitHub account and clone it locally.

### 2. Run the Secure Wizard
We built a professional setup wizard right into the app.
1. Run `npm install && npm run dev`
2. Open `http://localhost:3000/#setup?key=chai123` (or the key defined in your `chai.config.js`)
3. Follow the 6-step flow to set your identity, story, projects, and gateway.
4. Copy the generated code into `chai.config.js`.

### 3. One-Click Deploy
Push your changes and connect your repo to **Vercel** or **Netlify**. It will auto-detect Vite and deploy your static site for free.

---

## 🛡️ Secure by Design

- **Public Keys Only:** Buy4Chai never asks for Secret Keys. Your config is safe to be public.
- **Setup Lockdown:** Disable the configuration wizard in production with a single toggle.
- **Password Protection:** Your setup route is gated by a unique key known only to you.

---

## 🔌 Add to your README

Start receiving support by adding this high-fidelity badge to your projects:

```markdown
[![Support me on Buy Me a Chai](https://your-deployment-url.vercel.app/badge.svg)](https://your-deployment-url.vercel.app)
```

*(Replace `your-deployment-url.vercel.app` with your actual live URL).*

---

## 🏗️ Architecture

Built with **React 18, Vite, Tailwind CSS, and Framer Motion**.

- **[Master Manifesto](master.md)** — The "Why" and the roadmap.
- **[Design System](design.md)** — The tokens and component architecture.
- **[Gateway Contract](gateway.md)** — How to add a new payment gateway in 10 minutes.

---

<div align="center">
  <p>Built for the Indian Open Source Community 🇮🇳</p>
  <p><i>If this helps you, consider giving it a ⭐</i></p>
</div>
