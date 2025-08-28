/**
 * Phone number formatting utilities
 */

/**
 * Format a phone number for display with international format
 * @param phone - The raw phone number string
 * @returns Formatted phone number (e.g., "+33 6 12 34 56 78", "+1 555 123 4567")
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');

  // If it starts with +, preserve it
  if (cleaned.startsWith('+')) {
    const withoutPlus = cleaned.slice(1);

    // French numbers
    if (withoutPlus.startsWith('33')) {
      const number = withoutPlus.slice(2);
      if (number.length === 9) {
        return `+33 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
      }
    }
    // US/Canada numbers
    else if (withoutPlus.startsWith('1')) {
      const number = withoutPlus.slice(1);
      if (number.length === 10) {
        return `+1 ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6, 10)}`;
      }
    }
    // UK numbers
    else if (withoutPlus.startsWith('44')) {
      const number = withoutPlus.slice(2);
      if (number.length >= 10) {
        return `+44 ${number.slice(0, 2)} ${number.slice(2, 6)} ${number.slice(6)}`;
      }
    }
    // Germany numbers
    else if (withoutPlus.startsWith('49')) {
      const number = withoutPlus.slice(2);
      if (number.length >= 10) {
        return `+49 ${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`;
      }
    }
  }

  // Handle French numbers without country code
  const digitsOnly = cleaned.replace(/\D/g, '');
  if (digitsOnly.startsWith('0') && digitsOnly.length === 10) {
    const number = digitsOnly.slice(1);
    return `+33 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`;
  } else if (digitsOnly.length === 9 && /^[67]/.test(digitsOnly)) {
    return `+33 ${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 3)} ${digitsOnly.slice(3, 5)} ${digitsOnly.slice(5, 7)} ${digitsOnly.slice(7, 9)}`;
  }

  // Return as-is if format is not recognized
  return phone;
}

/**
 * Format phone number input in real-time for international numbers
 * @param value - Current input value
 * @returns Formatted value for input field
 */
export function formatPhoneInput(value: string): string {
  if (!value) return '';

  // Remove all non-digit characters except +
  let cleaned = value.replace(/[^\d+]/g, '');

  // If no +, add it
  if (!cleaned.startsWith('+')) {
    if (cleaned.length > 0) {
      cleaned = '+' + cleaned;
    } else {
      return '+';
    }
  }

  const withoutPlus = cleaned.slice(1);

  // France (+33)
  if (withoutPlus.startsWith('33')) {
    const numberPart = withoutPlus.slice(2);
    let formatted = '+33';
    if (numberPart.length > 0) formatted += ' ' + numberPart.slice(0, 1);
    if (numberPart.length > 1) formatted += ' ' + numberPart.slice(1, 3);
    if (numberPart.length > 3) formatted += ' ' + numberPart.slice(3, 5);
    if (numberPart.length > 5) formatted += ' ' + numberPart.slice(5, 7);
    if (numberPart.length > 7) formatted += ' ' + numberPart.slice(7, 9);
    return formatted;
  }
  // US/Canada (+1)
  else if (withoutPlus.startsWith('1')) {
    const numberPart = withoutPlus.slice(1);
    let formatted = '+1';
    if (numberPart.length > 0) formatted += ' ' + numberPart.slice(0, 3);
    if (numberPart.length > 3) formatted += ' ' + numberPart.slice(3, 6);
    if (numberPart.length > 6) formatted += ' ' + numberPart.slice(6, 10);
    return formatted;
  }
  // UK (+44)
  else if (withoutPlus.startsWith('44')) {
    const numberPart = withoutPlus.slice(2);
    let formatted = '+44';
    if (numberPart.length > 0) formatted += ' ' + numberPart.slice(0, 2);
    if (numberPart.length > 2) formatted += ' ' + numberPart.slice(2, 6);
    if (numberPart.length > 6) formatted += ' ' + numberPart.slice(6);
    return formatted;
  }
  // Germany (+49)
  else if (withoutPlus.startsWith('49')) {
    const numberPart = withoutPlus.slice(2);
    let formatted = '+49';
    if (numberPart.length > 0) formatted += ' ' + numberPart.slice(0, 3);
    if (numberPart.length > 3) formatted += ' ' + numberPart.slice(3, 7);
    if (numberPart.length > 7) formatted += ' ' + numberPart.slice(7);
    return formatted;
  }
  // Default formatting for other countries
  else {
    let formatted = '+' + withoutPlus.slice(0, 3);
    if (withoutPlus.length > 3) formatted += ' ' + withoutPlus.slice(3);
    return formatted;
  }
}

/**
 * Validate an international phone number
 * @param phone - The phone number to validate
 * @returns True if valid international phone number
 */
export function isValidPhone(phone: string): boolean {
  if (!phone) return false;

  const cleaned = phone.replace(/\D/g, '');

  // Basic validation - must be between 7 and 15 digits with country code
  if (cleaned.length < 7 || cleaned.length > 15) return false;

  // Must start with a country code (1-3 digits)
  return /^\+?\d{7,15}$/.test(phone);
}

/**
 * Validate a French phone number (legacy function for backwards compatibility)
 * @param phone - The phone number to validate
 * @returns True if valid French mobile number
 */
export function isValidFrenchPhone(phone: string): boolean {
  if (!phone) return false;

  const cleaned = phone.replace(/\D/g, '');

  // Check various formats
  if (cleaned.startsWith('33')) {
    const number = cleaned.slice(2);
    return number.length === 9 && /^[67]/.test(number);
  } else if (cleaned.startsWith('0')) {
    const number = cleaned.slice(1);
    return number.length === 9 && /^[67]/.test(number);
  } else if (cleaned.length === 9) {
    return /^[67]/.test(cleaned);
  }

  return false;
}

/**
 * Clean phone number for storage (remove formatting)
 * @param phone - Formatted phone number
 * @returns Clean phone number for database storage
 */
export function cleanPhoneNumber(phone: string): string {
  if (!phone) return '';

  const cleaned = phone.replace(/\D/g, '');

  // Convert to international format for storage
  if (cleaned.startsWith('33')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('0')) {
    return '+33' + cleaned.slice(1);
  } else if (cleaned.length === 9) {
    return '+33' + cleaned;
  }

  return phone;
}
