// chai.config.js — The single source of truth for your supporter page

export default {
  // 1. Identity
  name: "Arjun",
  avatar: "/avatar.png",

  bio: "I build open source and write about web dev. Every chai helps me keep going ☕",
  
  // Narrative Story (New)
  story: "I'm a self-taught developer from India, building tools that help the local dev ecosystem thrive. Currently, I'm focusing on making financial tools more accessible to Indian creators who are often left behind by global platforms. Your support doesn't just buy me a chai—it buys me time to keep building and sharing everything I learn.",

  // Gallery Images (New)
  // Add URLs to your work, workspace, or anything you want to share.
  // Leave empty [] if you don't want a gallery.
  images: [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=800"
  ],

  // Pinned Projects (New)
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

  // 2. Social Links (Optional)
  socials: {
    github: "yourusername",
    twitter: "yourhandle",
    linkedin: "yourprofile",
    website: "https://yoursite.com",
  },

  // 3. Payment Gateway
  // Supported: "razorpay", "dodo"
  gateway: "razorpay",
  
  // Public Key only. Never put your secret key here.
  gatewayKey: "rzp_test_XXXXXXXXXXXX", 
  
  // 4. Currency & Pricing (Updated)
  currency: "INR", // Primary currency for your gateway
  displayCurrency: "USD", // Secondary currency for global supporters
  exchangeRate: 83.5, // 1 USD = 83.5 INR

  // Suggested amounts in USD (automatically converted to primary currency)
  suggestedAmounts: [2, 5, 10, 25],
  defaultAmount: 5, // Default amount in USD
  
  // 5. Theme Customization (Optional)
  accentColor: "#8B5E3C",

  // Success Message
  thankYouMessage: "You made my day! Your support keeps me motivated to build and share more.",

  // 6. Production & Security (Optional)
  // Set showSetup to false to hide the /#setup route from the public.
  showSetup: true,

  // If setupKey is set, you must access via /#setup?key=yourkey
  setupKey: "chai123",
}
