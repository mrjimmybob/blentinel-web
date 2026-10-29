// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import remarkBaseLinks from './plugins/remark-base-links.mjs';
import remarkScrollableTables from './plugins/remark-scrollable-tables.mjs';

// Set SITE_URL to the address the site is served from (see README).
// It is used for canonical URLs, Open Graph tags and the sitemap.
const site = process.env.SITE_URL ?? 'https://blentinel.example.org';
// For a GitHub Pages project site, set BASE_PATH=/blentinel.
const base = process.env.BASE_PATH ?? '/';

const repo = 'https://github.com/mrjimmybob/blentinel';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  markdown: {
    processor: unified({ remarkPlugins: [remarkBaseLinks({ base }), remarkScrollableTables()] }),
  },
  integrations: [
    starlight({
      title: 'Blentinel',
      description:
        'Documentation for Blentinel: push-based network and infrastructure monitoring for MSPs, written in Rust.',
      logo: { src: './src/assets/mark.svg', alt: '', replacesTitle: false },
      favicon: '/favicon.svg',
      social: [{ icon: 'github', label: 'Blentinel on GitHub', href: repo }],
      customCss: ['./src/styles/tokens.css', './src/styles/starlight.css'],
      disable404Route: true,
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: new URL(`${base.replace(/\/?$/, '/')}og.png`, site).href,
          },
        },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
      ],
      sidebar: [
        {
          label: 'Start here',
          items: [
            { label: 'Introduction', slug: 'docs' },
            { label: 'Project status', slug: 'docs/status' },
          ],
        },
        {
          label: 'Concepts',
          items: [
            { label: 'Architecture', slug: 'docs/architecture' },
            { label: 'Security model', slug: 'docs/security' },
          ],
        },
        {
          label: 'Getting started',
          items: [
            { label: 'Install the hub', slug: 'docs/getting-started/hub' },
            { label: 'Install a probe', slug: 'docs/getting-started/probe' },
            { label: 'Build from source', slug: 'docs/getting-started/build' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Configuration', slug: 'docs/reference/configuration' },
            { label: 'Checks', slug: 'docs/reference/checks' },
            { label: 'Full documentation', slug: 'docs/reference/repository-docs' },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
