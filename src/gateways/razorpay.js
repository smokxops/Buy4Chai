// src/gateways/razorpay.js

export const gatewayCapabilities = {
  supportsCustomAmount: true,
  requiresPresetLinks: false,
  verificationType: "client",
  tier: 2,
};

/**
 * Orchestrates the Razorpay checkout flow
 * @param {number} amount - Amount in paise (e.g. 5000 for ₹50)
 */
export async function initPayment(amount, config) {

  // Dynamically load Razorpay SDK only when needed
  // Injects a script tag and waits for it to load.
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  // Wrap Razorpay's callback-based API in a Promise for async/await usage
  return new Promise((resolve, reject) => {

    const options = {
      key: config.gatewayKey,        // Public API Key (Client-side)
      amount: amount,                 
      currency: config.currency || "INR",
      name: config.name,             
      description: "Buy4Chai ☕",
      image: config.avatar,          

      // No order_id — see Known Limitation in documentation.
      // Payments work without it. Server-side verification is not possible in this static setup.

      // Success Handler: Triggered by Razorpay on successful transaction
      handler: function(response) {
        resolve(response);
      },

      prefill: {
        name: config.name,
        // email and contact are not typically in chai.config.js, but could be added by user
        email: config.email || "",
        contact: config.contact || ""
      },

      theme: {
        color: config.accentColor || "#1D9E75",
      },

      modal: {
        // User closed the modal manually
        ondismiss: function() {
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function(response) {
      reject(new Error(response.error.description || "Payment failed"));
    });

    rzp.open();
  });
}

/**
 * Injects a script tag and waits for load/error events
 * Returns immediately if already present on the page.
 * Copy this into any new gateway that needs to load an SDK.
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    // Prevent duplicate script injection
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.body.appendChild(script);
  });
}


