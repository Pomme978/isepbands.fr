// utils/schoolUtils.js

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date in format 'YYYY-MM-DD'
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

/**
 * Get current academic year (e.g., "2024-2025")
 * Academic year starts on August 20
 * @returns Current academic year
 */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0 = Jan, 7 = Aug
  const currentDay = now.getDate();

  // If today is after or on August 20, switch to new academic year
  if (currentMonth > 7 || (currentMonth === 7 && currentDay >= 20)) {
    return `${currentYear}-${currentYear + 1}`;
  } else {
    return `${currentYear - 1}-${currentYear}`;
  }
}

/**
 * Calculate graduation year based on current level
 * @param currentLevel - Current academic level (I1, I2, A1, A2, A3, B1, B2, B3, P1, P2)
 * @param currentAcademicYear - Current academic year (e.g., "2024-2025")
 * @returns Graduation year
 */
export function calculateGraduationYear(
  currentLevel: string,
  currentAcademicYear?: string,
): number {
  if (!currentAcademicYear) {
    currentAcademicYear = getCurrentAcademicYear();
  }

  const startYear = parseInt(currentAcademicYear.split('-')[0]);

  // Define the progression paths
  const progressionMaps: Record<string, number> = {
    // Integrated prepa + engineering (5 years total)
    P1: 4, // P1 -> P2 -> A1 -> A2 -> A3
    P2: 3, // P2 -> A1 -> A2 -> A3
    I1: 4, // I1 -> I2 -> A1 -> A2 -> A3
    I2: 3, // I2 -> A1 -> A2 -> A3
    A1: 2, // A1 -> A2 -> A3
    A2: 1, // A2 -> A3
    A3: 0, // Graduating this year

    // Bachelor (3 years)
    B1: 2, // B1 -> B2 -> B3
    B2: 1, // B2 -> B3
    B3: 0, // Graduating this year
  };

  const yearsRemaining = progressionMaps[currentLevel];
  if (yearsRemaining === undefined) {
    throw new Error(`Invalid academic level: ${currentLevel}`);
  }

  return startYear + yearsRemaining + 1; // +1 because graduation happens at the end of the academic year
}

/**
 * Format promotion information
 * @param currentLevel - Current academic level
 * @param dateOfBirth - Date of birth in format 'YYYY-MM-DD'
 * @param isOutOfSchool - Whether the student has graduated/left school
 * @param currentAcademicYear - Current academic year (optional)
 * @returns Formatted promotion string
 */
export function formatPromotion(
  currentLevel: string,
  dateOfBirth: string,
  isOutOfSchool = false,
  currentAcademicYear?: string,
): string {
  if (isOutOfSchool) {
    const age = calculateAge(dateOfBirth);
    return `Diplômé(e) (${age} ans)`;
  }

  try {
    const graduationYear = calculateGraduationYear(currentLevel, currentAcademicYear);
    const age = calculateAge(dateOfBirth);
    const currentYear = currentAcademicYear || getCurrentAcademicYear();

    return `Promotion ${graduationYear}, actuellement en ${currentLevel} (${age} ans)`;
  } catch (error) {
    const age = calculateAge(dateOfBirth);
    return `${currentLevel} (${age} ans)`;
  }
}

/**
 * Check if student is in final year
 * @param currentLevel - Current academic level
 * @returns True if in final year
 */
export function isFinalYear(currentLevel: string): boolean {
  return ['A3', 'B3'].includes(currentLevel);
}

/**
 * Get academic level category
 * @param currentLevel - Current academic level
 * @returns Category: 'prepa', 'bachelor', 'engineering'
 */
export function getAcademicCategory(currentLevel: string): string {
  if (['P1', 'P2'].includes(currentLevel)) return 'prepa';
  if (['B1', 'B2', 'B3'].includes(currentLevel)) return 'bachelor';
  if (['I1', 'I2', 'A1', 'A2', 'A3'].includes(currentLevel)) return 'engineering';
  return 'unknown';
}
