/**
 * localStorage utilities for Beam roadmap persistence
 * Supports multiple roadmaps with unique IDs
 * Requirements: 8.2, 8.3
 */

const ROADMAPS_KEY = 'beam_roadmaps';
const ACTIVE_ROADMAP_KEY = 'beam_active_roadmap';

/**
 * Generate a unique ID for roadmaps
 */
function generateId() {
    return `roadmap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all roadmaps from localStorage
 * @returns {Array} - Array of roadmap objects with id and createdAt
 */
export function getAllRoadmaps() {
    if (typeof window === 'undefined') return [];

    try {
        const serialized = localStorage.getItem(ROADMAPS_KEY);
        if (!serialized) return [];
        const roadmaps = JSON.parse(serialized);
        return Array.isArray(roadmaps) ? roadmaps : [];
    } catch (error) {
        console.error('Error getting roadmaps:', error);
        return [];
    }
}

/**
 * Save roadmap data to localStorage (adds to collection)
 * @param {Object} roadmap - The roadmap object to save
 * @returns {string|null} - The ID of the saved roadmap, or null on failure
 */
export function saveRoadmap(roadmap) {
    if (typeof window === 'undefined') return null;

    try {
        const roadmaps = getAllRoadmaps();
        const id = generateId();
        const roadmapWithMeta = {
            ...roadmap,
            id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };

        roadmaps.unshift(roadmapWithMeta); // Add to beginning
        localStorage.setItem(ROADMAPS_KEY, JSON.stringify(roadmaps));
        localStorage.setItem(ACTIVE_ROADMAP_KEY, id);
        return id;
    } catch (error) {
        console.error('Error saving roadmap:', error);
        return null;
    }
}

/**
 * Get a specific roadmap by ID
 * @param {string} id - The roadmap ID
 * @returns {Object|null} - The roadmap object or null
 */
export function getRoadmapById(id) {
    if (typeof window === 'undefined') return null;

    const roadmaps = getAllRoadmaps();
    return roadmaps.find(r => r.id === id) || null;
}

/**
 * Retrieve the active/current roadmap from localStorage
 * @returns {Object|null} - The roadmap object or null if not found
 */
export function getRoadmap() {
    if (typeof window === 'undefined') return null;

    try {
        const activeId = localStorage.getItem(ACTIVE_ROADMAP_KEY);
        if (activeId) {
            const roadmap = getRoadmapById(activeId);
            if (roadmap) return roadmap;
        }

        // Fallback to most recent roadmap
        const roadmaps = getAllRoadmaps();
        return roadmaps.length > 0 ? roadmaps[0] : null;
    } catch (error) {
        console.error('Error retrieving roadmap:', error);
        return null;
    }
}

/**
 * Set the active roadmap by ID
 * @param {string} id - The roadmap ID to set as active
 */
export function setActiveRoadmap(id) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVE_ROADMAP_KEY, id);
}

/**
 * Delete a roadmap by ID
 * @param {string} id - The roadmap ID to delete
 * @returns {boolean} - True if successful
 */
export function deleteRoadmap(id) {
    if (typeof window === 'undefined') return false;

    try {
        const roadmaps = getAllRoadmaps();
        const filtered = roadmaps.filter(r => r.id !== id);
        localStorage.setItem(ROADMAPS_KEY, JSON.stringify(filtered));

        // Clear active if it was deleted
        const activeId = localStorage.getItem(ACTIVE_ROADMAP_KEY);
        if (activeId === id) {
            localStorage.removeItem(ACTIVE_ROADMAP_KEY);
        }
        return true;
    } catch (error) {
        console.error('Error deleting roadmap:', error);
        return false;
    }
}

/**
 * Clear all roadmap data from localStorage
 * @returns {boolean} - True if successful
 */
export function clearRoadmap() {
    if (typeof window === 'undefined') return false;

    try {
        localStorage.removeItem(ROADMAPS_KEY);
        localStorage.removeItem(ACTIVE_ROADMAP_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing roadmaps:', error);
        return false;
    }
}

/**
 * Check if any roadmap data exists
 * @returns {boolean} - True if roadmaps exist
 */
export function hasRoadmap() {
    if (typeof window === 'undefined') return false;
    return getAllRoadmaps().length > 0;
}
