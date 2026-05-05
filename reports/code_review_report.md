# Codebase Review & Quality Report

## 1. UI/UX Issues

### Hardcoded Gateway Names
- **Location:** `src/SupporterPage.jsx:471`
- **Issue:** The primary CTA button text is hardcoded to choose between 'Razorpay' and 'Dodo'.
- **Impact:** If the user selects `manual-links`, it likely shows 'Dodo' or looks broken.
- **Fix:** Use a mapping or the gateway capabilities to show a friendly name.

### UPI Redundancy
- **Location:** `src/gateways/upi-direct.js`, `upi_api.html`, `qr_generator.html`
- **Issue:** There are multiple ways UPI is handled. The SPA uses a modal with a QR API, but `upi-direct.js` points to `upi_api.html`.
- **Recommendation:** Consolidate UPI handling or ensure `upi-direct.js` is consistent with the UI.

## 2. Setup Wizard Gaps

### Insufficient Validation
- **Narrative Step:** Users can "Continue" with empty project names or invalid URLs.
- **Customize Step:** No validation for exchange rate (could be 0 or negative) or suggested amounts (could be empty).
- **Socials Step:** No basic URL/handle format validation.

### UI Glitches
- In Step 2 (Narrative), adding a project and then moving it doesn't have immediate visual feedback other than order change.

## 3. Technical Debt / Risks

### Static Config Exposure
- **Issue:** While warned, users might still accidentally paste secret keys.
- **Mitigation:** The setup wizard already has a bold warning. Maybe add a "key format" regex check for Razorpay (should not start with `rzp_secret`).

### Duplicate Logic
- `loadScript` is defined in `razorpay.js`. If more SDKs are added, this should be in a utility file.

## 4. Suggested Improvements
- Add a "Test Mode" toggle for Razorpay in the setup wizard to easily use `rzp_test` keys.
- Improve the "Manual Links" setup experience by showing which amounts need links more clearly.
