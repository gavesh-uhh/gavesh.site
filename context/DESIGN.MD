# Design Context: gavesh.live

## 1. Core Design Logic

The project is built as a **single coherent personal portfolio shell** with dynamic sub-pages, not as disconnected pages.  
The `(portfolio)` layout defines a stable frame:

- persistent animated cosmic background
- persistent identity header (avatar + now-playing status)
- persistent pill-style navigation
- content area that swaps with a soft fade transition

This gives the site a “living profile” feel where the shell stays constant and page content rotates.

## 2. Visual Language

The visual system is **dark, minimal, and high-contrast**, using HSL design tokens in `app.css` + Tailwind mapping in `tailwind.config.ts`.

Primary traits:

- deep dark background (`--background`)
- bright foreground text (`--foreground`)
- muted secondary text (`--muted-foreground`)
- soft translucent cards (`bg-white/5`, `hover:bg-white/10`)
- rounded, pill-like controls (`rounded-3xl`)
- subtle borders/dividers (`border-white/25`, low-opacity `<hr>`)

This produces a clean “quiet-tech” aesthetic with restrained color use and small accent moments.

## 3. Typography Choices

Typography is intentionally split by role:

- **IBM Plex Sans** is the global base font (functional, modern, readable)
- **Hedvig** is a display accent font for identity emphasis (name branding)

Hierarchy is mostly handled through utility classes (`text-xs` → `text-3xl`, `font-semibold`, muted color) rather than custom type scales, keeping styling direct and component-local.

## 4. Motion & Atmosphere

Motion is used to create ambience instead of flashy transitions:

- Canvas background simulates stars/comets/shooting stars with continuous low-intensity movement.
- Route content transitions via a short fade (`450ms`) for continuity.
- Micro-interactions use quick hover opacity/color changes.

Overall behavior is **calm and continuous**, supporting the “space/minimalism + personal identity” concept.

## 5. Language & Copy Style

The writing style is intentionally personal and informal:

- direct first-person sections (“About Me”, “Interests”, “Currently Learning”)
- concise bullet-like fragments over long prose
- practical project blurbs with WIP labels
- human, non-corporate tone (casual phrasing is preserved)

The copy favors authenticity and quick scanning over polished marketing language.

## 6. Information Architecture

Navigation is icon-assisted and shallow, optimized for quick exploration:

- `/` About/identity
- `/projects` project highlights
- `/skills` grouped skills by domain
- `/music` live/top listening context
- `/links` external destinations

The header-level “Now Listening” block connects identity with real-time activity, adding temporal freshness.

## 7. Component Styling Patterns

Styling strategy is utility-first with repeated patterns:

- flexible vertical rhythm (`flex`, `gap-*`)
- compact cards/rows for data lists
- left-border callouts for grouped content
- small iconography (`lucide-svelte` + tech logos)
- muted text for secondary metadata

This keeps implementation simple and maintains a consistent rhythm across pages.

## 8. Data-Driven UI Character

Even with static portfolio content, dynamic endpoints (`/api/recent`, `/api/popular`, etc.) are used to keep the experience “alive”:

- avatar fetched from GitHub
- current listening state polled from Last.fm-backed endpoints
- top tracks loaded on the music page

The design intent is a hybrid: **static identity + live personal signals**.

## 9. Stylistic North Star (Summary)

The project’s style can be summarized as:

**Minimalist personal dashboard with cosmic ambience, utility-first UI, and human-first copy.**

It optimizes for:

1. clarity and scanability
2. personality without visual clutter
3. gentle motion and real-time context over heavy interaction
