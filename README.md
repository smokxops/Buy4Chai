<div align="center">
  <img src="public/logo.svg" width="120" alt="Buy Me a Chai Logo" />
  <h1>Buy Me a Chai ☕</h1>
  <p>A self-hosted, gateway-agnostic supporter page for Indian developers and creators.</p>
  <a href="#demo">View Demo</a> • <a href="#getting-started">Deploy Yours</a> • <a href="master.md">Read the Manifesto</a>
</div>

---

## 🛑 The Problem

Platforms like Buy Me a Coffee, Ko-fi, and GitHub Sponsors rely on Stripe for payouts. Stripe is invite-only in India with no clear criteria. 

Indian developers are forced to share UPI IDs in DMs or use PayPal (high fees + friction). There are infrastructure solutions (Razorpay, Dodo), but nobody has built the **UX layer**—the clean badge and beautiful supporter page—on top of them.

## ✨ The Solution

**Buy Me a Chai** is a completely static, self-hostable React application. 
- **Zero Fees:** We are the door, not the bank. Money goes directly to your gateway.
- **Gateway Agnostic:** Built-in support for Razorpay (India) and Dodo Payments (International).
- **10-Minute Setup:** Fork the repo, run the built-in Setup Wizard, copy the config, and deploy to Vercel or GitHub Pages for free.
- **Beautiful UX:** Smooth animations, premium glassmorphism design, and bulletproof dark mode.

---

## 🚀 Getting Started

Deploying your own "Buy Me a Chai" page takes less than 10 minutes.

### 1. Fork this Repository
Click the **Fork** button at the top right of this repository to create a copy in your own GitHub account.

### 2. Generate Your Config
We built a setup wizard right into the app so you don't have to write code.
1. Clone your fork locally: `git clone https://github.com/YOUR-USERNAME/BuyAchai.git`
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:3000/#setup` in your browser.
5. Follow the steps to set up your identity, select your payment gateway, and customize the page.
6. At the final step, **copy the generated config** and paste it into `chai.config.js` in your project root.

> **Using a custom avatar?** Drop your image into the `public/` folder as `avatar.png`.

### 3. Deploy
Commit your `chai.config.js` (and `public/avatar.png` if using one) and push to GitHub.

Deploy to **Vercel**:
1. Go to [Vercel](https://vercel.com/) and click "Add New Project".
2. Import your forked repository.
3. Vercel will automatically detect it as a Vite project. Click Deploy.
4. Your page is now live!

---

## 🛡️ Security Note

**Never put your Payment Gateway Secret Key in `chai.config.js`.** 
Because this is a static frontend application, anyone can view your source code. You only need the **Key ID** (Razorpay) or **Product ID** (Dodo) to initialize payments. The Setup Wizard explicitly tells you which keys are safe to use.

---

## 🔌 Adding to your README

Once deployed, add this badge to your open-source projects to start receiving support:

```markdown
[![Buy Me a Chai](https://your-deployment-url.vercel.app/badge.svg)](https://your-deployment-url.vercel.app)
```

*(Note: Replace `your-deployment-url.vercel.app` with your actual Vercel/Netlify URL).*

---

## 🏗️ Architecture & Contributing

This project is built with **Vite, React, Tailwind CSS, and Framer Motion**.

- Want to understand the core philosophy? Read [`master.md`](master.md).
- Want to understand the design system and architecture? Read [`design.md`](design.md).
- Want to add a new payment gateway? Read the integration contract in [`gateway.md`](gateway.md).

Contributions are welcome! If you're adding a new gateway, please ensure it strictly follows the `initPayment` contract so the core UI remains untouched.
