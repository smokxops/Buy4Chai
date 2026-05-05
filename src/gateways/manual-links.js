// src/gateways/manual-links.js

export const gatewayCapabilities = {
  supportsCustomAmount: false,
  requiresPresetLinks: true,
  verificationType: "none",
  tier: 0,
};

/**
 * Initiates payment via manual payment links pre-created in a dashboard.
 * @param {number} amount - Amount in INR
 * @param {object} config - Full chai.config.js object
 */
export async function initPayment(amount, config) {
  // Manual links use a mapping in the config:
  // config.paymentLinks = { 50: "...", 100: "..." }
  // Note: amount passed here is derived from displayAmountUSD * exchangeRate
  // We need to find the link that matches the selected amount.
  
  const link = config.paymentLinks?.[amount];
  
  if (!link) {
    throw new Error(`No payment link configured for ${amount}. Please check your chai.config.js.`);
  }

  // Redirect to the manual link
  window.location.href = link;

  return new Promise(() => {});
}
