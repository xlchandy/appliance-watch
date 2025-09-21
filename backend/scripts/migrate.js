#!/usr/bin/env node

import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔄 Starting database migration...');

try {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  console.log('📊 Pushing schema to database...');
  execSync('npx drizzle-kit push:pg', { stdio: 'inherit' });
  
  console.log('✅ Database migration completed successfully!');
} catch (error) {
  console.error('❌ Database migration failed:', error.message);
  process.exit(1);
}