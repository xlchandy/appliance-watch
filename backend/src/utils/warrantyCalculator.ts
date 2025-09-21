import { WarrantyStatus } from '../types/index.js';

export interface WarrantyStatusResult {
  status: WarrantyStatus;
  daysUntilExpiry: number;
}

/**
 * Calculate warranty status based on expiry date
 * @param expiryDate - The warranty expiry date
 * @returns Object containing warranty status and days until expiry
 */
export function calculateWarrantyStatus(expiryDate: Date | string): WarrantyStatusResult {
  const today = new Date();
  const expiry = new Date(expiryDate);
  
  // Reset time to start of day for accurate comparison
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let status: WarrantyStatus;
  if (daysUntilExpiry < 0) {
    status = 'expired';
  } else if (daysUntilExpiry <= 30) {
    status = 'expiring';
  } else {
    status = 'active';
  }
  
  return { status, daysUntilExpiry };
}

/**
 * Calculate warranty expiry date from purchase date and warranty months
 * @param purchaseDate - The purchase date (ISO string or Date)
 * @param warrantyMonths - Number of warranty months
 * @returns The warranty expiry date
 */
export function calculateWarrantyExpiry(purchaseDate: string | Date, warrantyMonths: number): Date {
  const purchase = new Date(purchaseDate);
  const expiry = new Date(purchase);
  expiry.setMonth(expiry.getMonth() + warrantyMonths);
  return expiry;
}

/**
 * Check if a warranty is expiring within a given number of days
 * @param expiryDate - The warranty expiry date
 * @param days - Number of days to check (default: 30)
 * @returns Boolean indicating if warranty is expiring soon
 */
export function isWarrantyExpiringSoon(expiryDate: Date | string, days: number = 30): boolean {
  const { daysUntilExpiry } = calculateWarrantyStatus(expiryDate);
  return daysUntilExpiry <= days && daysUntilExpiry >= 0;
}

/**
 * Format warranty status for display
 * @param status - The warranty status
 * @returns Formatted status string
 */
export function formatWarrantyStatus(status: WarrantyStatus): string {
  switch (status) {
    case 'active':
      return 'Active';
    case 'expiring':
      return 'Expiring Soon';
    case 'expired':
      return 'Expired';
    default:
      return 'Unknown';
  }
}

/**
 * Get warranty status color for UI purposes
 * @param status - The warranty status
 * @returns Color code or class name
 */
export function getWarrantyStatusColor(status: WarrantyStatus): string {
  switch (status) {
    case 'active':
      return 'green';
    case 'expiring':
      return 'orange';
    case 'expired':
      return 'red';
    default:
      return 'gray';
  }
}