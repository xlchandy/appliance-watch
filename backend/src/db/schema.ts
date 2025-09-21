import { pgTable, uuid, varchar, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

// Enums matching the frontend types
export const applianceCategoryEnum = pgEnum('appliance_category', [
  'kitchen', 'laundry', 'heating-cooling', 'entertainment', 'cleaning', 'other'
]);

export const taskFrequencyEnum = pgEnum('task_frequency', [
  'one-time', 'monthly', 'quarterly', 'yearly'
]);

// Appliances table
export const appliances = pgTable('appliances', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }),
  model: varchar('model', { length: 255 }),
  serialNumber: varchar('serial_number', { length: 255 }),
  purchaseDate: timestamp('purchase_date').notNull(),
  purchaseLocation: varchar('purchase_location', { length: 255 }),
  warrantyMonths: integer('warranty_months').notNull(),
  warrantyExpiryDate: timestamp('warranty_expiry_date').notNull(),
  supportContactId: uuid('support_contact_id').references(() => serviceContacts.id),
  notes: text('notes'),
  category: applianceCategoryEnum('category'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Service contacts table
export const serviceContacts = pgTable('service_contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Maintenance tasks table
export const maintenanceTasks = pgTable('maintenance_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  applianceId: uuid('appliance_id').references(() => appliances.id, { onDelete: 'cascade' }).notNull(),
  taskName: varchar('task_name', { length: 255 }).notNull(),
  scheduledDate: timestamp('scheduled_date').notNull(),
  frequency: taskFrequencyEnum('frequency').notNull(),
  providerId: uuid('provider_id').references(() => serviceContacts.id),
  completed: boolean('completed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Type definitions for inserts and selects
export type InsertAppliance = typeof appliances.$inferInsert;
export type SelectAppliance = typeof appliances.$inferSelect;
export type InsertServiceContact = typeof serviceContacts.$inferInsert;
export type SelectServiceContact = typeof serviceContacts.$inferSelect;
export type InsertMaintenanceTask = typeof maintenanceTasks.$inferInsert;
export type SelectMaintenanceTask = typeof maintenanceTasks.$inferSelect;