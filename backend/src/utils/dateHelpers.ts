/**
 * Format a date to ISO string (YYYY-MM-DD format)
 * @param date - The date to format
 * @returns ISO date string
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Parse a date string and return a Date object
 * @param dateString - The date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

/**
 * Check if a date string is valid
 * @param dateString - The date string to validate
 * @returns Boolean indicating if date is valid
 */
export function isValidDate(dateString: string): boolean {
  return parseDate(dateString) !== null;
}

/**
 * Get the start of day for a given date
 * @param date - The date
 * @returns Date object at start of day
 */
export function getStartOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Get the end of day for a given date
 * @param date - The date
 * @returns Date object at end of day
 */
export function getEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
}

/**
 * Add months to a date
 * @param date - The base date
 * @param months - Number of months to add
 * @returns New date with months added
 */
export function addMonths(date: Date, months: number): Date {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() + months);
  return newDate;
}

/**
 * Calculate difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference
 */
export function daysDifference(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format a date for display purposes
 * @param date - The date to format
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDateForDisplay(date: Date, locale: string = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}