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
