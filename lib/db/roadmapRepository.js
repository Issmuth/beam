/**
 * Roadmap Repository Module
 * Data access layer for roadmap operations in Cloud SQL MySQL.
 */

import { query } from './connection.js';

/**
 * Create a new roadmap for a user.
 * @param {Object} data - Roadmap data
 * @param {number} data.userId - User's database ID
 * @param {string} data.goal - Learning goal
 * @param {string} data.durationEstimate - Estimated duration
 * @param {Object} data.roadmapData - Full roadmap JSON object
 * @returns {Promise<Object>} Created roadmap
 */
export async function createRoadmap({ userId, goal, durationEstimate, roadmapData }) {
    if (!userId || !goal || !roadmapData) {
        throw new Error('userId, goal, and roadmapData are required');
    }

    const sql = `
        INSERT INTO roadmaps (user_id, goal, duration_estimate, roadmap_data)
        VALUES (?, ?, ?, ?)
    `;

    const { rows: result } = await query(sql, [
        userId,
        goal,
        durationEstimate || null,
        JSON.stringify(roadmapData)
    ]);

    return {
        id: result.insertId,
        userId,
        goal,
        durationEstimate,
        roadmapData,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

/**
 * Get all roadmaps for a user.
 * @param {number} userId - User's database ID
 * @returns {Promise<Array>} Array of roadmaps
 */
export async function getRoadmapsByUserId(userId) {
    if (!userId) {
        throw new Error('userId is required');
    }

    const sql = `
        SELECT id, user_id, goal, duration_estimate, roadmap_data, is_active, created_at, updated_at
        FROM roadmaps
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    const { rows } = await query(sql, [userId]);

    return rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        goal: row.goal,
        durationEstimate: row.duration_estimate,
        roadmapData: typeof row.roadmap_data === 'string' ? JSON.parse(row.roadmap_data) : row.roadmap_data,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    }));
}


/**
 * Get a specific roadmap by ID.
 * @param {number} roadmapId - Roadmap ID
 * @param {number} userId - User's database ID (for authorization)
 * @returns {Promise<Object|null>} Roadmap or null if not found
 */
export async function getRoadmapById(roadmapId, userId) {
    if (!roadmapId || !userId) {
        throw new Error('roadmapId and userId are required');
    }

    const sql = `
        SELECT id, user_id, goal, duration_estimate, roadmap_data, is_active, created_at, updated_at
        FROM roadmaps
        WHERE id = ? AND user_id = ?
    `;

    const { rows } = await query(sql, [roadmapId, userId]);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];
    return {
        id: row.id,
        userId: row.user_id,
        goal: row.goal,
        durationEstimate: row.duration_estimate,
        roadmapData: typeof row.roadmap_data === 'string' ? JSON.parse(row.roadmap_data) : row.roadmap_data,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

/**
 * Get the most recent active roadmap for a user.
 * @param {number} userId - User's database ID
 * @returns {Promise<Object|null>} Most recent roadmap or null
 */
export async function getActiveRoadmap(userId) {
    if (!userId) {
        throw new Error('userId is required');
    }

    const sql = `
        SELECT id, user_id, goal, duration_estimate, roadmap_data, is_active, created_at, updated_at
        FROM roadmaps
        WHERE user_id = ? AND is_active = TRUE
        ORDER BY created_at DESC
        LIMIT 1
    `;

    const { rows } = await query(sql, [userId]);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];
    return {
        id: row.id,
        userId: row.user_id,
        goal: row.goal,
        durationEstimate: row.duration_estimate,
        roadmapData: typeof row.roadmap_data === 'string' ? JSON.parse(row.roadmap_data) : row.roadmap_data,
        isActive: Boolean(row.is_active),
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

/**
 * Delete a roadmap.
 * @param {number} roadmapId - Roadmap ID
 * @param {number} userId - User's database ID (for authorization)
 * @returns {Promise<boolean>} True if deleted
 */
export async function deleteRoadmap(roadmapId, userId) {
    if (!roadmapId || !userId) {
        throw new Error('roadmapId and userId are required');
    }

    const sql = `DELETE FROM roadmaps WHERE id = ? AND user_id = ?`;
    const { rows: result } = await query(sql, [roadmapId, userId]);

    return result.affectedRows > 0;
}

/**
 * Set a roadmap as active/inactive.
 * @param {number} roadmapId - Roadmap ID
 * @param {number} userId - User's database ID
 * @param {boolean} isActive - Active status
 * @returns {Promise<boolean>} True if updated
 */
export async function setRoadmapActive(roadmapId, userId, isActive) {
    if (!roadmapId || !userId) {
        throw new Error('roadmapId and userId are required');
    }

    const sql = `UPDATE roadmaps SET is_active = ? WHERE id = ? AND user_id = ?`;
    const { rows: result } = await query(sql, [isActive, roadmapId, userId]);

    return result.affectedRows > 0;
}
