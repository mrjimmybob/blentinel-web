// @ts-check
/**
 * Prefixes root-relative links in Markdown (e.g. `/docs/security/`) with the
 * configured base path, so docs content works when the site is served from a
 * sub-path such as GitHub Pages' `/blentinel/`. No-op when base is `/`.
 *
 * @param {{ base: string }} options
 */
export default function remarkBaseLinks({ base }) {
  const prefix = base.replace(/\/$/, '');
  /** @param {any} node */
  const walk = (node) => {
    if (node.type === 'link' && typeof node.url === 'string' && /^\/(?!\/)/.test(node.url)) {
      node.url = `${prefix}${node.url}`;
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };
  return () => (/** @type {any} */ tree) => {
    if (prefix) walk(tree);
  };
}
