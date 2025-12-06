/**
 * Roadmaps API Route
 * GET - List all roadmaps for authenticated user
 * POST - Create a new roadmap
 */

import { withAuth } from '@/lib/middleware/authMiddleware';
import { getUserByFirebaseUid } from '@/lib/db/userRepository';
import { createRoadmap, getRoadmapsByUserId } from '@/lib/db/roadmapRepository';

/**
 * GET /api/roadmaps - Get all roadmaps for the authenticated user
 */
export const GET = withAuth(async (request) => {
    try {
        const firebaseUid = request.user.uid;
        const user = await getUserByFirebaseUid(firebaseUid);

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const roadmaps = await getRoadmapsByUserId(user.id);

        return Response.json({ roadmaps });
    } catch (error) {
        console.error('Error fetching roadmaps:', error);
        return Response.json({ error: 'Failed to fetch roadmaps' }, { status: 500 });
    }
});

/**
 * POST /api/roadmaps - Create a new roadmap
 */
export const POST = withAuth(async (request) => {
    try {
        const firebaseUid = request.user.uid;
        const user = await getUserByFirebaseUid(firebaseUid);

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        let body;
        try {
            body = await request.json();
        } catch {
            return Response.json({ error: 'Invalid request body' }, { status: 400 });
        }

        const { roadmap } = body;

        if (!roadmap || !roadmap.goal) {
            return Response.json({ error: 'Roadmap with goal is required' }, { status: 400 });
        }

        const created = await createRoadmap({
            userId: user.id,
            goal: roadmap.goal,
            durationEstimate: roadmap.duration_estimate,
            roadmapData: roadmap
        });

        return Response.json({ roadmap: created }, { status: 201 });
    } catch (error) {
        console.error('Error creating roadmap:', error);
        return Response.json({ error: 'Failed to create roadmap' }, { status: 500 });
    }
});
