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

    let settled = false;
    let timeout;
    let script = null;

    function onScriptLoad() {
      if (!settled) {
        settled = true;
        if (timeout) clearTimeout(timeout);
        resolve();
      }
    }

    function onScriptError() {
      if (!settled) {
        settled = true;
        if (timeout) clearTimeout(timeout);
        cleanup();
        reject(new Error(`Failed to load: ${src}`));
      }
    }

    function cleanup() {
      if (script) {
        script.onload = null;
        script.onerror = null;
      }
    }

    if (existingScript) {
      // SDK might be loading or already loaded.
      if (window.Razorpay) {
        resolve();
      } else {
        // Wire into the existing script's events
        existingScript.addEventListener('load', onScriptLoad, { once: true });
        existingScript.addEventListener('error', onScriptError, { once: true });

        // Safety timeout for the existing script too
        timeout = setTimeout(() => {
          if (!settled) {
            settled = true;
            existingScript.removeEventListener('load', onScriptLoad);
            existingScript.removeEventListener('error', onScriptError);
            reject(new Error(`Loading existing script timed out: ${src}`));
          }
        }, timeoutMs);
      }
      return;
    }

    script = document.createElement("script");
    script.src = src;

    timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        cleanup();
        if (script.parentNode) script.parentNode.removeChild(script);
        reject(new Error(`Loading script timed out: ${src}`));
      }
    }, timeoutMs);

    script.onload = onScriptLoad;
    script.onerror = onScriptError;

    document.body.appendChild(script);
  });
}
