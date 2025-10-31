import { Person } from '../types';

/**
 * Checks if two individuals are closely related (parent, child, sibling, or ancestor up to a certain depth).
 * @param personA The first person.
 * @param personB The second person.
 * @param personMap A map of all people in the game, keyed by their ID.
 * @param maxAncestorDepth The maximum number of generations to traverse upwards to check for ancestry. Defaults to 2 (grandparent).
 * @returns True if they are close kin, false otherwise.
 */
export function isCloseKin(
  personA: Person,
  personB: Person,
  personMap: Record<string, Person>,
  maxAncestorDepth: number = 2
): boolean {
  // Quick null checks
  if (!personA || !personB) return false;
  // Cannot marry oneself
  if (personA.id === personB.id) return true;

  // 1) Direct parent/child relationship
  if ((personA.parentIds || []).includes(personB.id)) return true;
  if ((personB.parentIds || []).includes(personA.id)) return true;

  // 2) Sibling/half-sibling relationship (share a parent)
  const parentsA = new Set(personA.parentIds || []);
  if (parentsA.size > 0) {
      for (const parentId of (personB.parentIds || [])) {
          if (parentId && parentsA.has(parentId)) return true;
      }
  }

  // 3) Ancestor check (e.g., grandparent/grandchild)
  const isAncestor = (descendant: Person, ancestor: Person, depth: number): boolean => {
    if (depth <= 0) return false;
    if (!descendant.parentIds || descendant.parentIds.length === 0) return false;
    
    for (const parentId of descendant.parentIds) {
      if (!parentId) continue;
      if (parentId === ancestor.id) return true;
      const parent = personMap[parentId];
      if (parent && isAncestor(parent, ancestor, depth - 1)) return true;
    }
    return false;
  };
  if (isAncestor(personA, personB, maxAncestorDepth)) return true;
  if (isAncestor(personB, personA, maxAncestorDepth)) return true;

  return false;
}
