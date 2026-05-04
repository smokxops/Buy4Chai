// src/gateways/razorpay.js

export async function initPayment(amount, config) {

  // Load Razorpay's SDK. Injects a script tag and waits for it to load.
  // If already loaded (supporter clicked twice), returns immediately.
  await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  // Razorpay uses callbacks, not Promises.
  // We wrap it so the page can use clean async/await.
  return new Promise((resolve, reject) => {

    if (config.gatewayKey.startsWith("rzp_test_")) {
      // Simulate successful payment for test keys to avoid infinite loading in local dev
      setTimeout(() => resolve({ razorpay_payment_id: "pay_dummy_123" }), 1500);
      return;
    }

    const options = {
      key: config.gatewayKey,        // Public Key ID only. Never the secret.
      amount: amount,                 // In paise. 5000 = ₹50.
      currency: config.currency || "INR",
      name: config.name,             // Appears in the modal header
      description: "Buy4Chai ☕",
      image: config.avatar,          // Your photo in the modal

      // No order_id — see Known Limitation above.
      // Payments work without it. Server-side verification is not possible.

      handler: function(response) {
        // Payment succeeded. Resolve the Promise.
        resolve(response);
      },

      theme: {
        color: config.accentColor || "#1D9E75",
      },

      modal: {
        ondismiss: function() {
          // Supporter closed the modal without paying.
          // Reject so the page can reset the button.
          reject(new Error("Payment cancelled by user"));
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function(response) {
      // Card declined, bank error, timeout, etc.
      reject(new Error(response.error.description || "Payment failed"));
    });

    rzp.open();
  });
}

// Injects a script tag and waits for it to load.
// Returns immediately if already present on the page.
// Copy this into any new gateway that needs to load an SDK.
function loadScript(src) {
  return new Promise((resolve, reject) => {
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
