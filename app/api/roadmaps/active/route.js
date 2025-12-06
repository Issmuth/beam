/**
 * Active Roadmap API Route
 * GET - Get the most recent active roadmap for the user
 */

import { withAuth } from '@/lib/middleware/authMiddleware';
import { getUserByFirebaseUid } from '@/lib/db/userRepository';
import { getActiveRoadmap } from '@/lib/db/roadmapRepository';

/**
 * GET /api/roadmaps/active - Get the most recent active roadmap
 */
export const GET = withAuth(async (request) => {
    try {
        const firebaseUid = request.user.uid;
        const user = await getUserByFirebaseUid(firebaseUid);

        if (!user) {
            return Response.json({ error: 'User not found' }, { status: 404 });
        }

        const roadmap = await getActiveRoadmap(user.id);

        if (!roadmap) {
            return Response.json({ roadmap: null });
        }

        return Response.json({ roadmap });
    } catch (error) {
        console.error('Error fetching active roadmap:', error);
        return Response.json({ error: 'Failed to fetch roadmap' }, { status: 500 });
    }
});
