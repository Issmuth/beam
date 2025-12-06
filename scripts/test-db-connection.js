/**
 * Database Connection Test Script
 * 
 * Run with: node scripts/test-db-connection.js
 */

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: '.env.local' });

// Set Google credentials path if specified in env
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const credPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
    console.log('Using credentials from:', credPath);
}

import { getPool, query, closePool } from '../lib/db/connection.js';

async function testConnection() {
    console.log('Testing database connection...\n');

    try {
        // Test 1: Get connection pool
        console.log('1. Getting connection pool...');
        const pool = await getPool();
        console.log('   ✓ Connection pool created successfully\n');

        // Test 2: Simple query
        console.log('2. Running test query (SELECT 1)...');
        const { rows } = await query('SELECT 1 as test');
        console.log('   ✓ Query executed successfully:', rows[0], '\n');

        // Test 3: Check if users table exists
        console.log('3. Checking users table...');
        const { rows: tables } = await query('SHOW TABLES LIKE "users"');
        if (tables.length > 0) {
            console.log('   ✓ Users table exists\n');

            // Get table structure
            const { rows: columns } = await query('DESCRIBE users');
            console.log('   Table structure:');
            columns.forEach(col => {
                console.log(`     - ${col.Field}: ${col.Type}`);
            });
        } else {
            console.log('   ⚠ Users table does not exist. Run schema.sql to create it.\n');
        }

        console.log('\n✓ All connection tests passed!');

    } catch (error) {
        console.error('\n✗ Connection test failed:', error.message);
        process.exit(1);
    } finally {
        await closePool();
        console.log('\nConnection pool closed.');
    }
}

testConnection();
