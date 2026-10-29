# Blentinel website

The public website and documentation for [Blentinel](https://github.com/mrjimmybob/blentinel), built with [Astro](https://astro.build) 7, strict TypeScript and [Starlight](https://starlight.astro.build) for the docs. It is a fully static site: no server, no tracking, and almost no client-side JavaScript (a theme toggle on the homepage, plus Starlight's search and theme picker in the docs).

This folder is self-contained. Nothing in it is used by the Rust workspace, and nothing outside it is needed to build it.

## Requirements

- Node.js **22.12 or newer** (required by Astro 7)
- npm 9.6.5 or newer

## Install and develop

```sh
cd website
npm install
npm run dev        # http://localhost:4321
```

## Scripts

| Command                | What it does                                                          |
| ---------------------- | --------------------------------------------------------------------- |
| `npm run dev`          | Development server with live reload                                   |
| `npm run build`        | Production build into `dist/`                                         |
| `npm run preview`      | Serve the built `dist/` locally                                       |
| `npm run check`        | `astro check`: TypeScript (strictest preset) and Astro diagnostics    |
| `npm run format`       | Format everything with Prettier                                       |
| `npm run format:check` | Fail if anything isn't formatted                                      |
| `npm run check:links`  | After a build: verify every internal link, asset and `#anchor` exists |
| `npm run verify`       | `check`, `format:check`, `build` and `check:links` in one go          |

## Configuration: set the site URL

Canonical URLs, Open Graph tags and the sitemap need the public address of the site. It is read from environment variables at build time (see `astro.config.mjs`):

| Variable    | Default                                       | Example                                      |
| ----------- | --------------------------------------------- | -------------------------------------------- |
| `SITE_URL`  | `https://blentinel.example.org` (placeholder) | `https://mrjimmybob.github.io`               |
| `BASE_PATH` | `/`                                           | `/blentinel` for a GitHub Pages project site |

**Set `SITE_URL` before deploying**; the default is a placeholder. Root-relative links inside the docs Markdown (`/docs/...`) are prefixed with `BASE_PATH` automatically by `plugins/remark-base-links.mjs`.

```sh
SITE_URL=https://mrjimmybob.github.io BASE_PATH=/blentinel npm run build
```

## Deploying

The output in `dist/` is plain static files. Any static host works.

- **GitHub Pages:** build with `SITE_URL=https://<user>.github.io` and `BASE_PATH=/<repo>` (or `BASE_PATH=/` with a custom domain), and publish `website/dist`. Astro's guide: <https://docs.astro.build/en/guides/deploy/github/>. Note that the workflow file would live in the repository's root `.github/workflows/`, outside this folder, so it is not included here.
- **Netlify / Cloudflare Pages / Vercel:** base directory `website`, build command `npm run build`, output directory `dist`, Node 22. Set `SITE_URL` in the project's environment.
- **Any web server (nginx, Caddy, S3, …):** upload the contents of `dist/`. Serve `404.html` for missing pages.

## Project structure

```text
website/
├── astro.config.mjs          Astro + Starlight + sitemap configuration, docs sidebar
├── plugins/                  Two tiny remark plugins (base-path links, focusable tables)
├── public/                   favicon.svg (copied from src/assets), og.png (Open Graph image)
├── scripts/check-links.mjs   Dependency-free internal link checker for dist/
└── src/
    ├── assets/               favicon.svg (tab + header), blentinel.svg (footer), mark.svg (Starlight)
    ├── components/           SiteHeader, SiteFooter, ThemeToggle, Feature, ProbeHubDiagram
    ├── content/docs/docs/    Documentation pages (Markdown/MDX), served under /docs/
    ├── content.config.ts     Starlight content collection
    ├── data/site.ts          Site name, description, repository URL, navigation
    ├── layouts/Base.astro    Marketing page shell: meta tags, Open Graph, theme
    ├── pages/                index (homepage), 404, robots.txt
    └── styles/               tokens.css (shared design tokens), global.css, starlight.css
```

## Images

`src/assets/hub-company-view-dark.png` and `src/assets/hub-company-view-light.png` are the project's own screenshots (`images/blentinel.png` in the repository) with private host names and IP addresses redacted. The homepage shows the variant that matches `html[data-theme]`. `astro:assets` turns them into AVIF and WebP at several widths at build time, which is why `sharp` is a dependency. To replace them, keep the redaction and update the alt text in `src/components/HubScreenshot.astro`.

`src/assets/favicon.svg` is the site icon: marketing pages import it for the tab and the header mark; copy it to `public/favicon.svg` when it changes so Starlight’s docs tab icon stays in sync. `src/assets/blentinel.svg` is the larger logo in the footer.

## Content guidelines

- **The Blentinel source tree is the source of truth.** Every technical claim on this site should be traceable to the code or to the repository's `docs/`. When the project changes, update the pages here.
- Don't describe roadmap items as available. Link to `docs/ROADMAP.md` instead.
- Keep the docs here as an overview and link to the repository's detailed docs rather than copying them.
- Links to the repository's docs point at `blob/main/...` on GitHub. They only work once those files are pushed to `main`.
- `src/content/i18n/en.json` is an empty Starlight UI-string override file. Starlight always reads the `i18n` collection; with the collection defined and this file present, the build has no warnings.
- The theme choice is stored under Starlight's `starlight-theme` key, so the homepage and docs share it.
