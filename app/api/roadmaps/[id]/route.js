/**
 * Single Roadmap API Route
 * GET - Get a specific roadmap
 * DELETE - Delete a roadmap
 */

import { withAuth } from '@/lib/middleware/authMiddleware';
import { getUserByFirebaseUid } from '@/lib/db/userRepository';
import { getRoadmapById, deleteRoadmap } from '@/lib/db/roadmapRepository';

/**
 * GET /api/roadmaps/[id] - Get a specific roadmap
 */
export const GET = withAuth(async (request, { params }) => {
    try {
        const { id } = await params;
        const roadmapId = parseInt(id, 10);

        if (isNaN(roadmapId)) {
            return Response.json({ error: 'Invalid roadmap ID' }, { status: 400 });
        }

        const firebaseUid = request.user.uid;
        const user = await getUserByFirebaseUid(firebaseUid);

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const roadmap = await getRoadmapById(roadmapId, user.id);

        if (!roadmap) {
            return Response.json({ error: 'Roadmap not found' }, { status: 404 });
        }

        return Response.json({ roadmap });
    } catch (error) {
        console.error('Error fetching roadmap:', error);
        return Response.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
    }
});

/**
 * DELETE /api/roadmaps/[id] - Delete a roadmap
 */
export const DELETE = withAuth(async (request, { params }) => {
    try {
        const { id } = await params;
        const roadmapId = parseInt(id, 10);

        if (isNaN(roadmapId)) {
            return Response.json({ error: 'Invalid roadmap ID' }, { status: 400 });
        }

        const firebaseUid = request.user.uid;
        const user = await getUserByFirebaseUid(firebaseUid);

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const deleted = await deleteRoadmap(roadmapId, user.id);

        if (!deleted) {
            return Response.json({ error: 'Roadmap not found' }, { status: 404 });
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Error deleting roadmap:', error);
        return Response.json({ error: 'Failed to delete roadmap' }, { status: 500 });
    }
});
