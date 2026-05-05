/**
 * UPI Direct Gateway (Tier 3)
 * Handles direct UPI deep linking and QR generation redirection.
 */

export const gatewayCapabilities = {
  supportsCustomAmount: true,
  requiresPresetLinks: false,
  verificationType: "none",
  tier: 3,
};

/**
 * Initializes a UPI payment by redirecting to the UPI QR generator page.
 * @param {number} amount - Amount in INR (paise not used for direct UPI URLs)
 * @param {object} config - The chai.config.js object
 */
export async function initPayment(amount, config) {
  const params = new URLSearchParams({
    pa: config.upi?.id || '',
    pn: config.upi?.name || config.name,
    am: amount.toString(),
    tn: 'Support ' + config.name,
    cu: 'INR'
  });

  // Redirect to the upi_api.html page (or qr_generator.html for premium look)
  // We use the root-relative path
  window.location.href = `/upi_api.html?${params.toString()}`;

  // Return a promise that never resolves as the page is redirecting
  return new Promise(() => {});
}

/**
 * Generates a raw upi://pay URI for local use (e.g. mobile deep links)
 */
export function getUPIUrl(amount, config) {
  const pa = config.upi?.id || '';
  const pn = config.upi?.name || config.name;
  const tn = 'Support ' + config.name;
  const cu = 'INR';

  return `upi://pay?pa=${encodeURIComponent(pa)}&pn=${encodeURIComponent(pn)}&am=${amount}&tn=${encodeURIComponent(tn)}&cu=${cu}`;
}
