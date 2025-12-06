/**
 * User Repository Module
 * 
 * Data access layer for user operations in Cloud SQL MySQL.
 * 
 * Requirements: 1.5, 2.3
 */

import { query } from './connection.js';

/**
 * Create a new user in the database.
 * If a user with the same firebase_uid already exists, returns the existing user.
 * 
 * @param {Object} userData - User data to create
 * @param {string} userData.firebaseUid - Firebase UID
 * @param {string} userData.email - User email
 * @param {string} [userData.displayName] - User display name
 * @returns {Promise<Object>} Created or existing user
 */
export async function createUser(userData) {
    const { firebaseUid, email, displayName = null } = userData;

    if (!firebaseUid || !email) {
        throw new Error('firebaseUid and email are required');
    }

    // Check if user already exists (idempotent creation)
    const existingUser = await getUserByFirebaseUid(firebaseUid);
    if (existingUser) {
        return existingUser;
    }

    const sql = `
        INSERT INTO users (firebase_uid, email, display_name)
        VALUES (?, ?, ?)
    `;

    const { rows: result } = await query(sql, [firebaseUid, email, displayName]);

    // Return the newly created user
    return {
        id: result.insertId,
        firebaseUid,
        email,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: null
    };
}

/**
 * Get a user by their Firebase UID.
 * 
 * @param {string} uid - Firebase UID
 * @returns {Promise<Object|null>} User object or null if not found
 */
export async function getUserByFirebaseUid(uid) {
    if (!uid) {
        throw new Error('Firebase UID is required');
    }

    const sql = `
        SELECT id, firebase_uid, email, display_name, created_at, updated_at, last_login_at
        FROM users
        WHERE firebase_uid = ?
    `;

    const { rows } = await query(sql, [uid]);

    if (rows.length === 0) {
        return null;
    }

    const user = rows[0];
    return {
        id: user.id,
        firebaseUid: user.firebase_uid,
        email: user.email,
        displayName: user.display_name,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        lastLoginAt: user.last_login_at
    };
}

/**
 * Update the last login timestamp for a user.
 * 
 * @param {string} uid - Firebase UID
 * @returns {Promise<void>}
 */
export async function updateLastLogin(uid) {
    if (!uid) {
        throw new Error('Firebase UID is required');
    }

    const sql = `
        UPDATE users
        SET last_login_at = CURRENT_TIMESTAMP
        WHERE firebase_uid = ?
    `;

    const { rows: result } = await query(sql, [uid]);

    if (result.affectedRows === 0) {
        throw new Error(`User with Firebase UID ${uid} not found`);
    }
}
