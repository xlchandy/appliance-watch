import { WarrantyStatus } from '@/types/appliance';

export const calculateWarrantyExpiry = (purchaseDate: string, warrantyMonths: number): string => {
  const purchase = new Date(purchaseDate);
  const expiry = new Date(purchase);
  expiry.setMonth(expiry.getMonth() + warrantyMonths);
  return expiry.toISOString().split('T')[0];
};

export const getWarrantyStatus = (expiryDate: string): { status: WarrantyStatus; daysUntilExpiry: number } => {
  const today = new Date();
  const expiry = new Date(expiryDate);
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
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getRelativeTimeString = (daysUntilExpiry: number): string => {
  if (daysUntilExpiry < 0) {
    const daysExpired = Math.abs(daysUntilExpiry);
    return `Expired ${daysExpired} day${daysExpired === 1 ? '' : 's'} ago`;
  } else if (daysUntilExpiry === 0) {
    return 'Expires today';
  } else if (daysUntilExpiry === 1) {
    return 'Expires tomorrow';
  } else if (daysUntilExpiry <= 30) {
    return `Expires in ${daysUntilExpiry} days`;
  } else {
    const months = Math.floor(daysUntilExpiry / 30);
    return `${months} month${months === 1 ? '' : 's'} remaining`;
  }
};