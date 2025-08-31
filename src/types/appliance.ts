export interface Appliance {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate: string;
  purchaseLocation?: string;
  warrantyMonths: number;
  warrantyExpiryDate: string;
  supportContactId?: string;
  notes?: string;
  category?: ApplianceCategory;
}

export interface ServiceContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface MaintenanceTask {
  id: string;
  applianceId: string;
  taskName: string;
  scheduledDate: string;
  frequency: TaskFrequency;
  providerId?: string;
  completed?: boolean;
}

export type TaskFrequency = 'one-time' | 'monthly' | 'quarterly' | 'yearly';

export type ApplianceCategory = 
  | 'kitchen'
  | 'laundry' 
  | 'heating-cooling'
  | 'entertainment'
  | 'cleaning'
  | 'other';

export type WarrantyStatus = 'active' | 'expiring' | 'expired';

export interface ApplianceWithStatus extends Appliance {
  warrantyStatus: WarrantyStatus;
  daysUntilExpiry: number;
}