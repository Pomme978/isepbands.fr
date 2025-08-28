/**
 * Utility functions for role translation and management
 */

interface Role {
  id: number;
  name: string;
  nameFrMale: string;
  nameFrFemale: string;
  nameEnMale: string;
  nameEnFemale: string;
  weight: number;
  isCore: boolean;
}

interface UserPronouns {
  pronouns?: string | null;
}

/**
 * Get the appropriate role name based on language, gender pronouns, and user preferences
 */
export function getRoleDisplayName(
  role: Role,
  userPronouns?: UserPronouns['pronouns'],
  language: 'fr' | 'en' = 'fr',
): string {
  if (!role) return '';

  // Determine if we should use feminine form
  const useFeminine =
    userPronouns &&
    (userPronouns.toLowerCase().includes('she') || userPronouns.toLowerCase().includes('elle'));

  // Return appropriate translation
  if (language === 'fr') {
    return useFeminine ? role.nameFrFemale : role.nameFrMale;
  } else {
    return useFeminine ? role.nameEnFemale : role.nameEnMale;
  }
}

/**
 * Get all role names for a user (sorted by weight, highest first)
 */
export function getAllRoleNames(
  roles: Array<{ role: Role }>,
  userPronouns?: UserPronouns['pronouns'],
  language: 'fr' | 'en' = 'fr',
): string {
  if (!roles || roles.length === 0) return 'Membre';

  const sortedRoles = roles
    .sort((a, b) => b.role.weight - a.role.weight)
    .map((r) => getRoleDisplayName(r.role, userPronouns, language));

  return sortedRoles.join(', ');
}

/**
 * Get the primary (highest weight) role name for a user
 */
export function getPrimaryRoleName(
  roles: Array<{ role: Role }>,
  userPronouns?: UserPronouns['pronouns'],
  language: 'fr' | 'en' = 'fr',
): string {
  if (!roles || roles.length === 0) return 'Membre';

  const primaryRole = roles.reduce((highest, current) =>
    current.role.weight > highest.role.weight ? current : highest,
  );

  return getRoleDisplayName(primaryRole.role, userPronouns, language);
}

/**
 * Check if a user has a specific role
 */
export function hasRole(roles: Array<{ role: Role }>, roleName: string): boolean {
  return roles.some((r) => r.role.name === roleName);
}

/**
 * Check if a user has any of the specified roles
 */
export function hasAnyRole(roles: Array<{ role: Role }>, roleNames: string[]): boolean {
  return roles.some((r) => roleNames.includes(r.role.name));
}

/**
 * Get role badge color based on role importance
 */
export function getRoleColor(role: Role): string {
  if (role.name === 'President') return 'text-purple-600';
  if (role.name === 'Vice-President') return 'text-blue-600';
  if (['Secretary', 'Treasurer', 'Communications'].includes(role.name)) return 'text-orange-600';
  return 'text-gray-600';
}

/**
 * Format role for badge display (returns French translation by default)
 */
export function formatRoleForBadge(role: Role, userPronouns?: UserPronouns['pronouns']): string {
  return getRoleDisplayName(role, userPronouns, 'fr');
}
