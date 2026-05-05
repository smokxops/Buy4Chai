// src/gateways/dodo.js

/**
 * Initiates Dodo Payments via external redirect
 */
export async function initPayment(amount, config) {

  // Construct the Static Payment Link with return URL
  // Uses gatewayKey as Product ID
  // We strip any existing query params from the current URL to keep it clean.
  const params = new URLSearchParams({
    redirect_url: window.location.href.split("?")[0], // Strip existing query params
    quantity: "1",
  });

  const checkoutUrl =
    `https://checkout.dodopayments.com/buy/${config.gatewayKey}?${params.toString()}`;

  // External Navigation: The page reloads when the user returns.
  // Code after this line does not run.
  window.location.href = checkoutUrl;

  // Never resolves as the page will redirect.
  // The page reloads when Dodo redirects back, so this is fine.
  return new Promise(() => {});
}


/**
 * Hook to be called on page load to detect successful redirect back from Dodo.
 * Detects if the supporter just returned from Dodo after paying.
 * 
 * Returns:
 *   "success" — payment succeeded, show thank you
 *   "failed"  — payment failed, show error
 *   null      — normal page load, not a Dodo return, do nothing
 */
export function checkDodoReturn() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const paymentId = params.get("payment_id");

  if (!status && !paymentId) {
    return null; // Regular visit
  }

  // URL Hygiene: Strip payment metadata from the address bar
  // Removes ?payment_id=...&status=... so it looks normal
  window.history.replaceState({}, "", window.location.pathname);

  if (status === "succeeded") {
    return "success";
  }

  return "failed";
}


