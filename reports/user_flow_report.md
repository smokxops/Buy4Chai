# User Flow & Testing Report

## 1. Manual & Custom Verification Flows

Note: While official repository Playwright tests were skipped due to environment browser limitations, custom verification scripts were used to validate the UI logic and take screenshots.

### Supporter Flow
- **Identity Verification:** Profile name and bio display correctly.
- **Theme Toggle:** Dark/Light mode transitions smoothly.
- **Payment Modal:**
    - Currency toggle (USD/INR) works with correct formatting.
    - Custom amount validation prevents sub-$0.50 payments.
    - Extreme values (e.g., $999,999) are formatted correctly in INR locale (e.g., ₹8,34,99,917).
- **UPI Option:** QR code generation and "Open UPI App" link are generated correctly based on selected amount.

### Setup Wizard Flow
- **Security:** Verified that the setup route is inaccessible without the correct `setupKey`.
- **Step 1 (Identity):** Bio and Name are required; Avatar URL validation is in place.
- **Step 2 (Narrative):**
    - Story text is optional.
    - Project validation ensures each pinned project has a name and a valid link.
    - Projects can be added, removed, and reordered.
- **Step 4 (Gateway):**
    - Secret key detection for Razorpay (prevents pasting `rzp_secret`).
    - Manual Link validation ensures at least one link is provided if chosen.
- **Step 5 (Customize):** Exchange rate must be a positive number.
- **Step 6 (Final):** Config is correctly serialized and ready for copy-pasting.

## 2. Stress Testing Results
- **Large Data Sets:** Adding 10+ projects does not break the layout of the wizard.
- **Long Strings:** 500+ character bios are handled gracefully without UI overflow.
- **Edge Case Rates:** Extremely low exchange rates (e.g., 0.0001) are handled without crashing.

## 3. Conclusion
The site is robust against common user errors and edge case data. The recent fixes have strengthened validation and improved the dynamic nature of the UI.
