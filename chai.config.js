/**
 * Buy4Chai Configuration — The single source of truth for your page.
 * Edit this file and deploy to see changes.
 */
export default {
  // --- Profile Identity ---
  name: "Arjun",
  avatar: "/avatar.png",
  bio: "I build open source and write about web dev. Every chai helps me keep going ☕",
  
  // Public narrative and mission statement
  story: "I'm a self-taught developer from India, building tools that help the local dev ecosystem thrive. Currently, I'm focusing on making financial tools more accessible to Indian creators who are often left behind by global platforms. Your support doesn't just buy me a chai—it buys me time to keep building and sharing everything I learn.",

  // Showcase gallery (empty [] to hide)
  images: [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800"
  ],

  // Featured projects list
  projects: [
    {
      name: "Buy Me a Chai",
      description: "A self-hosted, gateway-agnostic supporter page for Indian developers. Zero fees, 10-minute setup.",
      link: "https://github.com/shoryasethia/BuyMeAChai",
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400"
    },
    {
      name: "DevToolbox",
      description: "A collection of 50+ tiny web tools for daily developer tasks. Used by 10k+ devs monthly.",
      link: "#",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=400"
    }
  ],

  // Social handles (keys match Lucide icons)
  socials: {
    github: "yourusername",
    twitter: "yourhandle",
    linkedin: "yourprofile",
    website: "https://yoursite.com",
  },

  // --- Payment Infrastructure ---
  gateway: "razorpay", // Options: "razorpay", "dodo"
  
  /**
   * IMPORTANT: Use PUBLIC Keys only.
   * This file is visible to everyone once deployed.
   */
  gatewayKey: "rzp_test_XXXXXXXXXXXX", 

  // UPI Direct (System B)
  upi: {
    enabled: true,
    id: "yourname@upi",
    name: "Arjun",
  }, 
  
  // Dual-Currency Logic
  currency: "INR",          // Your gateway's native currency
  displayCurrency: "USD",   // Global display currency for supporters
  exchangeRate: 83.5,       // Conversion factor: 1 USD = X INR

  // Suggested amounts in USD (automatically converted to native currency)
  suggestedAmounts: [2, 5, 10, 25],
  defaultAmount: 5, 
  
  accentColor: "#8B5E3C",
  thankYouMessage: "You made my day! Your support keeps me motivated to build and share more.",

  // --- Admin & Security ---
  showSetup: true, // Hide the /#setup wizard after configuration
  
  /**
   * If set, access wizard via: /#setup?key=YOUR_KEY
   */
  setupKey: "chai123",
}
