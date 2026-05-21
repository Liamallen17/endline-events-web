# Endline Events Web

Marketing and event information site for **Endline Events**, a UK-based endurance sports event company. Built with React + TypeScript + Vite. Originally deployed to GitHub Pages under the path `/endline-events-web/`; currently migrating to Cloudflare (served from `/`). A `worker/` directory holds the Cloudflare Worker.

## Tech Stack

- **React 19** with TypeScript
- **Vite 6** — dev server and build tool
- **React Router v7** — client-side routing, served from `/` (no basename)
- **Tailwind CSS v4** — installed as an npm package, wired up via the `@tailwindcss/vite` plugin in `vite.config.ts`; theme tokens and global CSS live in `src/index.css`
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
index.tsx            # React entry point; imports src/index.css
index.html           # HTML shell — fonts only; Tailwind comes from src/index.css now
src/index.css        # Tailwind v4 entry: @import "tailwindcss" + @theme tokens + global CSS
components/          # Reusable UI components
pages/               # Full-page route components
public/              # Static assets (images)
worker/              # Cloudflare Worker (migration in progress)
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

Tailwind v4 is configured CSS-first in `src/index.css` via `@import "tailwindcss"` and an `@theme` block. There is no `tailwind.config.js`. The `@tailwindcss/vite` plugin (registered in `vite.config.ts`) handles compilation.

**Custom design tokens** (defined in the `@theme` block in `src/index.css`):

```css
--font-mono: "Space Mono", monospace;
--font-display: "Michroma", sans-serif;

--color-syncra-black: #0a0a0a;   /* primary background */
--color-syncra-lime: #dfff87;    /* primary accent / text color */
--color-syncra-gray: #333333;

--color-tracksix-blue: #38BDF8;
--color-tracksix-purple: #A855F7;
```

Tailwind v4 generates utility classes from these tokens (e.g. `bg-syncra-black`, `text-syncra-lime`, `font-display`).

**Global CSS** (also in `src/index.css`, outside the `@theme` block):
- `.container` — max-width 1200px, 20px mobile padding, 48px tablet+ padding
- `.tracksix` — CSS custom property scope for the Tracksix page blue/purple theme (`--tracksix-blue: #38BDF8`, `--tracksix-purple: #A855F7`)
- `.accent-blue` / `.accent-purple` / `.gradient-divider` / `.gradient-text` / `.gradient-border` — Tracksix-specific utility classes scoped under `.tracksix`
- Lime-colored scrollbars via `::-webkit-scrollbar`
- `body` background/foreground are set directly in CSS, not via Tailwind utility classes

**Tracksix page** uses a blue/purple color scheme (sky blue + violet) instead of the default lime theme. These colors are applied via `.tracksix` scoped CSS vars, not Tailwind tokens.

## Static Assets

All images live in `public/`. Components reference them with `${import.meta.env.BASE_URL}<filename>` (e.g. `${import.meta.env.BASE_URL}FTP-623.JPG`) so the path automatically tracks whatever Vite `base` is configured — `/` on Cloudflare, `/endline-events-web/` if `base` is ever re-added for GitHub Pages.

- `FTP-623.JPG` — BBU hero background
- `BBU-25-1.JPG` — BBU 25.1 gallery card image
- `BBU-26-1.JPG` — BBU 26.1 gallery card image
- `Tracksix1.jpg` — Tracksix hero background
- `EEwebpic.jpg` — general use
- `BBU Medal Transparent.png` — BBU medal image

## Deployment

Two independent GitHub Actions, both targeting Cloudflare. Pages' native git integration isn't used because the upstream repo is owned by the client, not the deploying Cloudflare account — connecting it via the dashboard isn't allowed for shared-with-you repos.

- **Frontend (Cloudflare Pages):** `.github/workflows/deploy-frontend.yml` runs `wrangler pages deploy dist --project-name=endline-events --branch=main` on push to `main`, skipped when only `worker/**` files change. Served from `/` on `endlineevents.com`; `vite.config.ts` does not set `base` and `BrowserRouter` has no `basename`.
- **Worker (`worker/`):** `.github/workflows/deploy-worker.yml` runs `wrangler deploy` on push to `main` when `worker/**` changes. Binds to `endlineevents.com/api/*` via the `routes` entry in `worker/wrangler.toml`, so frontend `fetch('/api/...')` calls are same-origin.

Both workflows require `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets. The token needs **Workers Scripts:Edit**, **Workers Routes:Edit** (zone-scoped to `endlineevents.com`), and **Cloudflare Pages:Edit**.

D1 migrations are not run by the deploy workflow — apply them manually with `cd worker && npm run db:migrate:remote` before pushing code that depends on the new schema.

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
