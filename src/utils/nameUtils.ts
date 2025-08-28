/**
 * Utility functions for handling names and name formatting
 */

/**
 * Formats a full name from first name and last name
 * Handles various cases and fallbacks
 * @param firstName - The first name
 * @param lastName - The last name
 * @param fallbackName - Fallback name if first/last are not available
 * @returns Properly formatted full name
 */
export function formatFullName(
  firstName?: string | null,
  lastName?: string | null,
  fallbackName?: string | null,
): string {
  // If we have both first and last name, use them
  if (firstName && lastName) {
    return `${firstName.trim()} ${lastName.trim()}`;
  }

  // If we only have first name
  if (firstName && !lastName) {
    return firstName.trim();
  }

  // If we only have last name
  if (!firstName && lastName) {
    return lastName.trim();
  }

  // If we have a fallback name (like from auth provider)
  if (fallbackName) {
    return fallbackName.trim();
  }

  // Default fallback
  return 'Utilisateur';
}

/**
 * Gets initials from a full name
 * @param fullName - The full name
 * @returns Initials (max 2 characters)
 */
export function getInitials(fullName: string): string {
  if (!fullName || fullName.trim().length === 0) return '??';

  return fullName
    .trim()
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2); // Limit to 2 characters
}

/**
 * Formats a name for display with proper capitalization
 * @param name - The name to format
 * @returns Properly capitalized name
 */
export function capitalizeWord(name: string): string {
  if (!name) return '';

  return name
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
