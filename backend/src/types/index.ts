// Types matching the frontend appliance.ts file
export type ApplianceCategory = 
  | 'kitchen'
  | 'laundry' 
  | 'heating-cooling'
  | 'entertainment'
  | 'cleaning'
  | 'other';

export type TaskFrequency = 'one-time' | 'monthly' | 'quarterly' | 'yearly';
export type WarrantyStatus = 'active' | 'expiring' | 'expired';

// Base interfaces matching frontend
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
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceTask {
  id: string;
  applianceId: string;
  taskName: string;
  scheduledDate: string;
  frequency: TaskFrequency;
  providerId?: string;
  completed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplianceWithStatus extends Appliance {
  warrantyStatus: WarrantyStatus;
  daysUntilExpiry: number;
}

// Request/Response types for API
export interface CreateApplianceRequest {
  name: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate: string;
  purchaseLocation?: string;
  warrantyMonths: number;
  supportContactId?: string;
  notes?: string;
  category?: ApplianceCategory;
}

export interface UpdateApplianceRequest extends Partial<CreateApplianceRequest> {}

export interface ApplianceQueryParams {
  search?: string;
  status?: WarrantyStatus | 'all';
  category?: ApplianceCategory;
  limit?: number;
  offset?: number;
  sortBy?: 'name' | 'purchaseDate' | 'warrantyExpiryDate';
  sortOrder?: 'asc' | 'desc';
}

export interface ApplianceStatsResponse {
  total: number;
  active: number;
  expiring: number;
  expired: number;
  byCategory: Record<ApplianceCategory, number>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}