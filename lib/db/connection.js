/**
 * Database Connection Module
 * 
 * Implements connection pool using Cloud SQL Connector for secure
 * connections to Google Cloud SQL MySQL instances.
 * 
 * Supports credentials via:
 * - GOOGLE_APPLICATION_CREDENTIALS_JSON env variable (JSON string)
 * - GOOGLE_APPLICATION_CREDENTIALS file path (local development)
 * 
 * Requirements: 4.1, 4.2, 4.3
 */

import { Connector } from '@google-cloud/cloud-sql-connector';
import { GoogleAuth } from 'google-auth-library';
import mysql from 'mysql2/promise';

let connector = null;
let pool = null;

/**
 * Get GoogleAuth instance with credentials from environment
 */
function getAuthClient() {
    const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (credentialsJson) {
        try {
            const credentials = JSON.parse(credentialsJson);
            console.log('Using credentials from GOOGLE_APPLICATION_CREDENTIALS_JSON');
            return new GoogleAuth({
                credentials,
                scopes: ['https://www.googleapis.com/auth/sqlservice.admin'],
            });
        } catch (e) {
            console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', e.message);
        }
    }

    // Fall back to default credentials (file-based or ADC)
    console.log('Using default credentials');
    return new GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/sqlservice.admin'],
    });
}

/**
 * Get or create the database connection pool.
 * Uses Cloud SQL Connector for secure connections.
 * 
 * @returns {Promise<mysql.Pool>} MySQL connection pool
 */
export async function getPool() {
    if (pool) {
        return pool;
    }

    const instanceConnectionName = process.env.INSTANCE_CONNECTION_NAME;
    const dbUser = process.env.DB_USER;
    const dbPass = process.env.DB_PASS;
    const dbName = process.env.DB_NAME;

    if (!instanceConnectionName || !dbUser || !dbPass || !dbName) {
        throw new Error(
            'Missing required database environment variables: INSTANCE_CONNECTION_NAME, DB_USER, DB_PASS, DB_NAME'
        );
    }

    try {
        const authClient = getAuthClient();

        // Create connector with auth client
        connector = new Connector({
            auth: authClient,
        });

        const clientOpts = await connector.getOptions({
            instanceConnectionName,
            ipType: 'PUBLIC',
        });

        pool = mysql.createPool({
            ...clientOpts,
            user: dbUser,
            password: dbPass,
            database: dbName,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        return pool;
    } catch (error) {
        console.error('Failed to establish database connection:', error.message);
        throw error;
    }
}

/**
 * Execute a SQL query using the connection pool.
 * 
 * @param {string} sql - SQL query string
 * @param {any[]} [params] - Query parameters for prepared statements
 * @returns {Promise<{rows: any[], fields: any[]}>} Query result
 */
export async function query(sql, params = []) {
    const connectionPool = await getPool();

    try {
        const [rows, fields] = await connectionPool.execute(sql, params);
        return { rows, fields };
    } catch (error) {
        console.error('Database query error:', error.message);
        throw error;
    }
}

/**
 * Close the connection pool and connector.
 * Should be called when shutting down the application.
 * 
 * @returns {Promise<void>}
 */
export async function closePool() {
    if (pool) {
        await pool.end();
        pool = null;
    }

    if (connector) {
        connector.close();
        connector = null;
    }
}
