import { z } from 'zod';

// Appliance validation schemas
export const createApplianceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  brand: z.string().max(255, 'Brand must be less than 255 characters').optional(),
  model: z.string().max(255, 'Model must be less than 255 characters').optional(),
  serialNumber: z.string().max(255, 'Serial number must be less than 255 characters').optional(),
  purchaseDate: z.string().datetime('Invalid date format. Use ISO 8601 format'),
  purchaseLocation: z.string().max(255, 'Purchase location must be less than 255 characters').optional(),
  warrantyMonths: z.number().int().min(1, 'Warranty months must be at least 1').max(1200, 'Warranty months cannot exceed 1200'),
  supportContactId: z.string().uuid('Invalid support contact ID format').optional(),
  notes: z.string().optional(),
  category: z.enum(['kitchen', 'laundry', 'heating-cooling', 'entertainment', 'cleaning', 'other']).optional()
});

export const updateApplianceSchema = createApplianceSchema.partial();

export const applianceParamsSchema = z.object({
  id: z.string().uuid('Invalid appliance ID format')
});

export const applianceQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['active', 'expiring', 'expired', 'all']).optional(),
  category: z.enum(['kitchen', 'laundry', 'heating-cooling', 'entertainment', 'cleaning', 'other']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0),
  sortBy: z.enum(['name', 'purchaseDate', 'warrantyExpiryDate', 'createdAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});

// Service contact validation schemas
export const createServiceContactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  phone: z.string().max(50, 'Phone must be less than 50 characters').optional(),
  email: z.string().email('Invalid email format').max(255, 'Email must be less than 255 characters').optional(),
  website: z.string().url('Invalid website URL').max(255, 'Website must be less than 255 characters').optional()
});

export const updateServiceContactSchema = createServiceContactSchema.partial();

export const serviceContactParamsSchema = z.object({
  id: z.string().uuid('Invalid service contact ID format')
});

// Maintenance task validation schemas
export const createMaintenanceTaskSchema = z.object({
  applianceId: z.string().uuid('Invalid appliance ID format'),
  taskName: z.string().min(1, 'Task name is required').max(255, 'Task name must be less than 255 characters'),
  scheduledDate: z.string().datetime('Invalid date format. Use ISO 8601 format'),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'yearly']),
  providerId: z.string().uuid('Invalid provider ID format').optional(),
  completed: z.boolean().optional().default(false)
});

export const updateMaintenanceTaskSchema = createMaintenanceTaskSchema.partial();

export const maintenanceTaskParamsSchema = z.object({
  id: z.string().uuid('Invalid maintenance task ID format')
});

export const maintenanceTaskQuerySchema = z.object({
  applianceId: z.string().uuid('Invalid appliance ID format').optional(),
  completed: z.coerce.boolean().optional(),
  frequency: z.enum(['one-time', 'monthly', 'quarterly', 'yearly']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
  offset: z.coerce.number().int().min(0).optional().default(0)
});

// Generic validation helpers
export const validateRequest = <T>(schema: z.ZodSchema<T>) => {
  return (data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    return result.data;
  };
};