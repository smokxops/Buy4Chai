# Buy Me a Chai — Design System & UI Architecture

This document tracks the UI/UX decisions, color tokens, dark mode strategy, and component architecture for the project.

---

## 1. Core Aesthetic

The goal is to feel **premium, trustworthy, and modern** without being overwhelming. We want a design that developers are proud to host on their own domains.

- **Theme**: "Glassy Chai"
- **Typography**: Outfit (sans-serif) — clean, geometric, highly legible at small sizes.
- **Vibe**: Soft shadows, warm tones, pill-shaped buttons, and subtle micro-animations (Framer Motion).

## 2. Color System & Tokens

We use a custom Tailwind palette based on warm, earthy, "chai" tones. 
To ensure bulletproof dark mode support, we do NOT use Tailwind's `dark:` utility classes everywhere. Instead, we use CSS variables mapped to functional `.theme-*` classes in `index.css`.

### Base Tailwind Palette (`chai`)
- `50`: `#FDF8F3` (Light background)
- `100`: `#F7E9D9` (Input background, hover states)
- `200`: `#E6D5C3` (Borders, subtle dividers)
- `300`: `#D4A373` (Accents)
- `400`: `#B88B5B` (Muted text, secondary icons)
- `500`: `#8B5E3C` (Primary Brand Color — buttons, active states)
- `600`: `#754F33` (Hover states for primary)
- `700`: `#5F4029` (Badges, emphasized text)
- `800`: `#4A3120` (Dark mode borders/cards)
- `900`: `#3D2B1F` (Primary text in light mode)

### Theming Strategy (CSS Variables)

We define functional variables at the `:root` and `.dark` level. 

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--bg` | `#FDF8F3` | `#18130E` | Main page background |
| `--bg-subtle` | `#F5EDE2` | `#211810` | Secondary areas, steps, inactive buttons |
| `--card` | `#FFFFFF` | `#241B13` | Main content cards |
| `--card-border`| `#E6D5C3` | `#3D2F24` | Borders for cards and inputs |
| `--input-bg` | `#F5EDE2` | `#2E2118` | Form inputs, inactive preset amounts |
| `--text-primary`| `#3D2B1F` | `#F5EDE2` | Headings, main body text |
| `--text-muted` | `#7C6A5B` | `#C2A88C` | Secondary text, bio, social links |
| `--text-faint` | `#A89080` | `#7C6550` | Footers, placeholders |

**Why this matters**: By applying `.theme-card`, `.theme-bg`, and `.theme-text` to elements, the colors swap automatically when the `<html>` element gets the `dark` class. This prevents "invisible text" bugs where a developer forgets to add `dark:text-white` to a specific span.

## 3. UI Components Architecture

The React app is built as a Single Page Application (SPA) using Vite, but it has two distinct "pages" handled via a simple hash router (`App.jsx`).

### A. The Supporter Page (`/`)
File: `src/SupporterPage.jsx`

This is what the end-user (the supporter) sees.
- **Header**: Logo, title, developer's social links, dark mode toggle.
- **Profile**: Avatar (local `/avatar.png` or remote URL), Name, Bio.
- **Payment Card**: 
  - 4 Preset amounts (with a "POPULAR" badge on ₹100).
  - Custom amount input.
  - Gateway-specific action button ("Support with Razorpay").
- **Success State**: The form is hidden/collapsed upon successful payment and replaced with a personalized "Thank You" message.

### B. The Setup Wizard (`/#setup`)
File: `src/SetupPage.jsx`

This is the developer onboarding flow. It ensures the user configures the project correctly before deploying.

- **Step 1: Identity**: Name, Bio, Avatar. Includes a live preview and explicit instructions on how Vite handles the `public/` directory for static assets.
- **Step 2: Socials**: URL-prefixed inputs for GitHub, Twitter, LinkedIn, Website.
- **Step 3: Gateway**: Selection between Razorpay and Dodo.
  - *Context-Aware Instructions*: Shows exactly where to click in the respective dashboards to get the required keys.
  - *Security Focus*: Explicit warnings against pasting the Key Secret in the frontend.
- **Step 4: Customize**: Default amount selection, Currency picker, Thank you message.
- **Step 5: Config**: Generates the final `chai.config.js` string, provides a one-click copy button, and lists the exact 5 steps to deploy to Vercel/GitHub Pages.

## 4. Key UX Decisions

1. **No Backend**: The entire UI is static. The payment gateway SDKs (Razorpay checkout.js or Dodo redirects) are loaded lazily on the client.
2. **Error Handling**: 
   - Network/API errors are shown inline above the payment button.
   - User cancellations (e.g., closing the Razorpay modal) are caught silently and do not show red errors.
3. **Safe Character Encoding**: To prevent build errors from tools like `esbuild`, the source code avoids unicode characters (like curly quotes `’` or arrows `→`) inside JSX text nodes, utilizing safe ASCII alternatives or HTML entities.
