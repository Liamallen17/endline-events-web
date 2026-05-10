# Endline Events Web

Marketing and event information site for **Endline Events**, a UK-based endurance sports event company. Built with React + TypeScript + Vite, deployed to GitHub Pages.

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** — dev server and build tool
- **React Router v7** — client-side routing, basename `/endline-events-web/`
- **Tailwind CSS** — loaded via CDN in `index.html` (not installed as a package); config is inline in the `<script>` block in `index.html`
- **Framer Motion** — page/section animations
- **Lucide React** — icons

## Commands

```bash
npm install   # install deps
npm run dev   # local dev server
npm run build # production build (outputs to dist/)
npm run preview # preview production build locally
```

## Project Structure

```
App.tsx              # Root: BrowserRouter + route definitions
index.tsx            # React entry point
index.html           # HTML shell; holds Tailwind CDN + config, global CSS, fonts
components/          # Reusable UI components
pages/               # Full-page route components
public/              # Static assets (images)
```

### Routes

| Path | Component | Description |
|---|---|---|
| `/` | `HomePage` (inline in App.tsx) | Main landing page |
| `/events/bbu` | `BBUEvent` | Boughton Backyard Ultra event page |
| `/events/tracksix` | `TracksixEvent` | Tracksix relay event page |
| `/gallery` | `GalleryPage` | Event photo galleries (BBU 25.1, BBU 26.1, future events) |
| `/privacy` | `PrivacyPolicy` | Privacy policy |
| `/cookies` | `CookiePolicy` | Cookie policy |

### Homepage Sections (in order)

`Navbar` → `Hero` → `BrandingBar` → `ImageBanner` → `About` → `ServicesIndex` → `Contact` → `Footer`

### Components

- **Navbar** — fixed top nav with "OUR EVENTS" dropdown (BBU, Tracksix), Gallery (links to /gallery) and Contact scroll links, mobile hamburger menu
- **Hero** — animated SVG three-bar logo (parallelogram bars, cyan→lime gradient) with Framer Motion blur-in
- **BrandingBar** — large display-font "ENDLINE EVENTS" text
- **ImageBanner** — full-width photo strip
- **About** — mission statement paragraph
- **ServicesIndex** — services listing
- **Contact** — contact form/info (id="contact" — scroll target)
- **Footer** — site footer
- **ScrollToTop** — resets scroll position on route change
- **RulesModal / TermsModal** — modals for BBU event rules and T&Cs
- **TracksixRulesModal / TracksixTermsModal** — modals for Tracksix rules and T&Cs
- **TracksixModal** — additional Tracksix modal

### Pages

- **GalleryPage** — `/gallery` route; grid of event gallery cards linking out to Pixieset albums (BBU 25.1, BBU 26.1)

## Styling

**Important:** Tailwind is loaded via CDN — do not install it as an npm package or add a `tailwind.config.js` file. The Tailwind config lives in a `<script>` block inside `index.html`.

**Custom design tokens** (defined in `index.html` Tailwind config):

```js
colors: {
  syncra: {
    black: '#0a0a0a',   // primary background
    lime: '#dfff87',    // primary accent / text color
    gray: '#333333'
  }
}
fontFamily: {
  mono: ['"Space Mono"', monospace],      // body/UI text
  display: ['"Michroma"', sans-serif],    // large display headings (BrandingBar)
}
```

**Global CSS** lives in the `<style>` block in `index.html`:
- `.container` — max-width 1200px, 20px mobile padding, 48px tablet+ padding
- `.tracksix` — CSS custom property scope for the Tracksix page blue/purple theme (`--tracksix-blue: #38BDF8`, `--tracksix-purple: #A855F7`)
- `.accent-blue` / `.accent-purple` / `.gradient-divider` — Tracksix-specific utility classes scoped under `.tracksix`
- Lime-colored scrollbars via `::-webkit-scrollbar`

**Tracksix page** uses a blue/purple color scheme (sky blue + violet) instead of the default lime theme. These colors are applied via `.tracksix` scoped CSS vars, not Tailwind tokens.

## Static Assets

All images are in `public/` and referenced with the `/endline-events-web/` prefix (matching the Vite `base` config):

- `/endline-events-web/FTP-623.JPG` — BBU hero background
- `/endline-events-web/BBU-25-1.JPG` — BBU 25.1 gallery card image
- `/endline-events-web/BBU-26-1.JPG` — BBU 26.1 gallery card image
- `/endline-events-web/Tracksix1.jpg` — Tracksix hero background
- `/endline-events-web/EEwebpic.jpg` — general use
- `/endline-events-web/BBU Medal Transparent.png` — BBU medal image

## Deployment

Deployed to GitHub Pages at `https://<user>.github.io/endline-events-web/`. The Vite `base` is set to `/endline-events-web/` in `vite.config.ts`, and `BrowserRouter` uses the same basename. The GitHub Actions workflow handles deployment.

## Events

### Boughton Backyard Ultra (BBU)
- Date: May 2, 2026
- Venue: Boughton Estate, Northamptonshire, NN14
- Format: Backyard Ultra — 4.2 mile (6.7km) loops, one per hour
- Categories: Last Man Standing (24h solo), Full Pair (24h duo), Half Solo (12h), Half Pair (12h)
- Contact: endlineevents@gmail.com
- Registration site: boughtonbackyardultra.co.uk

### Tracksix
- Venue: Northants, NN14
- Date: TBD ("Coming Soon")
- Format: 6-hour team relay — teams of 4–6 runners, each runner completes 1 mile (4 track laps) per stint
- Win categories: Most laps (4-person team), Most laps (6-person team), Fastest individual mile
- Contact: endlineevents@gmail.com
