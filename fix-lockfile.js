#!/usr/bin/env node

/**
 * Fix lockfile issues for Railway deployment
 * This script regenerates package-lock.json files to prevent lockfile frozen errors
 */

import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

console.log('🔧 Fixing lockfile issues for Railway deployment...\n');

// Function to safely delete file if it exists
function safeDelete(filePath) {
  if (existsSync(filePath)) {
    unlinkSync(filePath);
    console.log(`✅ Deleted: ${filePath}`);
  }
}

// Function to run npm install
function runNpmInstall(directory = '.') {
  try {
    console.log(`📦 Running npm install in ${directory}...`);
    execSync('npm install --legacy-peer-deps', { 
      cwd: directory, 
      stdio: 'inherit' 
    });
    console.log(`✅ npm install completed in ${directory}\n`);
  } catch (error) {
    console.error(`❌ npm install failed in ${directory}:`, error.message);
    process.exit(1);
  }
}

try {
  // Fix frontend lockfile
  console.log('🔧 Fixing frontend lockfile...');
  safeDelete('package-lock.json');
  runNpmInstall('.');

  // Fix backend lockfile
  console.log('🔧 Fixing backend lockfile...');
  safeDelete(join('backend', 'package-lock.json'));
  runNpmInstall('backend');

  console.log('🎉 Lockfile issues fixed! You can now commit and deploy to Railway.');
  console.log('\nNext steps:');
  console.log('1. git add .');
  console.log('2. git commit -m "Fix lockfile issues for Railway deployment"');
  console.log('3. git push');
  console.log('4. Redeploy on Railway');

} catch (error) {
  console.error('❌ Error fixing lockfiles:', error.message);
  process.exit(1);
}
