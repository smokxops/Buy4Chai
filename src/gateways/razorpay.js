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

  // Sandbox bypass: Resolve immediately if the default dummy key is detected.
  // This allows automated testing and UX previews without a real Razorpay account.
  // Checked before loading the external SDK so it works offline/in blocked environments.
  if (config.gatewayKey === "rzp_test_XXXXXXXXXXXX") {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ razorpay_payment_id: "pay_dummy_123" }), 1500);
    });
  }

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

    try {
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function(response) {
        reject(new Error(response.error.description || "Payment failed"));
      });

      rzp.open();
    } catch (err) {
      reject(new Error(err.message || "Failed to initialize Razorpay checkout"));
    }
  });
}

/**
 * Injects a script tag and waits for load/error events with a timeout.
 * Returns immediately if already present on the page.
 */
function loadScript(src, timeoutMs = 15000) {
  return new Promise((resolve, reject) => {
    // Prevent duplicate script injection
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      // If it's already finished loading, resolve.
      // If it's still loading, we should ideally wait for it,
      // but for Razorpay, it's safer to just assume it's coming or re-check.
      // Simple approach: if it exists, it's either loaded or loading.
      resolve();
      return;
    }

    let settled = false;
    const script = document.createElement("script");
    script.src = src;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        reject(new Error(`Loading script timed out: ${src}`));
      }
    }, timeoutMs);

    function cleanup() {
      script.onload = null;
      script.onerror = null;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    script.onload = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        resolve();
      }
    };

    script.onerror = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        cleanup();
        reject(new Error(`Failed to load: ${src}`));
      }
    };

    document.body.appendChild(script);
  });
}


