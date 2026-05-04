// chai.config.js — The single source of truth for your supporter page

export default {
  // 1. Identity
  name: "Arjun",
  avatar: "/avatar.png",

  bio: "I build open source and write about web dev. Every chai helps me keep going ☕",
  
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
  
  // 4. Customization
  currency: "INR",
  defaultAmount: 100, // In whole units (₹100)
  exchangeRate: 90, // Conversion rate for USD display on the button
  accentColor: "#8B5E3C",
  
  // 5. Theme Customization (Optional)
  // Uncomment and change these hex codes to match your brand's vibe.
  // theme: {
  //   light: {
  //     bg: "#FDF8F3",
  //     bgSubtle: "#F5EDE2",
  //     card: "#FFFFFF",
  //     cardBorder: "#E6D5C3",
  //     inputBg: "#F5EDE2",
  //     textPrimary: "#3D2B1F",
  //     textMuted: "#7C6A5B",
  //     textFaint: "#A89080"
  //   },
  //   dark: {
  //     bg: "#18130E",
  //     bgSubtle: "#211810",
  //     card: "#241B13",
  //     cardBorder: "#3D2F24",
  //     inputBg: "#2E2118",
  //     textPrimary: "#F5EDE2",
  //     textMuted: "#C2A88C",
  //     textFaint: "#7C6550"
  //   }
  // },

  // 6. Success Message
  thankYouMessage: "You made my day! Your support keeps me motivated to build and share more.",
}
