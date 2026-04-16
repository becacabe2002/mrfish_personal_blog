# Design System: MrFish Personal Blog (Hybrid Artisan)

This document outlines the "Hybrid Artisan" design system, a blend of **Swiss Modernism** (grid-based, high-contrast, technical) and **Japandi Minimalism** (warm, textural, focused on "Ma" or negative space), implemented using **Vue 3 + PrimeVue**.

## 1. Core Visual Identity
- **Vibe:** Precise, warm, technical, and serene.
- **Layout:** An asymmetric Swiss grid that organizes content with mathematical precision, but softened by generous whitespace ("Ma") and organic textures.
- **UI Base:** Built on **PrimeVue** using **Unstyled Mode** with **Tailwind CSS** integration.

## 2. Color Palette (The Artisan Palette)
Focused on "natural ink" and "crafted paper" tones.

### Light Mode (Bone & Ink)
- **Primary Background:** `#f9f6f1` (Warm Bone/Paper - Tailwind `bg-[#f9f6f1]`)
- **Primary Foreground:** `#1a1a1a` (Deep Ink - Tailwind `text-[#1a1a1a]`)
- **Accent:** `#2c3e50` (Indigo Slate - Tailwind `text-[#2c3e50]`)
- **Subtle Border:** `rgba(26, 26, 26, 0.08)` (Tailwind `border-[#1a1a1a]/8`)
- **Muted Background:** `#f0ede6` (Tailwind `bg-[#f0ede6]`)

### Dark Mode (Charcoal & Bone)
- **Primary Background:** `#121212` (Matte Charcoal - Tailwind `bg-[#121212]`)
- **Primary Foreground:** `#e0e0e0` (Soft Bone - Tailwind `text-[#e0e0e0]`)
- **Accent:** `#34495e` (Muted Indigo - Tailwind `text-[#34495e]`)
- **Subtle Border:** `rgba(224, 224, 224, 0.1)` (Tailwind `border-[#e0e0e0]/10`)
- **Muted Background:** `#1e1e1e` (Tailwind `bg-[#1e1e1e]`)

## 3. Typography
- **Headings (Swiss Style):** *Plus Jakarta Sans* or *Inter*. Bold, tight tracking, used in a clear hierarchy.
- **Body (Japandi Style):** *Source Serif 4* or *Charter*. Large (`1.125rem`), high line-height (`1.8`), for effortless long-form reading.
- **Monospace:** *JetBrains Mono* for code and technical metadata.

## 4. PrimeVue Customization Strategy (Tailwind Unstyled)
- **Mode:** `unstyled: true`
- **Styling Engine:** Tailwind CSS via the **Pass Through (PT)** system.
- **Global Style Overrides:**
  - **Button:** `rounded-sm border-stone-200 transition-all hover:bg-stone-50`
  - **Ghost Buttons:** `border-none bg-transparent hover:bg-stone-100`
  - **Lightweight Inputs:** `bg-transparent border-b border-stone-300 focus:border-stone-900 focus:ring-0`
  - **Minimalist Cards:** `border border-stone-200 bg-white/50 backdrop-blur-sm p-6 shadow-none`

## 5. UI Component Patterns
- **Post List:** A minimalist vertical list using a grid layout (Date/Title/Category) with high-contrast typography.
- **Activity Feed:** Small, "ghost" card components for "Currently" (Reading, Watching, etc.) with Lucide icons.
- **Timeline:** A Swiss-style vertical line using the **PrimeVue Timeline** component, but with custom dots and minimalist text blocks styled with Tailwind.
- **Stats Grid:** A technical 4-column grid using thin borders to display "Experience," "Posts," and "Views."
- **Feedback Form:** A floating, minimalist bottom-sheet or sidebar using the **PrimeVue Dialog** or **Sidebar** component.

## 6. Implementation Notes
- **Component Driven:** Every UI element is a scoped Vue component.
- **Tailwind Presets:** Utilize PrimeVue's Tailwind-based unstyled presets for a rapid starting point, then customize via `pt`.
- **Shared States:** Use **Pinia** (if needed) for global theme toggling and search state.
- **Transitions:** Use Vue's `<Transition>` for subtle fade-in/fade-out effects during page navigation and component reveals.
