/** Site-wide constants. Keep every external URL here. */
export const site = {
  name: 'Blentinel',
  tagline: 'Self-hosted monitoring for the networks you look after.',
  description:
    'Blentinel is open-source, self-hosted monitoring for servers, network devices and services across many locations. One hub shows availability and health and sends alerts. Built for MSPs, distributed IT teams and administrators of remote infrastructure.',
  repo: 'https://github.com/mrjimmybob/blentinel',
  license: 'MIT',
} as const;

export const repoFile = (path: string): string => `${site.repo}/blob/main/${path}`;
export const repoTree = (path: string): string => `${site.repo}/tree/main/${path}`;

export interface NavLink {
  readonly label: string;
  readonly href: string;
}

/** In-page and docs navigation for the marketing header. Paths are base-relative. */
export const nav: readonly NavLink[] = [
  { label: 'Why', href: '#why' },
  { label: 'Features', href: '#what' },
  { label: 'How it works', href: '#how' },
  { label: 'Docs', href: 'docs/' },
];
