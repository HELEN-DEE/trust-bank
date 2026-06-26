---
name: Secure Transaction Logic
colors:
  surface: '#121316'
  surface-dim: '#121316'
  surface-bright: '#38393c'
  surface-container-lowest: '#0d0e10'
  surface-container-low: '#1b1b1e'
  surface-container: '#1f2022'
  surface-container-high: '#292a2c'
  surface-container-highest: '#343537'
  on-surface: '#e3e2e5'
  on-surface-variant: '#c4c6cf'
  inverse-surface: '#e3e2e5'
  inverse-on-surface: '#303033'
  outline: '#8e9098'
  outline-variant: '#44474e'
  surface-tint: '#b2c7ef'
  primary: '#b2c7ef'
  on-primary: '#1a3150'
  primary-container: '#0a2342'
  on-primary-container: '#768baf'
  inverse-primary: '#4a5f81'
  secondary: '#9fcaff'
  on-secondary: '#003259'
  secondary-container: '#006bb5'
  on-secondary-container: '#dbe9ff'
  tertiary: '#bcc7dd'
  on-tertiary: '#263142'
  tertiary-container: '#182334'
  on-tertiary-container: '#7f8a9f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#b2c7ef'
  on-primary-fixed: '#021c3a'
  on-primary-fixed-variant: '#324768'
  secondary-fixed: '#d2e4ff'
  secondary-fixed-dim: '#9fcaff'
  on-secondary-fixed: '#001d37'
  on-secondary-fixed-variant: '#00497e'
  tertiary-fixed: '#d8e3fa'
  tertiary-fixed-dim: '#bcc7dd'
  on-tertiary-fixed: '#111c2c'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#121316'
  on-background: '#e3e2e5'
  surface-variant: '#343537'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-xl:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  container-padding: 32px
  touch-target-min: 56px
---

## Brand & Style

The design system is centered on trust, efficiency, and tactile certainty. It is engineered for an ATM banking simulation where the user requires immediate visual feedback and a sense of physical security. 

The aesthetic blends **Modern Corporate** reliability with **Tactile/Skeuomorphic** cues. While the interface is clean and systematic, buttons and interactive elements possess a subtle physical depth to mimic the pressure-sensitive nature of hardware terminals. The emotional response is one of calm authority and precision, ensuring users feel their financial data is handled with institutional rigor.

## Colors

The palette is anchored in a deep navy base to communicate stability and security. 
- **Primary Navy (#0A2342):** Used for large container backgrounds and branding elements.
- **Action Blue (#3182CE):** Reserved strictly for interactive elements like primary buttons and focused states.
- **Slate Grey (#4A5568):** Utilized for secondary information, borders, and disabled states.
- **High Contrast:** The system defaults to a dark mode to reduce glare on physical screens and ensure high legibility of white and vibrant blue text. Functional colors (Success/Error) are tuned for high saturation against the dark backgrounds.

## Typography

This design system utilizes **Inter** for its exceptional legibility and neutral, systematic appearance. 
- **Scale:** Large display sizes are prioritized for balance readouts and main prompts to ensure accessibility from a standing distance.
- **Numeric Clarity:** Monospaced variants or tabular figures should be used for all currency displays to prevent "jumping" during balance updates.
- **Labels:** Uppercase labels with slight tracking are used for non-interactive metadata to distinguish them from actionable text.

## Layout & Spacing

The layout follows a **Fixed Grid** approach centered within a viewport to simulate a physical ATM kiosk screen.
- **Grid:** A 12-column grid is used for desktop simulation, while mobile views collapse into a single-column stack.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Touch Targets:** All interactive elements maintain a minimum height of 56px to accommodate various finger sizes and simulate the ease of use required for public hardware.
- **Safe Areas:** Large 32px margins are maintained at the screen edges to ensure content is not obscured by physical bezels.

## Elevation & Depth

To create a professional and secure feel, the design system employs **Ambient Shadows** and **Tonal Layering**.
- **The "Inner Glow" Technique:** Buttons feature a subtle 1px top border (lighter than the base color) and a 1px bottom shadow to create a bevel effect.
- **Surface Tiers:** 
  - **Level 0 (Background):** Deepest navy (#051120).
  - **Level 1 (Cards/Containers):** Surface navy (#0F2E52) with a subtle 4px blur shadow.
  - **Level 2 (Interactive):** Action Blue or Slate, featuring a "pushed" state (inset shadow) when active to provide tactile feedback.
- **Shadows:** Use a dark, low-opacity (#000000 at 40%) shadow with a 12px blur for floating elements like modals.

## Shapes

The shape language is structured and dependable.
- **Base Corner Radius:** 8px (0.5rem) for input fields and small buttons.
- **Large Container Radius:** 16px (1rem) for main balance displays and modal containers.
- **Numeric Keypad:** Buttons use the standard 8px radius to maintain a professional, hardware-like appearance rather than a playful pill shape.

## Components

### Buttons
- **Primary:** Action Blue background, white text, bold weight. Features a subtle gradient (top to bottom) for a slightly convex feel.
- **Secondary:** Transparent background with a 2px Slate Grey border.
- **Destructive/Cancel:** High-contrast Red (#F56565) only for "Cancel Transaction" or "End Session."

### Numeric Keypad
- **Layout:** Standard 3x4 grid.
- **Styling:** Large, 24px font size for numbers. Subtle tactile shadows on each key. The "Clear" and "Enter" keys are color-coded (Amber and Green respectively) following traditional ATM standards.

### Balance Displays
- Centered, high-contrast text using `display-lg`. 
- Currency symbols are slightly smaller than the integer values to emphasize the amount.
- Containers for balances have a slightly lighter background than the main screen to "lift" the information.

### Input Fields
- Dark backgrounds with a 2px border that glows Action Blue when focused. 
- Placeholder text is Slate Grey for clear distinction.

### Progress Indicators
- Linear step-trackers at the top of the screen to indicate the transaction flow (e.g., Amount > PIN > Confirmation).