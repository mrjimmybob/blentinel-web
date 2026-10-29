// @ts-check
/**
 * Starlight lets wide tables scroll horizontally. Make each table focusable so
 * keyboard users can scroll it too (axe: scrollable-region-focusable).
 */
export default function remarkScrollableTables() {
  /** @param {any} node */
  const walk = (node) => {
    if (node.type === 'table') {
      node.data ??= {};
      node.data.hProperties = { ...node.data.hProperties, tabIndex: 0 };
    }
    if (Array.isArray(node.children)) node.children.forEach(walk);
  };
  return () => walk;
}
