import type { Healing, Selector, Snapshot } from './schema.js';
// Never infer a new assertion or silently fuzzy-match a target.
export function suggestHealing(original: Selector, snapshot: Snapshot): Healing[] {
  const matches: Healing[] = [];
  if (original.frame || original.windowTitle) return matches;
  for (const node of snapshot.nodes) {
    const sameName = !!original.name && node.name === original.name;
    const sameText = !!original.text && (node.text === original.text || node.name === original.text);
    if ((!sameName && !sameText) || (original.role && node.role !== original.role) || (original.controlType && node.controlType !== original.controlType)) continue;
    const proposed: Selector | undefined = node.automationId
      ? { automationId: node.automationId, ...(node.controlType ? { controlType: node.controlType } : {}) }
      : node.testId ? { testId: node.testId }
      : node.role && node.name ? { role: node.role, name: node.name } : undefined;
    if (!proposed || JSON.stringify(proposed) === JSON.stringify(original)) continue;
    matches.push({ original, proposed, confidence: 1, reason: 'Exact accessible identity matched; locator strategy changed. Uniqueness must be verified before retry.', applied: false });
  }
  return [...new Map(matches.map(m => [JSON.stringify(m.proposed), m])).values()];
}
