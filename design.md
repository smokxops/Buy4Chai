# Buy Me a Chai — Design System & UI Architecture

This document tracks the UI/UX decisions, color tokens, dark mode strategy, and component architecture for the project.

---

## 1. Core Aesthetic

The goal is to feel **narrative-driven, intentional, and human**. We've moved away from "transactional" payment pages toward a design that tells a story. We want a design that developers are proud to host on their own domains as their primary "About" or "Support" page.

- **Theme**: "Narrative Chai"
- **Typography**: Outfit (sans-serif) — clean, geometric, highly legible at small sizes.
- **Vibe**: 2-column editorial layout, soft glassmorphism, warm tones, and narrative flow.

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

The supporter page uses an **Editorial/Narrative** layout. Instead of a single centered card, it uses a 2-column structure on desktop:
- **Left Column (The Story)**:
  - **Hero Identity**: High-res avatar, bold greeting, and one-line bio.
  - **Social Links**: Prominent button-style links with platform icons.
  - **Narrative Section**: A dedicated "My Story" space for long-form mission statements.
  - **Visual Gallery**: A grid of images (hides automatically if none provided).
  - **Pinned Projects**: High-quality cards for showcasing open-source work.
- **Right Column (The CTA)**:
  - **Sticky Support Card**: Follows the user as they read the story.
  - **Support Overlay**: A refined, focused menu for selecting payment amounts.
- **Success State**: A celebratory "Thank You" screen with custom messaging.

### B. The Currency System
Buy4Chai features a sophisticated **Dual-Currency** engine:
- **Creator Base**: Creators set their exchange rate and suggested amounts in USD (as a global standard).
- **Supporter Choice**: Supporters can toggle between USD and the primary currency (e.g., INR).
- **Visual Swapping**: When toggled, the UI swaps the "Major" and "Minor" currency positions on all buttons.
- **Locale Awareness**: Correct formatting for ₹ (en-IN) and $ (en-US).

### C. The Setup Wizard (`/#setup`)
File: `src/SetupPage.jsx`

A 6-step gated wizard for 0-code configuration.

- **Step 1: Identity**: Name, Bio, Avatar setup.
- **Step 2: Narrative**: Editor for long-form story, image gallery management, and project pinning (with reordering).
- **Step 3: Socials**: Link management.
- **Step 4: Gateway**: Razorpay/Dodo configuration with integrated security guides.
- **Step 5: Customize**: Currency settings, exchange rates, and suggested amounts.
- **Step 6: Config**: Generates `chai.config.js` with integrated security flags.

**Security Gates**:
- **Setup Lockdown**: Developers can set `showSetup: false` in their config to disable the route entirely in production.
- **Password Protection**: The route is protected by a `setupKey`. Access requires a URL parameter like `/#setup?key=YOUR_KEY`.

## 4. Key UX Decisions

1. **No Backend**: The entire UI is static. The payment gateway SDKs (Razorpay checkout.js or Dodo redirects) are loaded lazily on the client.
2. **Error Handling**: 
   - Network/API errors are shown inline above the payment button.
   - User cancellations (e.g., closing the Razorpay modal) are caught silently and do not show red errors.
3. **Safe Character Encoding**: To prevent build errors from tools like `esbuild`, the source code avoids unicode characters (like curly quotes `’` or arrows `→`) inside JSX text nodes, utilizing safe ASCII alternatives or HTML entities.
